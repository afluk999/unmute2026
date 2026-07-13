"use client";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  ChevronLeft,
  Filter,
  Mic2,
  PenLine,
  RefreshCcw,
  Search,
  Trophy,
  UserRound,
} from "lucide-react";

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
  programType?: string;
};

type StudentProfile = {
  key: string;
  student: string;
  team: string;
  category: string;
  totalPoints: number;
  firstCount: number;
  secondCount: number;
  thirdCount: number;
  gradeACount: number;
  gradeBCount: number;
  entries: LiveResult[];
};

function normalizeText(value?: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function normalizeCategoryName(category?: string) {
  const value = normalizeText(category);

  if (value === "bidaya") return "Bidaya";
  if (value === "ula" || value === "uoola") return "Ula";
  if (value === "thaniya") return "Thaniya";
  if (value === "thanawiyyah" || value === "thanawiyya") return "Thanawiyyah";
  if (value === "aliya") return "Aliya";

  if (
    value === "kulliyya" ||
    value === "kulliyyah" ||
    value === "kulliyah" ||
    value === "kuliya" ||
    value === "kuliyya"
  ) {
    return "Kulliyya";
  }

  return String(category || "-").trim() || "-";
}

function isKulliyyaCategory(category?: string) {
  return normalizeCategoryName(category) === "Kulliyya";
}

function isCampusTalent(result: LiveResult) {
  return normalizeText(result.program) === "campustalent";
}

function hasTeamMarker(value?: string) {
  const text = String(value || "").toLowerCase();

  return (
    text.includes("&team") ||
    text.includes("& team") ||
    text.includes("&tem") ||
    text.includes("& tem") ||
    text.includes("and team")
  );
}

function isGroupProgram(result: LiveResult) {
  const programType = normalizeText(result.programType);

  return (
    programType === "group" ||
    hasTeamMarker(result.student) ||
    Boolean(result.isFaceToFace) ||
    (Array.isArray(result.participants) && result.participants.length > 1)
  );
}

function isTeamOnlyProgram(result: LiveResult) {
  // Campus Talent is the special Kulliyya exception:
  // it counts as an individual programme.
  if (isCampusTalent(result)) return false;

  // All other Kulliyya programmes are excluded from individual totals.
  if (isKulliyyaCategory(result.category)) return true;

  return isGroupProgram(result);
}

function getIndividualPoints(result: LiveResult) {
  if (isTeamOnlyProgram(result)) return 0;

  return Number(result.individualPoints ?? result.points) || 0;
}

export default function IndividualResultsPage() {
  const [results, setResults] = useState<LiveResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const [search, setSearch] = useState("");
  const [activeTeam, setActiveTeam] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  async function fetchResults() {
    try {
      setLoading(true);

      const response = await fetch("/api/live", {
        cache: "no-store",
      });

      const data = await response.json();

      setResults(Array.isArray(data.results) ? data.results : []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResults();
  }, []);

  const studentProfiles = useMemo(() => {
    return buildStudentProfiles(results);
  }, [results]);

  const filteredProfiles = useMemo(() => {
    return studentProfiles.filter((profile) => {
      const searchText =
        `${profile.student} ${profile.team} ${profile.category} ${profile.entries
          .map((entry) => entry.program)
          .join(" ")}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesTeam = activeTeam === "All" || profile.team === activeTeam;
      const matchesCategory =
        activeCategory === "All" || profile.category === activeCategory;

      return matchesSearch && matchesTeam && matchesCategory;
    });
  }, [studentProfiles, search, activeTeam, activeCategory]);

  const teams = ["All", "Vectors", "Vanguards", "Vortex"];

  const categories = [
    "All",
    "Bidaya",
    "Ula",
    "Thaniya",
    "Thanawiyyah",
    "Aliya",
    "Kulliyya",
  ];

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-6 py-8 text-[#111111] md:px-14">
      <section className="mx-auto max-w-7xl">
        <Header />

        <section className="mb-10 rounded-[42px] bg-[#f6f3ee] p-6 shadow-[14px_14px_30px_#d8d3cc,-14px_-14px_30px_#ffffff] md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionMiniLabel icon={<UserRound />} text="Individual Result" />

              <h1 className="text-5xl font-black tracking-[-0.05em] md:text-7xl">
                Student Result
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-[#666]">
                Search a student name and view only individual programmes,
                prize details, grade, and total individual points.
              </p>
            </div>

            <button
              onClick={fetchResults}
              className="flex w-fit items-center gap-3 rounded-full bg-[#e81818] px-6 py-4 text-sm font-black text-white shadow-[8px_8px_18px_#d5b8b8,-8px_-8px_18px_#ffffff] transition hover:scale-105"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex w-full items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-4 shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff] md:w-[420px]">
              <Search className="h-5 w-5 text-[#e81818]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student name..."
                className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#999]"
              />
            </div>

            <select
              value={activeTeam}
              onChange={(event) => setActiveTeam(event.target.value)}
              className="rounded-full bg-[#f6f3ee] px-5 py-4 text-sm font-black outline-none shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]"
            >
              {teams.map((team) => (
                <option key={team}>{team}</option>
              ))}
            </select>

            <select
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value)}
              className="rounded-full bg-[#f6f3ee] px-5 py-4 text-sm font-black outline-none shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex w-fit items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-3 shadow-[6px_6px_14px_#d8d3cc,-6px_-6px_14px_#ffffff]">
              <Filter className="h-4 w-4 text-[#e81818]" />
              <span className="text-sm font-black">
                {filteredProfiles.length} profiles found
              </span>
            </div>

            {lastUpdated && (
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#777]">
                Updated {lastUpdated}
              </p>
            )}
          </div>
        </section>

        {loading ? (
          <EmptyState title="Loading results..." text="Please wait." />
        ) : filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
            {filteredProfiles.map((profile) => (
              <StudentResultCard key={profile.key} profile={profile} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No student result found"
            text="Group programmes and normal Kulliyya team programmes are not counted here. Campus Talent is included as an individual programme."
          />
        )}
      </section>
    </main>
  );
}

function buildStudentProfiles(results: LiveResult[]) {
  const map = new Map<string, StudentProfile>();

  results.forEach((result) => {
    if (isTeamOnlyProgram(result)) return;

    const personalPoints = getIndividualPoints(result);
    if (personalPoints <= 0) return;

    const participants =
      Array.isArray(result.participants) && result.participants.length > 0
        ? result.participants
            .map((name) => String(name || "").trim())
            .filter(Boolean)
        : [result.student || "-"];

    participants.forEach((participantName) => {
      const student = participantName || "-";
      const team = result.team || "-";
      const category = normalizeCategoryName(result.category);
      const studentCode = String(result.code || "").trim();
      const key = studentCode
        ? `${studentCode}__${team}__${category}`
        : `${student}__${team}__${category}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          student,
          team,
          category,
          totalPoints: 0,
          firstCount: 0,
          secondCount: 0,
          thirdCount: 0,
          gradeACount: 0,
          gradeBCount: 0,
          entries: [],
        });
      }

      const profile = map.get(key);
      if (!profile) return;

      const personalEntry: LiveResult = {
        ...result,
        student,
        category,
        points: personalPoints,
        individualPoints: personalPoints,
      };

      profile.totalPoints += personalPoints;
      profile.entries.push(personalEntry);

      const prize = String(result.prize || "").toLowerCase();
      const grade = String(result.grade || "").toUpperCase().trim();

      if (prize.includes("first") || prize.includes("1st")) {
        profile.firstCount++;
      }

      if (prize.includes("second") || prize.includes("2nd")) {
        profile.secondCount++;
      }

      if (prize.includes("third") || prize.includes("3rd")) {
        profile.thirdCount++;
      }

      if (grade === "A") profile.gradeACount++;
      if (grade === "B") profile.gradeBCount++;
    });
  });

  return Array.from(map.values()).sort((a, b) => b.totalPoints - a.totalPoints);
}

