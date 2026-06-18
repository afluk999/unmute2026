import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UploadType = "gallery" | "reel" | "download";

const COOKIE_NAME = "unmute_admin_token";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function isValidAdminToken(token: string | undefined) {
  if (!token) return false;

  const [prefix, expiresValue, signature] = token.split(".");

  if (prefix !== "unmute-admin" || !expiresValue || !signature) {
    return false;
  }

  const expires = Number(expiresValue);

  if (!Number.isFinite(expires) || expires < Date.now()) {
    return false;
  }

  const expected = createHmac("sha256", getSecret())
    .update(`${prefix}.${expires}`)
    .digest("hex");

  return signature === expected;
}

function getCollectionName(type: UploadType) {
  if (type === "reel") return "reel_items";
  if (type === "download") return "download_items";
  return "gallery_items";
}

function getAdminDb() {
  const projectId = getRequiredEnv("FIREBASE_PROJECT_ID");
  const clientEmail = getRequiredEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = getRequiredEnv("FIREBASE_PRIVATE_KEY")
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return getFirestore();
}

function setupCloudinary() {
  cloudinary.config({
    cloud_name: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: getRequiredEnv("CLOUDINARY_API_KEY"),
    api_secret: getRequiredEnv("CLOUDINARY_API_SECRET"),
  });
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!isValidAdminToken(token)) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin login required",
          items: [],
        },
        { status: 401 }
      );
    }

    const type = String(
      request.nextUrl.searchParams.get("type") || "gallery"
    ) as UploadType;

    const db = getAdminDb();
    const collectionName = getCollectionName(type);

    const snapshot = await db.collection(collectionName).get();

    const items = snapshot.docs
      .map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          title: data.title || "",
          tag: data.tag || "",
          description: data.description || "",
          mediaUrl: data.mediaUrl || "",
          videoUrl: data.videoUrl || "",
          thumbnailUrl: data.thumbnailUrl || "",
          fileName: data.fileName || "",
          fileType: data.fileType || "",
          status: data.status || "published",
          createdAt: data.createdAt || "",
        };
      })
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Admin items failed";

    return NextResponse.json(
      {
        success: false,
        message,
        items: [],
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!isValidAdminToken(token)) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin login required",
        },
        { status: 401 }
      );
    }

    const type = String(
      request.nextUrl.searchParams.get("type") || "gallery"
    ) as UploadType;

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing item id",
        },
        { status: 400 }
      );
    }

    setupCloudinary();

    const db = getAdminDb();
    const collectionName = getCollectionName(type);
    const docRef = db.collection(collectionName).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found",
        },
        { status: 404 }
      );
    }

    const data = doc.data();

    if (data?.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(data.cloudinaryPublicId, {
          resource_type: data.resourceType || "image",
        });
      } catch {
        // Firestore delete continues even if Cloudinary delete fails.
      }
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}