"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COUNTDOWN_SECONDS = 15;

export default function CountdownPage() {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setRevealed(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (revealed) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111111] px-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#e81818_0,transparent_34%),radial-gradient(circle_at_bottom_right,#f2b600_0,transparent_30%)] opacity-25" />

        <Confetti />

        <section className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-[#f2b600]">
            UNMUTE2K26
          </p>

          <div className="overflow-hidden">
            <h1 className="motto-reveal text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] md:text-8xl lg:text-9xl">
              Too Loud To Be
              <span className="block text-[#e81818]">Silenced</span>
            </h1>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-base font-semibold leading-8 text-white/70 md:text-lg">
            Every voice has a stage. Every talent has a moment. The fest is
            officially unmuted.
          </p>

          <Link
            href="/"
            className="mt-10 inline-flex rounded-full bg-[#e81818] px-9 py-5 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_40px_rgba(232,24,24,0.35)] transition hover:scale-105"
          >
            Enter Main Website
          </Link>
        </section>

        <style jsx>{`
          .motto-reveal {
            animation: mottoReveal 1.3s ease-out forwards;
          }

          @keyframes mottoReveal {
            from {
              transform: translateX(-110%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </main>
    );
  }

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

      <section className="relative z-10 w-full max-w-4xl text-center">
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

function Confetti() {
  const pieces = [
    { left: "8%", top: "12%", color: "#e81818" },
    { left: "18%", top: "72%", color: "#f2b600" },
    { left: "28%", top: "18%", color: "#ffffff" },
    { left: "38%", top: "82%", color: "#e81818" },
    { left: "48%", top: "10%", color: "#f2b600" },
    { left: "58%", top: "76%", color: "#ffffff" },
    { left: "68%", top: "16%", color: "#e81818" },
    { left: "78%", top: "70%", color: "#f2b600" },
    { left: "88%", top: "24%", color: "#ffffff" },
    { left: "94%", top: "58%", color: "#e81818" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {pieces.map((piece, index) => (
        <span
          key={index}
          className="confetti-piece absolute h-3 w-8 rounded-full"
          style={{
            left: piece.left,
            top: piece.top,
            backgroundColor: piece.color,
            animationDelay: `${index * 0.14}s`,
          }}
        />
      ))}

      <style jsx>{`
        .confetti-piece {
          animation: confettiMove 3.2s ease-in-out infinite;
        }

        @keyframes confettiMove {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-24px) rotate(18deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}