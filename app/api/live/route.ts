import { NextResponse } from "next/server";
import { finalResults } from "@/data/finalResults";

export const dynamic = "force-dynamic";

const teamsBase = [
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

function getTeamScores() {
  const scoreMap = new Map<string, number>();

  teamsBase.forEach((team) => {
    scoreMap.set(team.name, 0);
  });

  finalResults.forEach((result) => {
    const team = result.team || "-";
    const points = Number(result.points) || 0;

    if (!scoreMap.has(team)) {
      scoreMap.set(team, 0);
    }

    scoreMap.set(team, (scoreMap.get(team) || 0) + points);
  });

  const sortedTeams = teamsBase
    .map((team) => ({
      ...team,
      score: scoreMap.get(team.name) || 0,
    }))
    .sort((a, b) => b.score - a.score);

  return sortedTeams.map((team, index) => {
    const topScore = sortedTeams[0]?.score || 0;

    return {
      ...team,
      rank: index + 1,
      difference: index === 0 ? "+0" : `-${topScore - team.score}`,
    };
  });
}

function getCategoryScores() {
  return categories.map((category) => {
    const categoryResults = finalResults.filter(
      (result) => result.category === category
    );

    const scores = teamsBase.map((team) => {
      const score = categoryResults
        .filter((result) => result.team === team.name)
        .reduce((total, result) => total + (Number(result.points) || 0), 0);

      return {
        team: team.name,
        score,
        color: team.color,
      };
    });

    const leader =
      [...scores].sort((a, b) => b.score - a.score)[0]?.team || "-";

    return {
      category,
      leader,
      scores,
    };
  });
}

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
  const teams = getTeamScores();

  return NextResponse.json(
    {
      success: true,
      type: "final",
      generatedAt: new Date().toISOString(),
      source: "final-static",
      teams,
      results: finalResults,
      latestResults: getLatestResults(),
      categoryScores: getCategoryScores(),
      categoryToppers: getCategoryToppers(),
      downloads: [],
      gallery: [],
      announcements: [],
      message: "Final results loaded successfully",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}