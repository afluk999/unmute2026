
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

function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw"
): Promise<{
  secure_url: string;
  public_id: string;
  resource_type: string;
}> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
        });
      }
    );

    stream.end(buffer);
  });
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Admin media API is working",
  });
}

async function optimizeImage(file: File, buffer: Buffer) {
  return buffer;
}

export async function POST(request: NextRequest) {
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

    setupCloudinary();

    const db = getAdminDb();
    const formData = await request.formData();

    const type = String(formData.get("type") || "gallery") as UploadType;
    const title = String(formData.get("title") || "").trim();
    const tag = String(formData.get("tag") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const videoUrl = String(formData.get("videoUrl") || "").trim();
    const file = formData.get("file");

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    if (type === "reel") {
      if (!videoUrl) {
        return NextResponse.json(
          {
            success: false,
            message: "Reel link is required",
          },
          { status: 400 }
        );
      }

      if (!(file instanceof File)) {
        return NextResponse.json(
          {
            success: false,
            message: "Thumbnail image is required",
          },
          { status: 400 }
        );
      }

    const originalBuffer = Buffer.from(await file.arrayBuffer());
const buffer = await optimizeImage(file, originalBuffer);

      const uploaded = await uploadToCloudinary(
        buffer,
        "unmute2k26/reel-thumbnails",
        "image"
      );

      const docRef = await db.collection("reel_items").add({
        title,
        tag: tag || "Reel",
        description,
        videoUrl,
        mediaUrl: videoUrl,
        thumbnailUrl: uploaded.secure_url,
        cloudinaryPublicId: uploaded.public_id,
        resourceType: uploaded.resource_type,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        status: "published",
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Reel link added successfully",
        id: docRef.id,
      });
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File is required",
        },
        { status: 400 }
      );
    }

   const originalBuffer = Buffer.from(await file.arrayBuffer());
const buffer = type === "download" ? originalBuffer : await optimizeImage(file, originalBuffer);
    const isGallery = type === "gallery";

    const uploaded = await uploadToCloudinary(
      buffer,
      isGallery ? "unmute2k26/gallery" : "unmute2k26/downloads",
      isGallery ? "image" : "raw"
    );

    const collectionName = isGallery ? "gallery_items" : "download_items";

    const docRef = await db.collection(collectionName).add({
      title,
      tag: tag || (isGallery ? "Gallery" : "File"),
      description,
      mediaUrl: uploaded.secure_url,
      cloudinaryPublicId: uploaded.public_id,
      resourceType: uploaded.resource_type,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      status: "published",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: isGallery
        ? "Gallery photo uploaded successfully"
        : "Download file uploaded successfully",
      id: docRef.id,
      mediaUrl: uploaded.secure_url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";

    console.error("ADMIN MEDIA ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}