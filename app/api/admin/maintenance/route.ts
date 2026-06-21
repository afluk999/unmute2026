import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function buildSettingsUrl(scriptUrl: string) {
  const url = new URL(scriptUrl);
  url.searchParams.set("type", "settings");
  return url.toString();
}

async function readJsonSafely(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      error: "Apps Script returned non-JSON response",
      preview: text.slice(0, 300),
    };
  }
}

function getAdminSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_SESSION_SECRET || "";
}

export async function GET() {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      return NextResponse.json({
        success: false,
        maintenanceMode: false,
        error: "GOOGLE_APPS_SCRIPT_URL missing",
      });
    }

    const response = await fetch(buildSettingsUrl(scriptUrl), {
      cache: "no-store",
    });

    const data = await readJsonSafely(response);

    return NextResponse.json({
      success: Boolean(data.success),
      maintenanceMode: Boolean(data.maintenanceMode),
      message: data.maintenanceMessage || "",
      error: data.error || null,
      preview: data.preview || null,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      maintenanceMode: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function POST(request: Request) {
  try {
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    const adminSecret = getAdminSecret();

    if (!scriptUrl || !adminSecret) {
      return NextResponse.json({
        success: false,
        error: "Missing GOOGLE_APPS_SCRIPT_URL or ADMIN_SECRET",
      });
    }

    const body = await request.json();
    const maintenanceMode = Boolean(body.maintenanceMode);

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        secret: adminSecret,
        action: "setMaintenance",
        maintenanceMode,
      }),
    });

    const data = await readJsonSafely(response);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}