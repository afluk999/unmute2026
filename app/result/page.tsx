"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Award,
  BarChart3,
  BookOpen,
  ChevronLeft,
  Crown,
  Filter,
  Layers3,
  Mic2,
  PenLine,
  RefreshCcw,
  Search,
  Trophy,
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
  prizePoints?: number;
  gradePoints?: number;
  points: number;
  updatedAt?: string;
  individualPoints?: number;
isFaceToFace?: boolean;
participants?: string[];
};

type CategoryScore = {
  category: string;
  leader: string;
  scores: {
    team: string;
    score: number;
    color: string;
  }[];
};

type LiveData = {
  success: boolean;
  generatedAt?: string;
  source?: string;
  teams: LiveTeam[];
  results: LiveResult[];
  latestResults: LiveResult[];
  categoryScores: CategoryScore[];
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
  categoryScores: [],
};

export default function ResultPage() {
  const [liveData, setLiveData] = useState<LiveData>(fallbackData);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTeam, setActiveTeam] = useState("All");
  const [activePrize, setActivePrize] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  async function fetchLiveData() {
    try {
      const response = await fetch("/api/live", {
        cache: "no-store",
      });

      const data = await response.json();

      setLiveData({
        success: Boolean(data.success),
        generatedAt: data.generatedAt,
        source: data.source,
        teams: Array.isArray(data.teams) ? data.teams : fallbackData.teams,
        results: Array.isArray(data.results) ? data.results : [],
        latestResults: Array.isArray(data.latestResults)
          ? data.latestResults
          : [],
        categoryScores: Array.isArray(data.categoryScores)
          ? data.categoryScores
          : [],
      });

      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setLiveData(fallbackData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLiveData();

    const interval = setInterval(() => {
      fetchLiveData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    "All",
    "Bidaya",
    "Ula",
    "Thaniya",
    "Thanawiyyah",
    "Aliya",
    "Kulliyah",
  ];

  const teamFilters = ["All", "Vectors", "Vanguards", "Vortex"];
  const prizeFilters = ["All", "First Prize", "Second Prize", "Third Prize"];

  const filteredProgramResults = useMemo(() => {
  const filteredRows = liveData.results.filter((item) => {
    const searchText =
      `${item.code} ${item.program} ${item.student} ${item.team} ${item.category} ${item.prize} ${item.grade}`.toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesTeam = activeTeam === "All" || item.team === activeTeam;
    const matchesPrize = activePrize === "All" || item.prize === activePrize;

    return matchesSearch && matchesCategory && matchesTeam && matchesPrize;
  });

  return buildResultPageProgramGroups(filteredRows);
}, [search, activeCategory, activeTeam, activePrize, liveData.results]);

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-8 text-[#111111] md:px-14">
      <section className="mx-auto max-w-7xl">
        <Header />

        <section className="mb-16 rounded-[42px] bg-[#f6f3ee] p-6 shadow-[14px_14px_30px_#d8d3cc,-14px_-14px_30px_#ffffff] md:p-10">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <SectionMiniLabel icon={<BarChart3 />} text="Live Result" />

              <h1 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
                Result Dashboard
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-[#666]">
                Overall champions, category leaders, and full result cards in one
                live dashboard.
              </p>
            </div>

            <LiveStatus
              loading={loading}
              source={liveData.source || "unknown"}
              lastUpdated={lastUpdated}
              onRefresh={fetchLiveData}
            />
          </div>

          <OverallChampions teams={liveData.teams} />
        </section>

        <CategoryTeamScore categoryScores={liveData.categoryScores} />

        <section className="rounded-[42px] bg-[#f6f3ee] p-6 shadow-[14px_14px_30px_#d8d3cc,-14px_-14px_30px_#ffffff] md:p-10">
          <div className="mb-8">
            <SectionMiniLabel icon={<Search />} text="Search Results" />

            <h2 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">
              Full Results
            </h2>

            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#666]">
              Search by program code, program name, student name, team, category,
              prize, or grade.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-3 text-sm font-black shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] transition hover:scale-105 ${
                  activeCategory === category
                    ? "bg-[#e81818] text-white"
                    : "bg-[#f6f3ee] text-[#111111]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div className="flex items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-4 shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]">
              <Search className="h-5 w-5 text-[#e81818]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search code, name, program..."
                className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#999]"
              />
            </div>

            <select
              value={activeTeam}
              onChange={(event) => setActiveTeam(event.target.value)}
              className="rounded-full bg-[#f6f3ee] px-5 py-4 text-sm font-black outline-none shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]"
            >
              {teamFilters.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={activePrize}
              onChange={(event) => setActivePrize(event.target.value)}
              className="rounded-full bg-[#f6f3ee] px-5 py-4 text-sm font-black outline-none shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]"
            >
              {prizeFilters.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

         <div className="mb-8 flex w-fit items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-3 shadow-[6px_6px_14px_#d8d3cc,-6px_-6px_14px_#ffffff]">
  <Filter className="h-4 w-4 text-[#e81818]" />
  <span className="text-sm font-black">
    {filteredProgramResults.length} program results found
  </span>
</div>

{filteredProgramResults.length > 0 ? (
  <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
    {filteredProgramResults.map((programResult) => (
      <ProgramResultCard
        key={programResult.key}
        programResult={programResult}
      />
    ))}
  </div>
) : (
  <EmptyState />
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
        className="flex items-center gap-3 rounded-full bg-[#f6f3ee] px-6 py-4 text-sm font-extrabold shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] transition hover:scale-105"
      >
        <ChevronLeft className="h-5 w-5 text-[#e81818]" />
        Back Home
      </Link>

      <Link
  href="/individual-results"
  className="hidden items-center gap-3 rounded-full bg-[#111111] px-6 py-4 text-sm font-black text-white shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] transition hover:scale-105 md:flex"
>
  Individual Results
  <Trophy className="h-4 w-4 text-[#f2b600]" />
</Link>

      <div className="flex items-center gap-3 rounded-[28px] bg-[#f6f3ee] px-5 py-4 shadow-[8px_8px_18px_#d7d2ca,-8px_-8px_18px_#ffffff]">
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[inset_4px_4px_8px_#d8d3cc,inset_-4px_-4px_8px_#ffffff]">
  <Image
    src="/brand/unmute-menu-icon.png"
    alt="UNMUTE2K26 Logo"
    width={40}
    height={40}
    className="h-10 w-10 object-contain"
  />
</div>

        <div className="hidden text-left sm:block">
          <p className="text-lg font-black tracking-tight">
            UNMUTE<span className="text-[#e81818]">2K26</span>
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#555]">
            Result
          </p>
        </div>
      </div>
    </div>
  );
}

function LiveStatus({
  loading,
  source,
  lastUpdated,
  onRefresh,
}: {
  loading: boolean;
  source: string;
  lastUpdated: string;
  onRefresh: () => void;
}) {
  const isLive = source === "google-apps-script";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex w-fit items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-3 shadow-[6px_6px_14px_#d8d3cc,-6px_-6px_14px_#ffffff]">
        <span
          className={`h-3 w-3 rounded-full ${
            isLive ? "bg-[#00c853]" : "bg-[#e81818]"
          } ${isLive ? "shadow-[0_0_14px_#00c853]" : ""}`}
        />
        <span className="text-sm font-black">
          {loading ? "Loading..." : isLive ? "Live Sheet Connected" : "Fallback"}
        </span>
      </div>

      <button
        onClick={onRefresh}
        className="flex items-center gap-3 rounded-full bg-[#e81818] px-5 py-3 text-sm font-black text-white shadow-[8px_8px_18px_#d5b8b8,-8px_-8px_18px_#ffffff] transition hover:scale-105"
      >
        <RefreshCcw className="h-4 w-4" />
        Refresh
      </button>

      {lastUpdated && (
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#777]">
          Updated {lastUpdated}
        </p>
      )}
    </div>
  );
}

function OverallChampions({ teams }: { teams: LiveTeam[] }) {
  const sortedTeams = [...teams].sort((a, b) => a.rank - b.rank);

  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:items-end">
      {sortedTeams.map((team) => (
        <div
          key={team.name}
          className={`relative rounded-[36px] bg-[#f6f3ee] p-7 text-center shadow-[10px_10px_22px_#d8d3cc,-10px_-10px_22px_#ffffff] ${
            team.rank === 1 ? "md:-translate-y-8" : ""
          }`}
        >
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] text-4xl font-black text-white shadow-[6px_6px_14px_#d1ccc4,-6px_-6px_14px_#ffffff]"
            style={{ backgroundColor: team.color }}
          >
            {team.rank}
          </div>

          <h3 className="text-3xl font-black">{team.name}</h3>

          <p className="mt-4 text-6xl font-black tracking-tight">
            {team.score}
          </p>

          <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-[#777]">
            Points
          </p>

          <div className="mt-6 rounded-full bg-white px-4 py-3 text-sm font-black text-[#e81818] shadow-[inset_4px_4px_8px_#ded9d2,inset_-4px_-4px_8px_#ffffff]">
            Difference {team.difference}
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryTeamScore({
  categoryScores,
}: {
  categoryScores: CategoryScore[];
}) {
  return (
    <section className="mb-16 rounded-[42px] bg-[#f6f3ee] p-6 shadow-[14px_14px_30px_#d8d3cc,-14px_-14px_30px_#ffffff] md:p-10">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <SectionMiniLabel icon={<Layers3 />} text="Category Team Score" />

          <h2 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">
            Category Leaders
          </h2>

          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[#666]">
            Track which team is dominating each category from Bidaya to Kulliyah.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-3 shadow-[6px_6px_14px_#d8d3cc,-6px_-6px_14px_#ffffff]">
          <Crown className="h-5 w-5 text-[#f2b600]" />
          <span className="text-sm font-extrabold">Lead View</span>
        </div>
      </div>

      {categoryScores.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
          {categoryScores.map((category) => {
            const highestScore = Math.max(
              ...category.scores.map((item) => item.score),
              1
            );

            return (
              <div
                key={category.category}
                className="rounded-[34px] bg-[#f6f3ee] p-6 shadow-[10px_10px_22px_#d8d3cc,-10px_-10px_22px_#ffffff]"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#888]">
                      Category
                    </p>
                    <h3 className="mt-1 text-3xl font-black tracking-tight">
                      {category.category}
                    </h3>
                  </div>

                  <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#e81818] shadow-[inset_4px_4px_8px_#ded9d2,inset_-4px_-4px_8px_#ffffff]">
                    {category.leader}
                  </div>
                </div>

                <div className="space-y-5">
                  {category.scores.map((item) => {
                    const width = `${Math.round(
                      (item.score / highestScore) * 100
                    )}%`;

                    return (
                      <div key={`${category.category}-${item.team}`}>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-black">{item.team}</p>
                          <p className="font-black text-[#e81818]">
                            {item.score}
                          </p>
                        </div>

                        <div className="h-4 rounded-full bg-[#ebe7df] shadow-[inset_4px_4px_8px_#d8d3cc,inset_-4px_-4px_8px_#ffffff]">
                          <div
                            className="h-4 rounded-full"
                            style={{
                              width,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

type ResultPageWinner = {
  student: string;
  team: string;
  grade: string;
  points: number;
  prize: string;
};

type ResultPageProgramGroup = {
  key: string;
  program: string;
  category: string;
  updatedAt: string;
  first: ResultPageWinner[];
  second: ResultPageWinner[];
  third: ResultPageWinner[];
  gradeOnly: ResultPageWinner[];
};

function buildResultPageProgramGroups(results: LiveResult[]) {
  const groupMap = new Map<string, ResultPageProgramGroup>();

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

    const oldTime = new Date(group.updatedAt || 0).getTime();
    const newTime = new Date(result.updatedAt || 0).getTime();

    if (newTime > oldTime) {
      group.updatedAt = result.updatedAt || "";
    }

    const winner: ResultPageWinner = {
      student: result.student || "-",
      team: result.team || "-",
      grade: result.grade || "-",
      points: Number(result.points) || 0,
      prize: result.prize || "",
    };

    const prizeType = detectResultPagePrize(result.prize);

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

    if (hasResultPageGrade(result.grade)) {
      group.gradeOnly.push(winner);
    }
  });

  return Array.from(groupMap.values()).sort((a, b) => {
    const dateA = new Date(a.updatedAt || 0).getTime();
    const dateB = new Date(b.updatedAt || 0).getTime();

    return dateB - dateA;
  });
}

function detectResultPagePrize(prize: string) {
  const value = String(prize || "").toLowerCase();

  if (value.includes("first") || value.includes("1st")) return "first";
  if (value.includes("second") || value.includes("2nd")) return "second";
  if (value.includes("third") || value.includes("3rd")) return "third";

  return "none";
}

function hasResultPageGrade(grade: string) {
  const value = String(grade || "").trim().toUpperCase();

  return value === "A" || value === "B";
}

function ProgramResultCard({
  programResult,
}: {
  programResult: ResultPageProgramGroup;
}) {
  const totalRows =
    programResult.first.length +
    programResult.second.length +
    programResult.third.length +
    programResult.gradeOnly.length;

  return (
    <div className="group relative overflow-hidden rounded-[34px] bg-[#f6f3ee] p-5 shadow-[10px_10px_22px_#d8d3cc,-10px_-10px_22px_#ffffff] transition hover:-translate-y-2">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#e81818] opacity-10 transition duration-500 group-hover:scale-125" />

      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6f3ee] text-[#e81818] shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]">
          <div className="h-7 w-7">{getProgramIcon(programResult.program)}</div>
        </div>

        <div className="rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#e81818] shadow-[inset_4px_4px_8px_#ded9d2,inset_-4px_-4px_8px_#ffffff]">
          {totalRows} entries
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
          <ResultPrizeBox icon="🥇" winners={programResult.first} />
        )}

        {programResult.second.length > 0 && (
          <ResultPrizeBox icon="🥈" winners={programResult.second} />
        )}

        {programResult.third.length > 0 && (
          <ResultPrizeBox icon="🥉" winners={programResult.third} />
        )}

        {programResult.gradeOnly.length > 0 && (
          <ResultPrizeBox icon="⭐" winners={programResult.gradeOnly} />
        )}

        {totalRows === 0 && (
          <div className="rounded-[22px] bg-white/70 px-4 py-4 text-sm font-bold text-[#999]">
            Result not announced
          </div>
        )}
      </div>
    </div>
  );
}

function ResultPrizeBox({
  icon,
  winners,
}: {
  icon: string;
  winners: ResultPageWinner[];
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

              <p className="mt-1 text-xs font-black text-[#e81818]">
                {winner.points} pts
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
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

function EmptyState() {
  return (
    <div className="rounded-[34px] bg-[#f6f3ee] p-10 text-center shadow-[inset_8px_8px_16px_#d8d3cc,inset_-8px_-8px_16px_#ffffff]">
      <p className="text-2xl font-black">No results found</p>
      <p className="mt-2 text-sm font-bold text-[#777]">
        Try changing search text or filters.
      </p>
    </div>
  );
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