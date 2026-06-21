"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const COUNTDOWN_SECONDS = 15;
const COUNTDOWN_END_AT = 25.2;
const BISMILLAH_SECONDS = 5;

const COUNTDOWN_TIMELINE = [
  { at: 0, number: 15 },
  { at: 4.6, number: 15 },
  { at: 6.5, number: 14 },
  { at: 8.9, number: 13 },
  { at: 10.2, number: 12 },
  { at: 12.0, number: 11 },
  { at: 14.0, number: 10 },
  { at: 15.0, number: 9 },
  { at: 15.95, number: 8 },
  { at: 16.9, number: 7 },
  { at: 17.85, number: 6 },
  { at: 18.75, number: 5 },
  { at: 19.7, number: 4 },
  { at: 20.6, number: 3 },
  { at: 21.6, number: 2 },
  { at: 22.5, number: 1 },
];
const TEAM_POSTERS = [
  "/posters/posters-team-2.jpeg",
  "/posters/posters-team-3.jpeg",
  "/posters/posters-team-1.jpeg",
];

type Phase = "intro" | "countdown" | "bismillah" | "hero";

export default function InaugurationPage() {
 const [phase, setPhase] = useState<Phase>("intro");
const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

const beatAudioRef = useRef<HTMLAudioElement | null>(null);

function stopAudio(audio: HTMLAudioElement | null) {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
}

useEffect(() => {
  beatAudioRef.current = new Audio("/audio/countdown-beat.mp3");

  return () => {
    stopAudio(beatAudioRef.current);
  };
}, []);

function startCountdown() {
  const audio = beatAudioRef.current || new Audio("/audio/countdown-beat.mp3");
  beatAudioRef.current = audio;

  audio.pause();
  audio.currentTime = 0;
  audio.volume = 1;
  audio.muted = false;

  audio.play().catch((error) => {
    console.log("Beat audio failed:", error);
  });

  setSecondsLeft(COUNTDOWN_SECONDS);
  setPhase("countdown");
}

useEffect(() => {
  if (phase !== "countdown") return;

  setSecondsLeft(COUNTDOWN_SECONDS);

  const timer = setInterval(() => {
    setSecondsLeft((current) => {
      if (current <= 1) {
        clearInterval(timer);
        stopAudio(beatAudioRef.current);
        setPhase("bismillah");
        return 0;
      }

      return current - 1;
    });
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, [phase]);

useEffect(() => {
  if (phase !== "bismillah") return;

  const timer = setTimeout(() => {
    setPhase("hero");
  }, BISMILLAH_SECONDS * 1000);

  return () => clearTimeout(timer);
}, [phase]);


  if (phase === "intro") {
    return (
      <main className="min-h-screen overflow-hidden bg-[#f6f3ee] text-[#111111]">
        <section className="relative flex min-h-screen items-center justify-center px-6 py-10 md:px-12">
          <div className="pointer-events-none absolute -left-28 top-10 h-80 w-80 rounded-full bg-[#e81818]/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-28 bottom-10 h-96 w-96 rounded-full bg-[#f2b600]/20 blur-3xl" />

          <div className="pointer-events-none absolute bottom-0 left-0 text-[120px] font-black uppercase leading-none tracking-[-0.08em] text-[#111111]/[0.03] md:text-[220px]">
            UNMUTE
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-[0.95fr_1.05fr]">
            <div className="text-center md:text-left">
              <div className="mx-auto mb-6 w-fit rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.28em] text-[#e81818] shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] md:mx-0">
                Official Opening
              </div>

              <h1 className="text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] md:text-7xl lg:text-8xl">
                The Stage
                <span className="block text-[#e81818]">Awakens</span>
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-base font-semibold leading-8 text-[#555555] md:mx-0 md:text-lg">
                A short launch moment for UNMUTE2K26. Start the timer and
                reveal the voice of the fest.
              </p>

              <div className="mt-10 flex justify-center md:justify-start">
                <button
                  onClick={startCountdown}
                  className="rounded-[22px] bg-[#e81818] px-9 py-5 text-base font-black uppercase tracking-[0.06em] text-white shadow-[12px_12px_26px_#d8d3cc,-12px_-12px_26px_#ffffff] transition hover:scale-105 active:scale-95"
                >
                  Start Countdown
                </button>
              </div>
            </div>

            <div className="relative mx-auto h-[470px] w-full max-w-[620px]">
              <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e81818]/10" />

              <div className="absolute left-4 top-28 h-72 w-48 -rotate-12 overflow-hidden rounded-[30px] bg-white p-2 shadow-[14px_14px_30px_#cfcac2,-14px_-14px_30px_#ffffff]">
                <img
                  src={TEAM_POSTERS[0]}
                  alt="Team poster one"
                  className="h-full w-full rounded-[24px] object-cover object-top"
                />
              </div>

              <div className="absolute left-1/2 top-15 z-20 h-[360px] w-60 -translate-x-1/2 overflow-hidden rounded-[32px] bg-white p-2 shadow-[18px_18px_38px_#cfcac2,-18px_-18px_38px_#ffffff]">
                <img
                  src={TEAM_POSTERS[1]}
                  alt="Team poster two"
                  className="h-full w-full rounded-[24px] object-cover object-top"
                />
              </div>

              <div className="absolute right-4 top-28 h-72 w-48 rotate-12 overflow-hidden rounded-[30px] bg-white p-2 shadow-[14px_14px_30px_#cfcac2,-14px_-14px_30px_#ffffff]">
                <img
                  src={TEAM_POSTERS[2]}
                  alt="Team poster three"
                  className="h-full w-full rounded-[24px] object-cover object-top"
                />
              </div>

              <div className="absolute bottom-0 left-1/2 z-30 w-[92%] -translate-x-1/2 rounded-[30px] border border-white/70 bg-white/75 p-6 text-center shadow-[14px_14px_34px_#cfcac2,-14px_-14px_34px_#ffffff] backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#e81818]">
                  Teams Ready
                </p>

                <h3 className="mt-2 text-2xl font-black uppercase tracking-[-0.05em]">
                  <span className="text-[#bf7d2a]">Vortex</span>
                  <span className="mx-2 text-[#111111]">•</span>
                  <span className="text-[#2aa1b3]">Vectors</span>
                  <span className="mx-2 text-[#111111]">•</span>
                  <span className="text-[#b41f6c]">Vanguards</span>
                </h3>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (phase === "countdown") {
    const seconds = String(secondsLeft).padStart(2, "0");
    const firstDigit = seconds[0];
    const secondDigit = seconds[1];

    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f3ee] px-6 py-10 text-[#111111]">
        <div className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-[#e81818]/15 blur-3xl" />
        <div className="absolute -right-28 bottom-10 h-96 w-96 rounded-full bg-[#f2b600]/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-0 text-[150px] font-black uppercase leading-none tracking-[-0.08em] text-[#111111]/[0.03] md:text-[260px]">
          COUNTDOWN
        </div>

        <section className="countdown-enter relative z-10 w-full max-w-4xl text-center">
          <p className="text-5xl font-black uppercase leading-none tracking-[-0.07em] md:text-8xl">
            Countdown
          </p>

          <p className="mt-2 text-2xl font-black uppercase tracking-[-0.05em] md:text-4xl">
            Production Start
          </p>

          <div className="mx-auto mt-12 flex justify-center gap-4 md:gap-6">
            <CountdownDigit digit={firstDigit} />
            <CountdownDigit digit={secondDigit} />
          </div>

          <p className="mt-7 text-3xl font-black uppercase tracking-[-0.05em]">
            Seconds
          </p>

          <p className="mt-10 text-xs font-black uppercase tracking-[0.28em] text-[#e81818]">
            UNMUTE2K26 · Stay Tuned
          </p>
        </section>

        <style jsx>{`
          .countdown-enter {
            animation: countdownEnter 0.7s ease-out forwards;
          }

          @keyframes countdownEnter {
            from {
              transform: scale(0.92) translateY(24px);
              opacity: 0;
            }
            to {
              transform: scale(1) translateY(0);
              opacity: 1;
            }
          }
        `}</style>
      </main>
    );
  }

  if (phase === "bismillah") {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111111] px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#e81818_0,transparent_34%),radial-gradient(circle_at_bottom_right,#f2b600_0,transparent_30%)] opacity-25" />

      <section className="bismillah-reveal relative z-10 mx-auto max-w-5xl text-center">
        <h1
          dir="rtl"
          className="text-5xl font-black leading-[1.35] text-[#f6f3ee] md:text-7xl lg:text-8xl"
        >
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
        </h1>

        <div className="mx-auto mt-10 h-1 w-56 rounded-full bg-gradient-to-r from-[#e81818] via-[#f2b600] to-[#ffffff]" />
      </section>

      <style jsx>{`
        .bismillah-reveal {
          animation: bismillahReveal 1s ease-out forwards;
        }

        @keyframes bismillahReveal {
          from {
            transform: translateY(30px) scale(0.96);
            opacity: 0;
            filter: blur(10px);
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
    </main>
  );
}
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111111] px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#e81818_0,transparent_35%),radial-gradient(circle_at_bottom_right,#f2b600_0,transparent_30%)] opacity-30" />

      <Confetti />
      <SoundWave />

      <section className="hero-open relative z-10 mx-auto max-w-6xl text-center">
        <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-[#f2b600]">
          Officially Unmuted
        </p>

        <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-[-0.08em] md:text-9xl">
          Unmute
          <span className="block text-[#e81818]">Your Voice</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-base font-semibold leading-8 text-white/70 md:text-lg">
          The silence is broken. Let every voice rise and every talent speak.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-[#e81818] px-9 py-5 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_40px_rgba(232,24,24,0.35)] transition hover:scale-105"
        >
          Enter Main Website
        </Link>
      </section>

      <style jsx>{`
        .hero-open {
          animation: heroOpen 1.1s ease-out forwards;
        }

        @keyframes heroOpen {
          from {
            transform: scale(0.9);
            opacity: 0;
            filter: blur(12px);
          }
          to {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
    </main>
  );
}

function CountdownDigit({ digit }: { digit: string }) {
  return (
    <div className="relative flex h-[170px] w-[135px] items-center justify-center overflow-hidden rounded-[28px] bg-[#111111] text-[#f6f3ee] shadow-[12px_12px_28px_#d8d3cc,-12px_-12px_28px_#ffffff] md:h-[240px] md:w-[185px] md:rounded-[36px]">
      <span className="absolute left-0 top-1/2 z-20 h-[2px] w-full -translate-y-1/2 bg-[#f6f3ee]" />
      <span className="absolute left-0 top-0 h-1/2 w-full bg-white/5" />
      <span className="absolute bottom-0 left-0 h-1/2 w-full bg-black/25" />

      <span className="relative z-10 text-[118px] font-black leading-none tracking-[-0.12em] md:text-[170px]">
        {digit}
      </span>
    </div>
  );
}

function SoundWave() {
  const bars = Array.from({ length: 34 });

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 z-0 flex items-end justify-center gap-2 opacity-70">
      {bars.map((_, index) => (
        <span
          key={index}
          className="wave-bar w-2 rounded-full"
          style={{
            height: `${24 + (index % 7) * 14}px`,
            animationDelay: `${index * 0.04}s`,
            background:
              index % 3 === 0
                ? "#e81818"
                : index % 3 === 1
                  ? "#f2b600"
                  : "#ffffff",
          }}
        />
      ))}

      <style jsx>{`
        .wave-bar {
          animation: waveMove 0.8s ease-in-out infinite alternate;
        }

        @keyframes waveMove {
          from {
            transform: scaleY(0.35);
            opacity: 0.45;
          }
          to {
            transform: scaleY(1.45);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function Confetti() {
  const pieces = [
    { left: "4%", delay: "0s", color: "#e81818" },
    { left: "10%", delay: "0.2s", color: "#f2b600" },
    { left: "18%", delay: "0.4s", color: "#ffffff" },
    { left: "25%", delay: "0.1s", color: "#e81818" },
    { left: "33%", delay: "0.35s", color: "#f2b600" },
    { left: "42%", delay: "0.15s", color: "#ffffff" },
    { left: "50%", delay: "0.45s", color: "#e81818" },
    { left: "58%", delay: "0.25s", color: "#f2b600" },
    { left: "66%", delay: "0.05s", color: "#ffffff" },
    { left: "74%", delay: "0.32s", color: "#e81818" },
    { left: "82%", delay: "0.18s", color: "#f2b600" },
    { left: "90%", delay: "0.38s", color: "#ffffff" },
    { left: "96%", delay: "0.12s", color: "#e81818" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {pieces.map((piece, index) => (
        <span
          key={index}
          className="confetti-fall absolute -top-10 h-3 w-8 rounded-full"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
          }}
        />
      ))}

      <div className="popper left-popper" />
      <div className="popper right-popper" />

      <style jsx>{`
        .confetti-fall {
          animation: confettiFall 4s linear infinite;
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(420deg);
            opacity: 0.9;
          }
        }

        .popper {
          position: absolute;
          bottom: 80px;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #f2b600;
          box-shadow:
            0 0 0 0 rgba(242, 182, 0, 0.8),
            0 0 0 0 rgba(232, 24, 24, 0.6);
          animation: popperBlast 1.4s ease-out infinite;
        }

        .left-popper {
          left: 9%;
        }

        .right-popper {
          right: 9%;
          background: #e81818;
        }

        @keyframes popperBlast {
          0% {
            transform: scale(0.4);
            box-shadow:
              0 0 0 0 rgba(242, 182, 0, 0.8),
              0 0 0 0 rgba(232, 24, 24, 0.6);
          }
          100% {
            transform: scale(1.8);
            box-shadow:
              0 -70px 0 8px rgba(242, 182, 0, 0),
              60px -90px 0 6px rgba(232, 24, 24, 0);
          }
        }
      `}</style>
    </div>
  );
}