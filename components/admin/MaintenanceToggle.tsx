"use client";

import { useEffect, useState } from "react";

export default function MaintenanceToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadStatus() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/maintenance", {
        cache: "no-store",
      });

      const data = await response.json();

      setEnabled(Boolean(data.maintenanceMode));
    } finally {
      setLoading(false);
    }
  }

  async function toggleMaintenance() {
    try {
      setSaving(true);

      const nextValue = !enabled;

      const response = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenanceMode: nextValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEnabled(nextValue);
      } else {
        alert(data.error || "Failed to update maintenance mode.");
      }
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <div className="rounded-[28px] bg-[#f6f3ee] p-6 shadow-[10px_10px_22px_#d8d3cc,-10px_-10px_22px_#ffffff]">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e81818]">
        Website Mode
      </p>

      <h2 className="mt-2 text-2xl font-black">
        {enabled ? "Editing Mode ON" : "Website Live"}
      </h2>

      <p className="mt-2 text-sm font-bold text-[#666]">
        When editing mode is ON, public pages will show only the maintenance
        page. Admin panel will stay accessible.
      </p>

      <button
        onClick={toggleMaintenance}
        disabled={loading || saving}
        className={`mt-5 rounded-full px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:scale-105 disabled:opacity-50 ${
          enabled ? "bg-[#111111]" : "bg-[#e81818]"
        }`}
      >
        {loading
          ? "Loading..."
          : saving
            ? "Saving..."
            : enabled
              ? "Turn OFF Editing Mode"
              : "Turn ON Editing Mode"}
      </button>
    </div>
  );
}