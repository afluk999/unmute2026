"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, ChevronLeft } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  tag: string;
  description: string;
  mediaUrl: string;
  createdAt: string;
};

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch("/api/gallery", {
          cache: "no-store",
        });

        const data = await response.json();

        if (Array.isArray(data.gallery)) {
          setGallery(data.gallery);
        }
      } catch {
        setGallery([]);
      }
    }

    loadGallery();
  }, []);

  useEffect(() => {
    if (gallery.length <= 1) return;

    const interval = setInterval(() => {
      setActive((current) => (current + 1) % gallery.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [gallery.length]);

  function getPosition(index: number) {
    const total = gallery.length;
    const diff = (index - active + total) % total;

    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    if (diff === 2) return "far-right";
    return "far-left";
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-5 py-8 text-[#111111] md:px-14">
      <section className="mx-auto max-w-7xl">
        <Header />

        <section className="rounded-[42px] bg-[#f6f3ee] p-6 shadow-[14px_14px_30px_#d8d3cc,-14px_-14px_30px_#ffffff] md:p-10">
          <div className="mb-10 text-center">
            <div className="mb-3 flex justify-center">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f3ee] text-[#e81818] shadow-[inset_5px_5px_10px_#d8d3cc,inset_-5px_-5px_10px_#ffffff]">
                  <Camera className="h-5 w-5" />
                </span>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e81818]">
                  Gallery
                </p>
              </div>
            </div>

            <h1 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
              Editorial Photo Wall
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-[#666]">
              A moving curved gallery for UNMUTE2K26 memories, stage frames,
              winner portraits, team moments, and backstage stories.
            </p>
          </div>

          {gallery.length > 0 ? (
            <div className="relative mx-auto h-[520px] max-w-6xl overflow-hidden md:h-[720px]">
              {gallery.map((item, index) => {
                const position = getPosition(index);

                const positionClass =
                  position === "center"
                    ? "left-1/2 top-10 z-40 w-[270px] -translate-x-1/2 rotate-0 scale-100 opacity-100 md:w-[440px]"
                    : position === "left"
                      ? "left-[12%] top-24 z-30 w-[230px] -translate-x-1/2 -rotate-[9deg] scale-90 opacity-75 md:left-[25%] md:w-[360px]"
                      : position === "right"
                        ? "left-[88%] top-24 z-30 w-[230px] -translate-x-1/2 rotate-[9deg] scale-90 opacity-75 md:left-[75%] md:w-[360px]"
                        : position === "far-left"
                          ? "left-[-14%] top-36 z-20 w-[210px] -translate-x-1/2 -rotate-[16deg] scale-75 opacity-35 md:left-[7%] md:w-[320px]"
                          : "left-[114%] top-36 z-20 w-[210px] -translate-x-1/2 rotate-[16deg] scale-75 opacity-35 md:left-[93%] md:w-[320px]";

                return (
                  <div
                    key={item.id}
                    className={`absolute aspect-[2160/2700] rounded-[38px] bg-[#f6f3ee] p-4 shadow-[18px_24px_45px_rgba(17,17,17,0.20)] transition-all duration-700 ${positionClass}`}
                  >
                    <img
                      src={item.mediaUrl}
                      alt={item.title || "UNMUTE2K26 gallery"}
                      className="h-full w-full rounded-[28px] object-cover"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[34px] bg-[#f6f3ee] p-10 text-center shadow-[inset_8px_8px_16px_#d8d3cc,inset_-8px_-8px_16px_#ffffff]">
              <p className="text-2xl font-black">No gallery photos yet</p>
              <p className="mt-2 text-sm font-bold text-[#777]">
                Add photos from the admin panel.
              </p>
            </div>
          )}
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
            Gallery
          </p>
        </div>
      </div>
    </div>
  );
}