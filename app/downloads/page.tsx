"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Download,
  FileText,
  MapPin,
  ShieldCheck,
} from "lucide-react";

type DownloadItem = {
  id: string;
  title: string;
  tag: string;
  description: string;
  mediaUrl: string;
  fileName: string;
  fileType: string;
  createdAt: string;
};

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  useEffect(() => {
    async function loadDownloads() {
      try {
        const response = await fetch("/api/downloads", {
          cache: "no-store",
        });

        const data = await response.json();

        if (Array.isArray(data.downloads)) {
          setDownloads(data.downloads);
        }
      } catch {
        setDownloads([]);
      }
    }

    loadDownloads();
  }, []);

  const fallbackFiles = [
    {
      id: "schedule",
      title: "Programme Schedule",
      tag: "PDF",
      description: "Full stage and off-stage schedule for UNMUTE2K26.",
      mediaUrl: "#",
      fileName: "",
      fileType: "",
      createdAt: "",
    },
    {
      id: "rules",
      title: "Rules & Guidelines",
      tag: "PDF",
      description: "Official rules and participation instructions.",
      mediaUrl: "#",
      fileName: "",
      fileType: "",
      createdAt: "",
    },
    {
      id: "map",
      title: "Venue Map",
      tag: "MAP",
      description: "Locate all venues easily during the fest.",
      mediaUrl: "#",
      fileName: "",
      fileType: "",
      createdAt: "",
    },
  ];

  const files = downloads.length > 0 ? downloads : fallbackFiles;

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-5 py-8 text-[#111111] md:px-14">
      <section className="mx-auto max-w-7xl">
        <Header />

        <section className="rounded-[42px] bg-[#f6f3ee] p-6 shadow-[14px_14px_30px_#d8d3cc,-14px_-14px_30px_#ffffff] md:p-10">
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f3ee] text-[#e81818] shadow-[inset_5px_5px_10px_#d8d3cc,inset_-5px_-5px_10px_#ffffff]">
                <Download className="h-5 w-5" />
              </span>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e81818]">
                Downloads
              </p>
            </div>

            <h1 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
              Fest Files
            </h1>

            <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-[#666]">
              Important documents, schedules, rules, venue map, and official
              files for UNMUTE2K26.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {files.map((file) => (
              <DownloadCard key={file.id} file={file} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Header() {
  return (
    <div className="mb-10 flex items-center justify-between gap-4">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-full bg-[#f6f3ee] px-6 py-4 text-sm font-extrabold shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] transition active:scale-95"
      >
        <ChevronLeft className="h-5 w-5 text-[#e81818]" />
        Back Home
      </Link>

      <div className="flex items-center gap-3 rounded-[28px] bg-[#f6f3ee] px-5 py-4 shadow-[8px_8px_18px_#d7d2ca,-8px_-8px_18px_#ffffff]">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[inset_4px_4px_8px_#d8d3cc,inset_-4px_-4px_8px_#ffffff]">
          <img
            src="/brand/unmute-menu-icon.png"
            alt="UNMUTE2K26"
            className="h-10 w-10 object-contain"
          />
        </div>

        <div className="hidden text-left sm:block">
          <p className="text-lg font-black tracking-tight">
            UNMUTE<span className="text-[#e81818]">2K26</span>
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#555]">
            Downloads
          </p>
        </div>
      </div>
    </div>
  );
}

function DownloadCard({ file }: { file: DownloadItem }) {
  const icon =
    file.tag.toLowerCase().includes("map") ? (
      <MapPin className="h-8 w-8" />
    ) : file.tag.toLowerCase().includes("rule") ? (
      <ShieldCheck className="h-8 w-8" />
    ) : (
      <FileText className="h-8 w-8" />
    );

  return (
    <div className="group relative overflow-hidden rounded-[34px] bg-[#f6f3ee] p-7 shadow-[10px_10px_22px_#d8d3cc,-10px_-10px_22px_#ffffff] transition hover:-translate-y-2">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#bf7d2a]/30 transition group-hover:scale-125" />

      <div className="mb-9 flex items-center justify-between">
        <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-[#f6f3ee] text-[#e81818] shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]">
          {icon}
        </div>

        <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#e81818] shadow-[inset_4px_4px_8px_#ded9d2,inset_-4px_-4px_8px_#ffffff]">
          {file.tag}
        </span>
      </div>

      <h3 className="text-3xl font-black tracking-tight">{file.title}</h3>

      <p className="mt-4 min-h-[56px] text-sm font-medium leading-7 text-[#666]">
        {file.description || file.fileName || "Official UNMUTE2K26 file."}
      </p>

      {file.mediaUrl !== "#" ? (
        <a
  href={`/api/download-file?id=${file.id}`}
  download={file.fileName || file.title}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-[#f6f3ee] px-6 py-4 text-sm font-black shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff] transition hover:text-[#e81818]"
        >
          Download
          <Download className="h-4 w-4" />
        </a>
      ) : (
        <button className="mt-7 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-full bg-[#f6f3ee] px-6 py-4 text-sm font-black text-[#999] shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]">
          Coming Soon
          <Download className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}