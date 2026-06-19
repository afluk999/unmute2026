"use client";

import { type ReactNode, useEffect, useState } from "react";

import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  Camera,
  ChevronRight,
  Clock3,
  Compass,
  Crown,
  Flame,
  GalleryHorizontalEnd,
  LockKeyhole,
  Medal,
  Mic2,
  PenLine,
  Play,
  Radio,
  Sparkles,
  Star,
  Trophy,
  Users,
  Video,
} from "lucide-react";

type LiveTeam = {
  rank: number;
  name: string;
  team: string;
  color: string;
  score: number;
  difference: string;
};

type LiveResult = {
  id: string;
  code: string;
  program: string;
  student: string;
  team: string;
  category: string;
  prize: string;
  grade: string;
  points: number;
  updatedAt?: string;
  individualPoints?: number;
  participants?: string[];
 isFaceToFace?: boolean;

};

type CategoryTopper = {
  category: string;
  student: string;
  team: string;
  points: number;
  program: string;
};

type LiveData = {
  success: boolean;
  source?: string;
  teams: LiveTeam[];
  results: LiveResult[];
  latestResults: LiveResult[];
  categoryToppers: CategoryTopper[];
};

const fallbackData: LiveData = {
  success: false,
  source: "fallback",
  teams: [
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
  ],
  results: [],
  latestResults: [],
  categoryToppers: [],
};

export default function Home() {
const [liveData, setLiveData] = useState<LiveData>(fallbackData);
const [lastUpdated, setLastUpdated] = useState("");
const [showLoader, setShowLoader] = useState(true);

  async function fetchLiveData() {
    try {
      const response = await fetch("/api/live", {
        cache: "no-store",
      });

      const data = await response.json();

      setLiveData({
        success: Boolean(data.success),
        source: data.source,
        teams: Array.isArray(data.teams) ? data.teams : fallbackData.teams,
        results: Array.isArray(data.results) ? data.results : [],
        latestResults: Array.isArray(data.latestResults)
          ? data.latestResults
          : [],
        categoryToppers: Array.isArray(data.categoryToppers)
          ? data.categoryToppers
          : [],
      });

      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setLiveData(fallbackData);
    }
  }

  useEffect(() => {
    fetchLiveData();

    const interval = setInterval(() => {
      fetchLiveData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

 
useEffect(() => {
  const timer = setTimeout(() => {
    setShowLoader(false);
  }, 1800);

  return () => clearTimeout(timer);
}, []);

  return (
  <main className="min-h-screen bg-[#f6f3ee] text-[#111111]">
    {showLoader && <SplashLoader />}
    <HeroSection />
      <LiveScoreboard teams={liveData.teams} lastUpdated={lastUpdated} />
      <LatestResults results={liveData.latestResults} fallbackResults={liveData.results} />
      <ResultCTA />
      <CategoryToppersCarousel toppers={liveData.categoryToppers} />
      <VideoReelsPreview />
      <GalleryPreview />
      <Footer />
    </main>
  );
}
function SplashLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f6f3ee]">
      <div className="absolute h-[420px] w-[420px] rounded-full bg-[#e81818]/10 blur-3xl" />
      <div className="absolute h-[300px] w-[300px] translate-x-24 translate-y-14 rounded-full bg-[#f2b600]/20 blur-3xl" />

      <div className="relative flex flex-col items-center">
        <div className="relative flex h-44 w-44 items-center justify-center rounded-[44px] bg-[#f6f3ee] shadow-[18px_18px_35px_#d8d3cc,-18px_-18px_35px_#ffffff]">
          <span className="voice-wave voice-wave-1" />
          <span className="voice-wave voice-wave-2" />
          <span className="voice-wave voice-wave-3" />

          <div className="absolute right-10 top-12 h-20 w-10 rounded-full bg-[#e81818]/25 blur-md mouth-glow" />

          <img
            src="/brand/unmute-menu-icon.png"
            alt="UNMUTE2K26 logo"
            className="speaking-logo relative z-10 h-32 w-32 object-contain"
          />
        </div>

        <h1 className="mt-8 text-4xl font-black tracking-[-0.05em] md:text-6xl">
          UNMUTE<span className="text-[#e81818]">2K26</span>
        </h1>

        <p className="mt-3 text-sm font-black uppercase tracking-[0.28em] text-[#f2b600]">
          Too Loud To Be Silenced
        </p>

        <div className="mt-7 flex gap-2">
          <span className="loader-dot" />
          <span className="loader-dot loader-dot-delay-1" />
          <span className="loader-dot loader-dot-delay-2" />
        </div>
      </div>
    </div>
  );
}
function LogoSplashLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f6f3ee]">
      <div className="relative flex h-48 w-48 items-center justify-center rounded-[44px] bg-[#f6f3ee] shadow-[18px_18px_35px_#d8d3cc,-18px_-18px_35px_#ffffff]">
        <div className="absolute h-40 w-40 rounded-full bg-[#e81818]/10 blur-2xl" />
        <div className="absolute h-32 w-32 translate-x-8 rounded-full bg-[#ffc000]/20 blur-2xl" />

        <img
          src="/brand/unmute-menu-icon.png"
          alt="UNMUTE2K26 logo"
          className="talking-logo relative z-10 h-36 w-36 object-contain"
        />
      </div>
    </div>
  );
}

