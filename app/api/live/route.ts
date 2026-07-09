import { NextResponse } from "next/server";
import {
  finalResults,
  officialCategoryScores,
  officialTeams,
} from "../../../data/finalResults";

export const dynamic = "force-dynamic";

const categories = [
  "Bidaya",
  "Ula",
  "Thaniya",
  "Thanawiyyah",
  "Aliya",
  "Kulliyah",
];

function getCategoryToppers() {
  return categories.map((category) => {
    const categoryResults = finalResults.filter(
      (result) => result.category === category
    );

    const studentMap = new Map<
      string,
      {
        student: string;
        team: string;
        points: number;
        program: string;
      }
    >();

    categoryResults.forEach((result) => {
      const student = result.student || "-";
      const team = result.team || "-";
      const key = `${student}-${team}`;
      const points = Number(result.individualPoints ?? result.points) || 0;

      const existing = studentMap.get(key);

      if (existing) {
        existing.points += points;
      } else {
        studentMap.set(key, {
          student,
          team,
          points,
          program: result.program || "-",
        });
      }
    });

    const topper = [...studentMap.values()].sort(
      (a, b) => b.points - a.points
    )[0];

    return {
      category,
      student: topper?.student || "-",
      team: topper?.team || "-",
      points: topper?.points || 0,
      program: topper?.program || "-",
    };
  });
}

function getLatestResults() {
  return [...finalResults]
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || 0).getTime();
      const dateB = new Date(b.updatedAt || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 12);
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      type: "final",
      generatedAt: new Date().toISOString(),
      source: "final-static-pdf",
      teams: officialTeams,
      results: finalResults,
      latestResults: getLatestResults(),
      categoryScores: officialCategoryScores,
      categoryToppers: getCategoryToppers(),
      downloads: [],
      gallery: [],
      announcements: [],
      message: "Official final PDF results loaded successfully",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