function StudentResultCard({ profile }: { profile: StudentProfile }) {
  return (
    <div className="overflow-hidden rounded-[38px] bg-[#f6f3ee] p-6 shadow-[12px_12px_26px_#d8d3cc,-12px_-12px_26px_#ffffff]">
      <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e81818]">
            {profile.category}
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            {profile.student}
          </h2>

          <p className="mt-2 text-sm font-bold text-[#666]">{profile.team}</p>
        </div>

        <div className="w-fit rounded-[26px] bg-[#111111] px-6 py-4 text-white shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">
            Total
          </p>
          <p className="text-4xl font-black">{profile.totalPoints}</p>
        </div>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-5">
        <MiniStat label="1st" value={profile.firstCount} />
        <MiniStat label="2nd" value={profile.secondCount} />
        <MiniStat label="3rd" value={profile.thirdCount} />
        <MiniStat label="A" value={profile.gradeACount} />
        <MiniStat label="B" value={profile.gradeBCount} />
      </div>

      <div className="space-y-3">
        {profile.entries.map((entry, index) => (
          <ProgramEntryRow key={`${entry.id}-${index}`} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[20px] bg-[#f6f3ee] px-4 py-3 text-center shadow-[inset_5px_5px_10px_#d8d3cc,inset_-5px_-5px_10px_#ffffff]">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#777]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-[#e81818]">{value}</p>
    </div>
  );
}

function ProgramEntryRow({ entry }: { entry: LiveResult }) {
  return (
    <div className="rounded-[24px] bg-[#f6f3ee] p-4 shadow-[inset_5px_5px_10px_#ddd8d1,inset_-5px_-5px_10px_#ffffff]">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#e81818] shadow-[4px_4px_10px_#ddd7cf,-4px_-4px_10px_#ffffff]">
          <div className="h-6 w-6">{getProgramIcon(entry.program)}</div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black">{entry.program}</h3>

          <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-[#666]">
            {entry.prize && <Badge text={entry.prize} />}
            {entry.grade && <Badge text={`Grade ${entry.grade}`} />}
            <Badge text={`${entry.points} pts`} strong />
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ text, strong = false }: { text: string; strong?: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 ${
        strong
          ? "bg-[#e81818] text-white"
          : "bg-white text-[#555] shadow-[inset_3px_3px_6px_#ded9d2,inset_-3px_-3px_6px_#ffffff]"
      }`}
    >
      {text}
    </span>
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
        href="/result"
        className="flex items-center gap-3 rounded-full bg-[#111111] px-6 py-4 text-sm font-black text-white shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] transition hover:scale-105"
      >
        Full Results
        <Trophy className="h-4 w-4 text-[#f2b600]" />
      </Link>
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

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[34px] bg-[#f6f3ee] p-10 text-center shadow-[inset_8px_8px_16px_#d8d3cc,inset_-8px_-8px_16px_#ffffff]">
      <p className="text-2xl font-black">{title}</p>
      <p className="mt-2 text-sm font-bold text-[#777]">{text}</p>
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