function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Result", href: "/result" },
    { label: "Individual Results", href: "/individual-results" },
    { label: "Downloads", href: "/downloads" },
    { label: "Gallery", href: "/gallery" },
    { label: "Live Result", href: "/result" },
  ];

  return (
    <section className="relative min-h-[92svh] overflow-hidden px-5 py-5 md:min-h-screen md:px-14 md:py-6">
      <div className="absolute right-5 top-5 z-30 md:right-14 md:top-6">
        <div className="relative">
          <AnimatedFestBrand
            open={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          />

          <div
            className={`absolute right-0 top-[72px] w-56 rounded-[28px] bg-[#f6f3ee] p-4 shadow-[12px_12px_25px_#d4cec5,-12px_-12px_25px_#ffffff] transition-all duration-300 md:top-[88px] ${
              menuOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none translate-y-3 opacity-0"
            }`}
          >
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="mb-3 block rounded-2xl px-4 py-3 text-sm font-bold shadow-[inset_4px_4px_8px_#ded9d2,inset_-4px_-4px_8px_#ffffff] last:mb-0 hover:text-[#e81818]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 pt-28 md:min-h-screen md:flex-row md:gap-10 md:pt-12">
        <div className="w-full text-center md:w-1/2 md:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#f6f3ee] px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em] shadow-[6px_6px_14px_#d8d3cc,-6px_-6px_14px_#ffffff] sm:text-sm md:px-5">
            <Sparkles className="h-4 w-4 text-[#ffc000]" />
            Manhaj Arts Fest 2K26
          </div>

          <h1 className="text-5xl font-black leading-none tracking-[-0.06em] sm:text-6xl md:text-8xl">
            UNMUTE<span className="text-[#e81818]">2K26</span>
          </h1>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#2b2b2b] sm:text-3xl md:mt-5 md:text-4xl">
            Too Loud To Be Silenced
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#555] md:mx-0 md:mt-6 md:text-lg md:leading-8">
            A celebration of expression, creativity, and talent. Unmute your
            voice. Unmute your programmes.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="/result"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#e81818] px-7 py-4 text-base font-extrabold text-white shadow-[8px_8px_18px_#d5b8b8,-8px_-8px_18px_#ffffff] transition active:scale-95 sm:w-auto"
            >
              View Live Result
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
  href="#music"
  className="flex items-center gap-3 rounded-full bg-[#f6f3ee] px-7 py-4 text-base font-extrabold shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] transition hover:scale-105"
>
  Theme song
  <Play className="h-5 w-5 text-[#f2b600]" />
</Link>
          </div>
        </div>

        <div className="relative flex w-full justify-center md:w-1/2">
          <div className="absolute right-4 top-14 h-56 w-56 rounded-full bg-[#fbad2a] opacity-60 blur-[2px] md:right-8 md:top-24 md:h-72 md:w-72" />
          <div className="absolute left-6 top-5 h-24 w-24 rounded-full bg-[#e81818] opacity-10 blur-2xl md:left-8 md:top-10 md:h-32 md:w-32" />

          <div className="hero-logo-float relative w-full max-w-[310px] sm:max-w-[380px] md:max-w-[470px]">
            <img
              src="/brand/unmute-hero-display.png"
              alt="UNMUTE2K26 hero logo"
              className="relative z-10 h-auto w-full object-contain drop-shadow-[0_22px_24px_rgba(17,17,17,0.18)] md:drop-shadow-[0_26px_28px_rgba(17,17,17,0.22)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
function StatsSection() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 pb-16 sm:grid-cols-2 md:grid-cols-3 md:gap-7 md:px-14 md:pb-24">
      <StatCard
        icon={<Users />}
        number="250+"
        label="Students"
        text="Participating with passion"
        color="text-[#e81818]"
      />

      <StatCard
        icon={<Trophy />}
        number="250+"
        label="Programmes"
        text="Across different categories"
        color="text-[#f2b600]"
      />

      <StatCard
        icon={<Compass />}
        number="4"
        label="Venues"
        text="Where moments happen"
        color="text-[#111]"
      />
    </section>
  );
}

