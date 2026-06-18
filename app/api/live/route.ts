import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const teams = [
  {
    rank: 1,
    name: "Vectors",
    team: "Vectors",
    color: "#2aa1b3",
    score: 0,
    difference: "+0",
  },
  {
    rank: 2,
    name: "Vanguards",
    team: "Vanguards",
    color: "#bf7d2a",
    score: 0,
    difference: "+0",
  },
  {
    rank: 3,
    name: "Vortex",
    team: "Vortex",
    color: "#b41f6c",
    score: 0,
    difference: "-",
  },
];

const categories = [
  "Bidaya",
  "Ula",
  "Thaniya",
  "Thanawiyyah",
  "Aliya",
  "Kulliyah",
];

function getFallbackData(message: string) {
  return {
    success: false,
    type: "all",
    generatedAt: new Date().toISOString(),
    teams,
    results: [],
    latestResults: [],
    categoryScores: categories.map((category) => ({
      category,
      leader: "Vectors",
      scores: teams.map((team) => ({
        team: team.name,
        score: 0,
        color: team.color,
      })),
    })),
    categoryToppers: categories.map((category) => ({
      category,
      student: "-",
      team: "-",
      points: 0,
      program: "-",
    })),
    downloads: [],
    gallery: [],
    announcements: [],
    source: "fallback",
    message,
  };
}

export async function GET() {
  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!appsScriptUrl) {
      return NextResponse.json(
        getFallbackData("GOOGLE_APPS_SCRIPT_URL is missing in .env.local"),
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const url = appsScriptUrl.includes("?")
      ? `${appsScriptUrl}&type=all`
      : `${appsScriptUrl}?type=all`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script failed: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(
      {
        ...data,
        source: data.source || "google-apps-script",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Live API request failed";

    return NextResponse.json(getFallbackData(message), {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}