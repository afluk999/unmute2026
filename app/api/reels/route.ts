import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const db = getAdminDb();

    const snapshot = await db.collection("reel_items").get();

    const reels = snapshot.docs
      .map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          title: data.title || "",
          tag: data.tag || "Reel",
          description: data.description || "",
          videoUrl: data.videoUrl || data.mediaUrl || "",
          thumbnailUrl: data.thumbnailUrl || "",
          mediaUrl: data.mediaUrl || "",
          status: data.status || "published",
          createdAt: data.createdAt || "",
        };
      })
      .filter((item) => item.status === "published" && item.videoUrl)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    return NextResponse.json({
      success: true,
      count: reels.length,
      reels,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reels API failed";

    return NextResponse.json(
      {
        success: false,
        message,
        reels: [],
      },
      { status: 500 }
    );
  }
}