function StatCard({
  icon,
  number,
  label,
  text,
  color,
}: {
  icon: ReactNode;
  number: string;
  label: string;
  text: string;
  color: string;
}) {
  return (
    <div className="rounded-[28px] bg-[#f6f3ee] p-5 shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] md:rounded-[34px] md:p-7 md:shadow-[10px_10px_22px_#d8d3cc,-10px_-10px_22px_#ffffff]">
      <div className="flex items-center gap-4 md:gap-6">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f6f3ee] shadow-[inset_5px_5px_10px_#d8d3cc,inset_-5px_-5px_10px_#ffffff] md:h-20 md:w-20 md:shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff] ${color}`}
        >
          <div className="h-7 w-7 md:h-9 md:w-9">{icon}</div>
        </div>

        <div>
          <h3 className="text-4xl font-black tracking-tight md:text-5xl">
            {number}
          </h3>
          <p className="mt-1 text-lg font-bold md:text-xl">{label}</p>
          <p className="mt-1 text-xs text-[#777] md:text-sm">{text}</p>
        </div>
      </div>
    </div>
  );
}
function LiveScoreboard({
  teams,
  lastUpdated,
}: {
  teams: LiveTeam[];
  lastUpdated: string;
}) {
  const sortedTeams = [...teams].sort((a, b) => a.rank - b.rank);
  const highestScore = Math.max(...sortedTeams.map((team) => team.score), 1);
  const leader = sortedTeams[0];

  return (
    <section id="scoreboard" className="mx-auto max-w-7xl px-6 pb-24 md:px-14">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <SectionMiniLabel icon={<BarChart3 />} text="Live Scoreboard" />

          <h2 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">
            Current Ranking
          </h2>

          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#666]">
            Clean live overview of team positions, score gap, and current leader.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-3 shadow-[6px_6px_14px_#d8d3cc,-6px_-6px_14px_#ffffff]">
          <span className="h-3 w-3 rounded-full bg-[#00c853] shadow-[0_0_14px_#00c853]" />
          <Radio className="h-4 w-4 text-[#00a44a]" />
          <span className="text-sm font-extrabold">
            Live Updated {lastUpdated ? `• ${lastUpdated}` : ""}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        {sortedTeams.map((team) => {
          const width = `${Math.round((team.score / highestScore) * 100)}%`;

          return (
            <div
              key={team.name}
              className={`group relative overflow-hidden rounded-[38px] bg-[#f6f3ee] p-7 shadow-[10px_10px_22px_#d8d3cc,-10px_-10px_22px_#ffffff] transition duration-300 hover:-translate-y-2 ${
                team.rank === 1 ? "lg:-translate-y-3" : ""
              }`}
            >
              <div
                className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-15 transition duration-500 group-hover:scale-125"
                style={{ backgroundColor: team.color }}
              />

              <div className="absolute right-5 top-5 h-3 w-3 rounded-full bg-[#10d4c4] shadow-[0_0_14px_#10d4c4]" />

              <div className="mb-8 flex items-center justify-between">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-[22px] text-3xl font-black text-white shadow-[6px_6px_14px_#d1ccc4,-6px_-6px_14px_#ffffff]"
                  style={{ backgroundColor: team.color }}
                >
                  {team.rank}
                </div>

                <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#555] shadow-[inset_4px_4px_8px_#ded9d2,inset_-4px_-4px_8px_#ffffff]">
                  Rank #{team.rank}
                </p>
              </div>

              <h3 className="text-2xl font-black uppercase tracking-tight">
                {team.name}
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#777]">
                    Total Score
                  </p>
                  <p className="mt-2 text-5xl font-black">{team.score}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#777]">
                    Difference
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#00a884]">
                    {team.difference}
                  </p>
                </div>
              </div>

              <div className="mt-7 h-4 rounded-full bg-[#ebe7df] shadow-[inset_4px_4px_8px_#d8d3cc,inset_-4px_-4px_8px_#ffffff]">
                <div
                  className="h-4 rounded-full transition-all duration-700"
                  style={{
                    width,
                    backgroundColor: team.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
{leader && (
  <div className="mt-8 overflow-hidden rounded-[34px] bg-[#f6f3ee] p-1 shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff]">
    <div className="flex flex-col items-center justify-between gap-4 rounded-[30px] bg-[#f6f3ee] px-6 py-5 text-center shadow-[inset_5px_5px_10px_#d8d3cc,inset_-5px_-5px_10px_#ffffff] md:flex-row md:text-left">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#bf7d2a]">
          Current Leader
        </p>
        <p className="mt-1 text-xl font-black text-[#111111]">
          {leader.name} are leading the scoreboard.
        </p>
      </div>

      <div
        className="rounded-full px-5 py-3 text-lg font-black text-white shadow-[6px_6px_14px_#d1ccc4,-6px_-6px_14px_#ffffff]"
        style={{ backgroundColor: leader.color }}
      >
        {leader.score} points
      </div>
    </div>
  </div>
)}
    </section>
  );
}

type FreshProgramWinnerItem = {
  student: string;
  team: string;
  grade: string;
  points: number;
  prize: string;
};

type FreshProgramResultItem = {
  key: string;
  program: string;
  category: string;
  updatedAt: string;
  first: FreshProgramWinnerItem[];
  second: FreshProgramWinnerItem[];
  third: FreshProgramWinnerItem[];
  gradeOnly: FreshProgramWinnerItem[];
};

function LatestResults({
  results,
  fallbackResults,
}: {
  results: LiveResult[];
  fallbackResults: LiveResult[];
}) {
  const allResults = fallbackResults.length > 0 ? fallbackResults : results;
  const programResults = buildFreshProgramGroups(allResults).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 md:px-14">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="hidden md:block">
            <SectionMiniLabel icon={<Clock3 />} text="Latest Results" />
          </div>

          <h2 className="hidden text-4xl font-black tracking-[-0.04em] md:block md:text-6xl">
            Freshly Announced
          </h2>
        </div>

        <Link
          href="/result"
          className="flex w-fit items-center gap-3 rounded-full bg-[#f6f3ee] px-6 py-4 text-sm font-extrabold shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] transition hover:scale-105"
        >
          View All Results
          <ChevronRight className="h-5 w-5 text-[#e81818]" />
        </Link>
      </div>

      {programResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-4">
          {programResults.map((programResult) => (
            <FreshProgramResultCard
              key={programResult.key}
              programResult={programResult}
            />
          ))}
        </div>
      ) : (
        <EmptyMini text="No latest results yet." />
      )}
    </section>
  );
}

function buildFreshProgramGroups(results: LiveResult[]) {
  const groupMap = new Map<string, FreshProgramResultItem>();

  results.forEach((result) => {
    const program = result.program || "-";
    const category = result.category || "-";
    const key = `${program}__${category}`;

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        key,
        program,
        category,
        updatedAt: result.updatedAt || "",
        first: [],
        second: [],
        third: [],
        gradeOnly: [],
      });
    }

    const group = groupMap.get(key);

    if (!group) return;

    const groupTime = new Date(group.updatedAt || 0).getTime();
    const resultTime = new Date(result.updatedAt || 0).getTime();

    if (resultTime > groupTime) {
      group.updatedAt = result.updatedAt || "";
    }

    const winner: FreshProgramWinnerItem = {
      student: result.student || "-",
      team: result.team || "-",
      grade: result.grade || "-",
      points: Number(result.points) || 0,
      prize: result.prize || "",
    };

    const prizeType = detectFreshPrizeType(result.prize);

    if (prizeType === "first") {
      group.first.push(winner);
      return;
    }

    if (prizeType === "second") {
      group.second.push(winner);
      return;
    }

    if (prizeType === "third") {
      group.third.push(winner);
      return;
    }

    if (hasFreshGradeOnly(result.grade)) {
      group.gradeOnly.push(winner);
    }
  });

  return Array.from(groupMap.values()).sort((a, b) => {
    const dateA = new Date(a.updatedAt || 0).getTime();
    const dateB = new Date(b.updatedAt || 0).getTime();

    return dateB - dateA;
  });
}

function detectFreshPrizeType(prize: string) {
  const value = String(prize || "").toLowerCase();

  if (value.includes("first") || value.includes("1st")) return "first";
  if (value.includes("second") || value.includes("2nd")) return "second";
  if (value.includes("third") || value.includes("3rd")) return "third";

  return "none";
}

function hasFreshGradeOnly(grade: string) {
  const value = String(grade || "").trim().toUpperCase();

  return value === "A" || value === "B";
}

function FreshProgramResultCard({
  programResult,
}: {
  programResult: FreshProgramResultItem;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[30px] bg-[#f6f3ee] p-5 shadow-[10px_10px_22px_#d8d3cc,-10px_-10px_22px_#ffffff] transition hover:-translate-y-2">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#e81818] opacity-8 transition duration-500 group-hover:scale-125" />
      <div className="absolute right-5 top-5 h-3 w-3 rounded-full bg-[#10d4c4] shadow-[0_0_14px_#10d4c4]" />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6f3ee] text-[#e81818] shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]">
          <div className="h-7 w-7">{getProgramIcon(programResult.program)}</div>
        </div>

        <div className="rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#e81818] shadow-[inset_4px_4px_8px_#ded9d2,inset_-4px_-4px_8px_#ffffff]">
          Result
        </div>
      </div>

      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#888]">
        {programResult.category}
      </p>

      <h3 className="mt-2 text-[28px] font-black leading-[1.05] tracking-tight text-[#111111]">
        {programResult.program}
      </h3>

    <div className="mt-5 space-y-3">
  {programResult.first.length > 0 && (
    <FreshPrizeBox icon="🥇" winners={programResult.first} />
  )}

  {programResult.second.length > 0 && (
    <FreshPrizeBox icon="🥈" winners={programResult.second} />
  )}

  {programResult.third.length > 0 && (
    <FreshPrizeBox icon="🥉" winners={programResult.third} />
  )}

  {programResult.gradeOnly.length > 0 && (
    <FreshPrizeBox icon="⭐" winners={programResult.gradeOnly} />
  )}

  {programResult.first.length === 0 &&
    programResult.second.length === 0 &&
    programResult.third.length === 0 &&
    programResult.gradeOnly.length === 0 && (
      <div className="rounded-[22px] bg-white/70 px-4 py-4 text-sm font-bold text-[#999]">
        Result not announced
      </div>
    )}
</div>
    </div>
  );
}

function FreshPrizeBox({
  icon,
  winners,
}: {
  icon: string;
  winners: FreshProgramWinnerItem[];
}) {
  return (
    <div className="rounded-[20px] bg-[#f6f3ee] p-2.5 shadow-[inset_4px_4px_8px_#ddd8d1,inset_-4px_-4px_8px_#ffffff]">
      <div className="flex items-start gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-lg shadow-[4px_4px_10px_#ddd7cf,-4px_-4px_10px_#ffffff]">
          {icon}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {winners.map((winner, index) => (
            <div
              key={`${winner.student}-${winner.team}-${index}`}
              className="rounded-2xl bg-white/75 px-3 py-2"
            >
              <p className="truncate text-[15px] font-black leading-tight text-[#111111]">
                {winner.student}
              </p>

              <p className="mt-1 truncate text-xs font-bold text-[#666666]">
                {winner.team}
                {winner.grade && winner.grade !== "-"
                  ? ` • Grade ${winner.grade}`
                  : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function ResultCTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 md:px-14 md:pb-24">
      <div className="relative overflow-hidden rounded-[34px] bg-[#111111] p-6 text-white shadow-[10px_10px_24px_#d8d3cc,-10px_-10px_24px_#ffffff] md:rounded-[46px] md:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e81818] opacity-35 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#f2b600] opacity-30 blur-2xl" />

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 backdrop-blur md:px-5">
              <span className="h-3 w-3 rounded-full bg-[#00ff88] shadow-[0_0_16px_#00ff88]" />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f2b600] md:text-sm">
                Result Center
              </p>
            </div>

            <h2 className="text-4xl font-black leading-none tracking-[-0.05em] md:text-7xl">
              Open The Full <span className="text-[#e81818]">Result</span>{" "}
              Arena
            </h2>

            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-white/65 md:mt-6 md:text-base md:leading-8">
              Overall champions, category leaders, searchable result cards,
              prize details, grade points, and live team performance in one
              premium dashboard.
            </p>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row md:mt-8">
              <Link
                href="/result"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#e81818] px-7 py-4 text-sm font-black text-white shadow-[0_18px_35px_rgba(232,24,24,0.35)] transition active:scale-95 sm:w-auto md:text-base"
              >
                View Live Result
                <ChevronRight className="h-5 w-5" />
              </Link>

              <Link
                href="/result"
                className="flex w-full items-center justify-center rounded-full bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur transition active:scale-95 hover:bg-white/15 sm:w-auto md:text-base"
              >
                Search Results
              </Link>
            </div>
          </div>

          <div className="relative hidden min-h-[320px] lg:block">
            <div className="absolute left-1/2 top-1/2 flex h-56 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 shadow-[inset_10px_10px_20px_rgba(255,255,255,0.08),inset_-10px_-10px_20px_rgba(0,0,0,0.35)] backdrop-blur">
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#e81818] text-white shadow-[0_0_40px_rgba(232,24,24,0.5)]">
                <Trophy className="h-16 w-16" />
              </div>
            </div>

            <div className="absolute left-4 top-5 rounded-[28px] bg-white/10 p-5 backdrop-blur">
              <BarChart3 className="mb-3 h-8 w-8 text-[#f2b600]" />
              <p className="text-sm font-black">Team Score</p>
            </div>

            <div className="absolute bottom-5 left-10 rounded-[28px] bg-white/10 p-5 backdrop-blur">
              <Crown className="mb-3 h-8 w-8 text-[#f2b600]" />
              <p className="text-sm font-black">Category Lead</p>
            </div>

            <div className="absolute right-4 top-20 rounded-[28px] bg-white/10 p-5 backdrop-blur">
              <Sparkles className="mb-3 h-8 w-8 text-[#f2b600]" />
              <p className="text-sm font-black">Live Update</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryToppersCarousel({ toppers }: { toppers: CategoryTopper[] }) {
  const displayToppers =
    toppers.length > 0
      ? toppers
      : [
          {
            category: "Bidaya",
            student: "-",
            team: "-",
            points: 0,
            program: "-",
          },
        ];

  const loopedToppers = [...displayToppers, ...displayToppers];

  return (
    <section className="overflow-hidden px-6 pb-24 md:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionMiniLabel icon={<Star />} text="Category Toppers" />
            <h2 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">
              Category Toppers
            </h2>

            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#666]">
              A moving showcase of the leading performers from every category.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-3 shadow-[6px_6px_14px_#d8d3cc,-6px_-6px_14px_#ffffff]">
            <Medal className="h-5 w-5 text-[#e81818]" />
            <span className="text-sm font-extrabold">Live Toppers</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#f6f3ee] to-transparent md:w-40" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#f6f3ee] to-transparent md:w-40" />

        <div className="topper-track flex w-max gap-7 py-4">
          {loopedToppers.map((topper, index) => (
            <div
              key={`${topper.category}-${topper.student}-${index}`}
              className="relative w-[310px] shrink-0 overflow-hidden rounded-[38px] bg-[#f6f3ee] p-6 shadow-[10px_10px_22px_#d8d3cc,-10px_-10px_22px_#ffffff] transition hover:-translate-y-2 md:w-[360px]"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f2b600] opacity-30" />
              <div className="absolute right-5 top-5 h-3 w-3 rounded-full bg-[#10d4c4] shadow-[0_0_14px_#10d4c4]" />

              <div className="mb-7 flex items-center justify-between">
                <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#f6f3ee] text-[#e81818] shadow-[inset_7px_7px_14px_#d8d3cc,inset_-7px_-7px_14px_#ffffff]">
                  <div className="h-10 w-10">{getProgramIcon(topper.program)}</div>
                </div>

                <div className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#e81818] shadow-[inset_4px_4px_8px_#ded9d2,inset_-4px_-4px_8px_#ffffff]">
                  Topper
                </div>
              </div>

              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#888]">
                {topper.category} Topper
              </p>

              <h3 className="mt-2 text-3xl font-black leading-tight tracking-tight">
                {topper.student}
              </h3>

              <div className="mt-6 space-y-3 text-sm">
                <ResultLine label="Team" value={topper.team} />
                <ResultLine label="Best In" value={topper.program} />
              </div>

              <div className="mt-7 flex items-center justify-between rounded-[26px] bg-[#f6f3ee] px-5 py-4 shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]">
                <span className="text-sm font-black uppercase tracking-[0.16em] text-[#777]">
                  Total
                </span>
                <span className="text-4xl font-black text-[#e81818]">
                  {topper.points}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type HomeReel = {
  id: string;
  title: string;
  tag: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
};


function VideoReelsPreview() {
  const [activeReel, setActiveReel] = useState(0);
  const [reels, setReels] = useState<HomeReel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReels() {
      try {
        const response = await fetch("/api/reels", {
          cache: "no-store",
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.reels)) {
          setReels(data.reels);
        }
      } catch {
        setReels([]);
      } finally {
        setLoading(false);
      }
    }

    loadReels();
  }, []);

  useEffect(() => {
    if (reels.length <= 1) return;

    const interval = setInterval(() => {
      setActiveReel((current) => (current + 1) % reels.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [reels.length]);

  function getReelPosition(index: number) {
    const total = reels.length;
    const diff = (index - activeReel + total) % total;

    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    if (diff === 2) return "far-right";
    return "far-left";
  }

  if (loading) {
    return (
      <section id="reels" className="mx-auto max-w-7xl px-5 pb-16 md:px-14 md:pb-24">
        <div className="mb-10 text-center">
          <p className="mx-auto mb-4 w-fit rounded-full bg-[#f6f3ee] px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-[#e81818] shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff]">
            Reels
          </p>

          <h2 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
            Fest Reels
          </h2>
        </div>

        <div className="mx-auto flex aspect-[9/16] w-[230px] items-center justify-center rounded-[34px] bg-[#f6f3ee] p-4 shadow-[14px_18px_35px_rgba(17,17,17,0.16)] md:w-[300px]">
          <p className="text-sm font-black text-[#777]">Loading reels...</p>
        </div>
      </section>
    );
  }

  if (reels.length === 0) {
    return (
      <section id="reels" className="mx-auto max-w-7xl px-5 pb-16 md:px-14 md:pb-24">
        <div className="mb-10 text-center">
          <p className="mx-auto mb-4 w-fit rounded-full bg-[#f6f3ee] px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-[#e81818] shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff]">
            Reels
          </p>

          <h2 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
            Fest Reels
          </h2>
        </div>

        <div className="mx-auto flex aspect-[9/16] w-[230px] items-center justify-center rounded-[34px] bg-[#f6f3ee] p-4 text-center shadow-[14px_18px_35px_rgba(17,17,17,0.16)] md:w-[300px]">
          <div>
            <p className="text-xl font-black">No reels added yet</p>
            <p className="mt-2 text-sm font-bold text-[#777]">
              Add reel link and thumbnail from admin.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reels" className="mx-auto max-w-7xl px-5 pb-16 md:px-14 md:pb-24">
      <div className="mb-10 flex flex-col justify-between gap-5 text-center md:flex-row md:items-end md:text-left">
        <div>
          <p className="mx-auto mb-4 w-fit rounded-full bg-[#f6f3ee] px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-[#e81818] shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] md:mx-0">
            Reels
          </p>

          <h2 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
            Fest Reels
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#555] md:mx-0">
            Quick moments, stage energy, winners, and live memories from
            UNMUTE2K26.
          </p>
        </div>

        <Link
          href="/gallery"
          className="mx-auto w-fit rounded-full bg-[#f6f3ee] px-7 py-4 text-sm font-black text-[#111111] shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] md:mx-0"
        >
          Open Gallery →
        </Link>
      </div>

      <div className="relative mx-auto h-[430px] max-w-6xl overflow-hidden md:h-[610px]">
        {reels.map((reel, index) => {
          const position = getReelPosition(index);

          const positionClass =
            position === "center"
              ? "left-1/2 z-30 w-[230px] -translate-x-1/2 scale-100 opacity-100 md:w-[310px]"
              : position === "left"
                ? "left-[13%] z-20 w-[200px] -translate-x-1/2 scale-90 opacity-70 md:left-[28%] md:w-[270px]"
                : position === "right"
                  ? "left-[87%] z-20 w-[200px] -translate-x-1/2 scale-90 opacity-70 md:left-[72%] md:w-[270px]"
                  : position === "far-left"
                    ? "left-[-15%] z-10 w-[180px] -translate-x-1/2 scale-75 opacity-25 md:left-[9%] md:w-[240px]"
                    : "left-[115%] z-10 w-[180px] -translate-x-1/2 scale-75 opacity-25 md:left-[91%] md:w-[240px]";

          return (
            <a
              key={reel.id}
              href={reel.videoUrl}
              target="_blank"
              rel="noreferrer"
              className={`absolute top-4 aspect-[9/16] overflow-hidden rounded-[34px] bg-[#f6f3ee] p-3 shadow-[14px_18px_35px_rgba(17,17,17,0.16)] transition-all duration-700 md:top-6 ${positionClass}`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-[#111111]">
                {reel.thumbnailUrl ? (
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#e81818] via-[#b41f6c] to-[#bf7d2a]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute left-4 top-4 rounded-full bg-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  {reel.tag || "Reel"}
                </div>

                <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#e81818] shadow-xl">
                  <Play className="ml-0.5 h-5 w-5 fill-[#e81818] text-[#e81818]" />
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                    UNMUTE2K26 Reel
                  </p>

                  <h3 className="mt-2 text-2xl font-black leading-tight text-white">
                    {reel.title}
                  </h3>

                  {reel.description && (
                    <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-white/75">
                      {reel.description}
                    </p>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function GalleryPreview() {
  const [activeSnap, setActiveSnap] = useState(0);
  const [galleryItems, setGalleryItems] = useState<
    {
      id: string;
      title: string;
      tag: string;
      description: string;
      mediaUrl: string;
      createdAt: string;
    }[]
  >([]);

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch("/api/gallery", {
          cache: "no-store",
        });

        const data = await response.json();

        if (Array.isArray(data.gallery)) {
          setGalleryItems(data.gallery);
        }
      } catch {
        setGalleryItems([]);
      }
    }

    loadGallery();
  }, []);

  useEffect(() => {
    if (galleryItems.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSnap((current) => (current + 1) % galleryItems.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [galleryItems.length]);

  function getSlidePosition(index: number) {
    const total = galleryItems.length;
    const diff = (index - activeSnap + total) % total;

    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    if (diff === 2) return "far-right";
    return "far-left";
  }

  if (galleryItems.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-14 md:pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
            Gallery
          </h2>
        </div>

        <div className="mx-auto flex aspect-[2160/2700] w-[250px] items-center justify-center rounded-[34px] bg-[#f6f3ee] p-4 shadow-[14px_18px_35px_rgba(17,17,17,0.16)] md:w-[390px]">
          <div className="h-full w-full rounded-[26px] bg-gradient-to-br from-[#2aa1b3] via-[#bf7d2a] to-[#b41f6c]" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 md:px-14 md:pb-24">
      <div className="mb-10 text-center">
        <h2 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
          Gallery
        </h2>
      </div>

      <div className="relative mx-auto h-[430px] max-w-6xl overflow-hidden md:h-[620px]">
        {galleryItems.map((snap, index) => {
          const position = getSlidePosition(index);

          const positionClass =
            position === "center"
              ? "left-1/2 z-30 w-[250px] -translate-x-1/2 scale-100 opacity-100 md:w-[390px]"
              : position === "left"
                ? "left-[10%] z-20 w-[210px] -translate-x-1/2 scale-90 opacity-70 md:left-[26%] md:w-[330px]"
                : position === "right"
                  ? "left-[90%] z-20 w-[210px] -translate-x-1/2 scale-90 opacity-70 md:left-[74%] md:w-[330px]"
                  : position === "far-left"
                    ? "left-[-18%] z-10 w-[190px] -translate-x-1/2 scale-75 opacity-30 md:left-[8%] md:w-[290px]"
                    : "left-[118%] z-10 w-[190px] -translate-x-1/2 scale-75 opacity-30 md:left-[92%] md:w-[290px]";

          return (
            <div
              key={snap.id}
              className={`absolute top-4 aspect-[2160/2700] rounded-[34px] bg-[#f6f3ee] p-4 shadow-[14px_18px_35px_rgba(17,17,17,0.16)] transition-all duration-700 md:top-6 ${positionClass}`}
            >
              <img
                src={snap.mediaUrl}
                alt="UNMUTE2K26 gallery snap"
                className="h-full w-full rounded-[26px] object-cover"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AnimatedFestBrand({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      className={`group relative flex items-center overflow-hidden rounded-full bg-[#f6f3ee] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[8px_8px_18px_#d7d2ca,-8px_-8px_18px_#ffffff] active:scale-95 ${
        open
          ? "w-[200px] px-4 py-3 md:w-[300px]"
          : "w-[62px] px-3 py-3"
      }`}
    >
      {/* Left logo icon */}
      <span
        className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f6f3ee] transition-all duration-700 md:h-12 md:w-12 ${
          open
            ? "rotate-[360deg] shadow-[0_0_26px_rgba(232,24,24,0.25)]"
            : "rotate-0 shadow-[inset_4px_4px_8px_#d8d3cc,inset_-4px_-4px_8px_#ffffff]"
        }`}
      >
        <img
          src="/brand/unmute-menu-icon.png"
          alt="UNMUTE2K26 icon"
          className="h-9 w-9 object-contain md:h-10 md:w-10"
        />
      </span>

      {/* Footer logo / wordmark area */}
      <span
        className={`relative z-10 ml-3 flex h-14 items-center transition-all duration-700 ${
          open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-6 opacity-0"
        }`}
      >
        <img
  src="/brand/logo-black.png"
  alt="UNMUTE2K26"
  className="h-10 w-auto object-contain"
/>
      </span>

      {/* Sparkle */}
      <span
        className={`absolute right-4 top-3 z-10 text-[#f2b600] transition-all duration-700 ${
          open ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <Sparkles className="h-4 w-4 animate-pulse" />
      </span>

      {/* Soft color glow */}
      <span
        className={`absolute inset-0 rounded-full bg-gradient-to-r from-[#e81818]/10 via-[#f2b600]/10 to-[#2aa1b3]/10 transition-opacity duration-700 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}

function Footer() {
  return (
    <footer className="px-6 pb-8 md:px-14">
      <div className="mx-auto max-w-7xl rounded-[42px] bg-[#111111] p-8 text-white shadow-[14px_14px_30px_#d8d3cc,-14px_-14px_30px_#ffffff] md:p-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center">
  <img
    src="/brand/LOGO WHITE.png"
    alt="UNMUTE2K26 footer logo"
    className="h-auto w-[300px] max-w-full object-contain"
  />
</div>

            <p className="mt-6 max-w-sm text-sm font-medium leading-7 text-white/60">
              Official arts fest experience of Manhaj Rashad Islamic College,
              built for live results, memories, and moments.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.22em] text-[#f2b600]">
              Quick Links
            </h4>

            <div className="mt-5 grid gap-3 text-sm font-bold text-white/70">
              {[
                { label: "Home", href: "/" },
                { label: "Result", href: "/result" },
                { label: "Downloads", href: "/downloads" },
                { label: "Gallery", href: "/gallery" },
                { label: "Live Result", href: "/result" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="w-fit transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.22em] text-[#f2b600]">
              Contact
            </h4>

            <div className="mt-5 space-y-4 text-sm font-bold text-white/70">
              <div>Manhaj Rashad Islamic College</div>
              <div>4 venues. 250+ programmes.</div>
            </div>
<a
  href="https://www.instagram.com/unmute_2k26/"
  target="_blank"
  rel="noreferrer"
  className="mt-7 flex w-fit items-center gap-3 rounded-full bg-[#e81818] px-6 py-4 text-sm font-black text-white transition hover:scale-105"
>
  Instagram Profile
  <ChevronRight className="h-4 w-4" />
</a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm font-bold text-white/50">
          © 2026 UNMUTE2K26. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function getProgramIcon(program: string) {
  const value = program.toLowerCase();

  if (value.includes("quran") || value.includes("recitation")) {
    return <BookOpen className="h-8 w-8" />;
  }

  if (value.includes("writing") || value.includes("story")) {
    return <PenLine className="h-8 w-8" />;
  }

  if (value.includes("quiz")) {
    return <Trophy className="h-8 w-8" />;
  }

  if (value.includes("calligraphy")) {
    return <Award className="h-8 w-8" />;
  }

  return <Mic2 className="h-8 w-8" />;
}

function SectionMiniLabel({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f3ee] text-[#e81818] shadow-[inset_5px_5px_10px_#d8d3cc,inset_-5px_-5px_10px_#ffffff]">
        <span className="h-5 w-5">{icon}</span>
      </span>
      <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e81818]">
        {text}
      </p>
    </div>
  );
}

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-bold text-[#777]">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function EmptyMini({ text }: { text: string }) {
  return (
    <div className="rounded-[34px] bg-[#f6f3ee] p-10 text-center shadow-[inset_8px_8px_16px_#d8d3cc,inset_-8px_-8px_16px_#ffffff]">
      <p className="text-xl font-black">{text}</p>
    </div>
  );
}
