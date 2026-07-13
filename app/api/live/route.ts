import { NextResponse } from "next/server";
import {
  finalResults,
  officialCategoryScores,
  officialCategoryToppers,
  officialTeams,
  type FinalResult,
} from "../../../data/finalResults";

export const dynamic = "force-dynamic";

const REMOTE_TIMEOUT_MS = 1200;

function normalizeText(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function normalizeTeam(value: unknown) {
  const text = normalizeText(value);

  if (text === "vectors") return "Vectors";
  if (text === "vanguards") return "Vanguards";
  if (text === "vortex") return "Vortex";

  return String(value ?? "").trim();
}

function normalizeCategory(value: unknown) {
  const text = normalizeText(value);

  if (text === "bidaya") return "Bidaya";
  if (text === "ula" || text === "uoola") return "Ula";
  if (text === "thaniya") return "Thaniya";

  if (text === "thanawiyyah" || text === "thanawiyya") {
    return "Thanawiyyah";
  }

  if (text === "aliya") return "Aliya";

  if (
    text === "kulliyah" ||
    text === "kulliyya" ||
    text === "kulliyyah" ||
    text === "kuliya" ||
    text === "kuliyya"
  ) {
    return "Kulliyah";
  }

  return String(value ?? "").trim();
}

function isCampusTalent(result: FinalResult) {
  return normalizeText(result.program) === "campustalent";
}

function isEligibleForIndividualTotal(result: FinalResult) {
  if (isCampusTalent(result)) return true;

  if (normalizeCategory(result.category) === "Kulliyah") {
    return false;
  }

  return result.programType !== "group";
}

function getStudentKey(result: FinalResult) {
  const chestNo = String(result.code ?? "").trim();
  const team = normalizeTeam(result.team);
  const category = normalizeCategory(result.category);

  if (chestNo) {
    return `${category}__${chestNo}__${team}`;
  }

  return `${category}__${normalizeText(result.student)}__${team}`;
}

function getIndividualPoints(result: FinalResult) {
  if (!isEligibleForIndividualTotal(result)) return 0;

  const value = Number(result.individualPoints ?? result.points);
  return Number.isFinite(value) ? value : 0;
}

function getOverallToppers() {
  const studentMap = new Map<
    string,
    {
      chestNo: string;
      student: string;
      team: string;
      category: string;
      points: number;
      program: string;
      bestProgramPoints: number;
    }
  >();

  finalResults.forEach((result) => {
    const points = getIndividualPoints(result);
    if (points <= 0) return;

    const key = getStudentKey(result);
    const student = String(result.student || "-").trim();
    const team = normalizeTeam(result.team);
    const category = normalizeCategory(result.category);
    const chestNo = String(result.code || "").trim();
    const program = String(result.program || "-").trim();

    const existing = studentMap.get(key);

    if (existing) {
      existing.points += points;

      if (points > existing.bestProgramPoints) {
        existing.bestProgramPoints = points;
        existing.program = program;
      }

      return;
    }

    studentMap.set(key, {
      chestNo,
      student,
      team,
      category,
      points,
      program,
      bestProgramPoints: points,
    });
  });

  return [...studentMap.values()]
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      return a.student.localeCompare(b.student);
    })
    .slice(0, 10)
    .map((student, index) => ({
      rank: index + 1,
      ...student,
    }));
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

async function getRemoteAppsScriptData(): Promise<Record<string, unknown>> {
  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!appsScriptUrl) {
    return {};
  }

  const url = appsScriptUrl.includes("?")
    ? `${appsScriptUrl}&type=all`
    : `${appsScriptUrl}?type=all`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return {};
    }

    const data: unknown = await response.json();

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return {};
    }

    return data as Record<string, unknown>;
  } catch {
    return {};
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const remoteData = await getRemoteAppsScriptData();

  return NextResponse.json(
    {
      ...remoteData,

      success: true,
      type: "final",
      generatedAt: new Date().toISOString(),
      source: "hybrid-final-pdf-corrected",

      teams: officialTeams,
      results: finalResults,
      latestResults: getLatestResults(),
      categoryScores: officialCategoryScores,
      categoryToppers: officialCategoryToppers,
      overallToppers: getOverallToppers(),

      message:
        "Official final PDF results loaded locally with corrected programme points, category toppers, and individual totals.",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}