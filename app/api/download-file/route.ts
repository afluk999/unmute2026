import { NextRequest, NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
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

function safeFileName(name: string) {
  return name
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing file id",
        },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    const doc = await db.collection("download_items").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "File not found",
        },
        { status: 404 }
      );
    }

    const data = doc.data();

    if (!data || data.status !== "published" || !data.mediaUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "File is not available",
        },
        { status: 404 }
      );
    }

    const cloudinaryResponse = await fetch(data.mediaUrl);

    if (!cloudinaryResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not fetch file",
        },
        { status: 500 }
      );
    }

    const fileBuffer = await cloudinaryResponse.arrayBuffer();

    const fileName = safeFileName(
      data.fileName || `${data.title || "unmute-file"}.pdf`
    );

    const contentType =
      data.fileType ||
      cloudinaryResponse.headers.get("content-type") ||
      "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(
          fileName
        )}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Download failed";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}