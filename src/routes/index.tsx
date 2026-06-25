import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import cakeImg from "@/assets/cake.png";
import cakeSmallImg from "@/assets/cake-small.png";
import dainastaImg from "@/assets/dainasta.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday Dainasta Darling" },
      { name: "description", content: "A little birthday surprise just for you." },
    ],
  }),
  component: Index,
});

type Stage = "loading" | "intro" | "q1" | "q2" | "final";
const ORDER: Stage[] = ["loading", "intro", "q1", "q2", "final"];

function Index() {
  const [stage, setStage] = useState<Stage>("loading");
  const [anim, setAnim] = useState<"in" | "out">("in");
  const pendingRef = useRef<Stage | null>(null);

  const go = (next: Stage) => {
    pendingRef.current = next;
    setAnim("out");
    setTimeout(() => {
      setStage(next);
      setAnim("in");
    }, 350);
  };

  const goPrev = () => {
    const idx = ORDER.indexOf(stage);
    if (idx > 1) go(ORDER[idx - 1]); // skip back to loading
  };

  const transitionClass =
    anim === "in"
      ? "opacity-100 translate-y-0 scale-100"
      : "opacity-0 translate-y-4 scale-95";

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 text-rose-900">
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes cakeFloat {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-8px) rotate(14deg); }
        }
        .float-photo { animation: floaty 4.5s ease-in-out infinite; }
        .float-cake { animation: cakeFloat 3.5s ease-in-out infinite; }
      `}</style>

      <div
        className={`transition-all duration-300 ease-out ${transitionClass}`}
      >
        {stage === "loading" && <Loading onDone={() => go("intro")} />}
        {stage === "intro" && <Intro onNext={() => go("q1")} />}
        {stage === "q1" && <Question1 onYes={() => go("q2")} />}
        {stage === "q2" && <Question2 onYes={() => go("final")} />}
        {stage === "final" && <FinalPage />}
      </div>

      {stage !== "loading" && stage !== "intro" && (
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="fixed bottom-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-rose-600 shadow-lg ring-1 ring-rose-200 backdrop-blur transition-transform hover:scale-110 hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ---------- Loading screen: cake with candles that blow out ---------- */
function Loading({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [blown, setBlown] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          return 100;
        }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setBlown(true);
      const t = setTimeout(onDone, 1400);
      return () => clearTimeout(t);
    }
  }, [progress, onDone]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-rose-600 animate-fade-in">
        Preparing your surprise...
      </h1>

      <div className="relative">
        <img
          src={cakeImg}
          alt="Birthday cake"
          width={320}
          height={320}
          className="w-64 md:w-80 drop-shadow-2xl"
        />
        <div className="absolute left-1/2 top-[18%] flex -translate-x-1/2 gap-6">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-5 w-3 rounded-full bg-gradient-to-t from-orange-500 via-yellow-300 to-white shadow-[0_0_20px_6px_rgba(255,180,80,0.7)] transition-all duration-700 ${
                blown ? "opacity-0 -translate-y-6 scale-0" : "animate-pulse"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
        {blown && (
          <div className="absolute left-1/2 top-[10%] -translate-x-1/2 text-2xl animate-fade-in">
            💨
          </div>
        )}
      </div>

      <div className="w-72 md:w-96">
        <div className="h-3 w-full overflow-hidden rounded-full bg-rose-200">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-rose-500">{progress}%</p>
      </div>
    </div>
  );
}

/* ---------- Intro page ---------- */
function Intro({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 text-center animate-fade-in">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-rose-600">
        Answer these questions <br /> for the surprise 🎁
      </h1>
      <p className="max-w-xl text-lg text-rose-700/80">
        Just two tiny questions, my love. Be honest okay? 💖
      </p>
      <button
        onClick={onNext}
        className="rounded-full bg-rose-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-rose-300 transition-transform hover:scale-105 hover:bg-rose-600"
      >
        Next →
      </button>
    </div>
  );
}

/* ---------- Question 1 ---------- */
function Question1({ onYes }: { onYes: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const cy =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const bx = rect.left + rect.width / 2;
    const by = rect.top + rect.height / 2;
    const dx = bx - cx;
    const dy = by - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 160) {
      const angle = Math.atan2(dy, dx);
      const push = 180;
      const maxX = window.innerWidth / 2 - 100;
      const maxY = window.innerHeight / 2 - 100;
      const nx = Math.max(-maxX, Math.min(maxX, pos.x + Math.cos(angle) * push * 0.4));
      const ny = Math.max(-maxY, Math.min(maxY, pos.y + Math.sin(angle) * push * 0.4));
      setPos({ x: nx, y: ny });
    }
  };

  return (
    <div
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      className="relative flex min-h-screen flex-col items-center justify-center gap-12 px-6 text-center animate-fade-in"
    >
      <h2 className="text-3xl md:text-5xl font-extrabold text-rose-600">
        How much do you love me? 💕
      </h2>

      <div className="relative flex w-full max-w-2xl items-center justify-center gap-10">
        <button
          ref={btnRef}
          aria-disabled
          tabIndex={-1}
          onClick={(e) => e.preventDefault()}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: "transform 0.25s cubic-bezier(.2,.9,.3,1.4)",
          }}
          className="rounded-full bg-rose-200 px-8 py-4 text-lg font-semibold text-rose-500/70 shadow"
        >
          0%
        </button>

        <button
          onClick={onYes}
          className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-rose-300 transition-transform hover:scale-110"
        >
          100% ❤️
        </button>
      </div>

      <p className="text-sm text-rose-500/70">(Pick wisely 😉)</p>
    </div>
  );
}

/* ---------- Question 2 ---------- */
function Question2({ onYes }: { onYes: () => void }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const dodge = () => {
    const maxX = window.innerWidth / 2 - 120;
    const maxY = window.innerHeight / 2 - 120;
    setNoPos({
      x: Math.random() * maxX * 2 - maxX,
      y: Math.random() * maxY * 2 - maxY,
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-12 px-6 text-center animate-fade-in">
      <h2 className="text-3xl md:text-5xl font-extrabold text-rose-600">
        Will you marry me? 💍
      </h2>

      <div className="relative flex w-full max-w-2xl items-center justify-center gap-10">
        <button
          onClick={onYes}
          className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-12 py-5 text-xl font-bold text-white shadow-lg shadow-rose-300 transition-transform hover:scale-110"
        >
          Yes 💖
        </button>

        <button
          onMouseEnter={dodge}
          onTouchStart={dodge}
          onClick={dodge}
          style={{
            transform: `translate(${noPos.x}px, ${noPos.y}px)`,
            transition: "transform 0.35s cubic-bezier(.2,.9,.3,1.4)",
          }}
          className="rounded-full bg-rose-200 px-8 py-4 text-lg font-semibold text-rose-500/70 shadow"
        >
          No
        </button>
      </div>
    </div>
  );
}

/* ---------- Happy Birthday melody via Web Audio ---------- */
function useHappyBirthday() {
  useEffect(() => {
    const AC =
      (window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
        .AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    let stopped = false;

    // Happy Birthday melody (note, beats)
    const N = (n: string) => {
      const map: Record<string, number> = {
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
        G4: 392.0, A4: 440.0, Bb4: 466.16, B4: 493.88,
        C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
      };
      return map[n];
    };
    const melody: [string, number][] = [
      ["C4", 0.75], ["C4", 0.25], ["D4", 1], ["C4", 1], ["F4", 1], ["E4", 2],
      ["C4", 0.75], ["C4", 0.25], ["D4", 1], ["C4", 1], ["G4", 1], ["F4", 2],
      ["C4", 0.75], ["C4", 0.25], ["C5", 1], ["A4", 1], ["F4", 1], ["E4", 1], ["D4", 2],
      ["Bb4", 0.75], ["Bb4", 0.25], ["A4", 1], ["F4", 1], ["G4", 1], ["F4", 2],
    ];

    const play = () => {
      const tempo = 0.38; // seconds per beat
      let t = ctx.currentTime + 0.1;
      melody.forEach(([note, beats]) => {
        const dur = beats * tempo;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = N(note);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur);
        t += dur;
      });
      const totalMs = (t - ctx.currentTime) * 1000;
      if (!stopped) setTimeout(play, totalMs + 800);
    };

    const start = () => {
      ctx.resume().then(play);
    };
    start();

    return () => {
      stopped = true;
      ctx.close().catch(() => {});
    };
  }, []);
}

/* ---------- Final page ---------- */
function FinalPage() {
  useHappyBirthday();

  return (
    <div className="relative min-h-screen w-full overflow-hidden px-6 py-12 md:px-16 animate-fade-in">
      <div className="pointer-events-none absolute inset-0 -z-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl opacity-60 animate-pulse"
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${(i * 47) % 100}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            💖
          </span>
        ))}
      </div>

      <h1 className="relative z-10 text-center text-4xl md:text-6xl font-extrabold leading-tight text-rose-600 drop-shadow-sm">
        Happy Birthday Dainasta Darling 🎉
      </h1>

      <div className="relative z-10 mt-12 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1 space-y-6 md:pr-8">
          <p className="whitespace-pre-line text-lg md:text-xl leading-relaxed text-rose-800">
            {`Happy Birthday, my love! ❤️

To my beautiful girl, today is all about celebrating you. You make my world brighter just by being in it, and I'm so grateful for every smile, every laugh, and every moment we share. I hope this year brings you as much happiness as you've given me. You deserve all the love, joy, and success in the world.

I love you endlessly, and I'm so blessed to call you mine.

Enjoy your special day, my queen! 🎂🎉❤️`}
          </p>
          <p className="text-xl font-semibold text-rose-600">
            — your sweet boy rezaul
          </p>
        </div>

        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative float-photo">
            <div className="rounded-3xl border-[10px] border-white bg-white p-2 shadow-2xl shadow-rose-300/60">
              <img
                src={dainastaImg.url}
                alt="Dainasta"
                className="h-80 w-72 md:h-96 md:w-80 rounded-2xl object-cover"
              />
            </div>

            <img
              src={cakeSmallImg}
              alt="Birthday cake"
              width={200}
              height={200}
              loading="lazy"
              className="float-cake absolute -bottom-10 -right-10 w-36 md:w-44 drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
