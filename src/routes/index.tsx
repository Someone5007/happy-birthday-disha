import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import cakeImg from "@/assets/cake.png";
import cakeSmallImg from "@/assets/cake-small.png";

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

function Index() {
  const [stage, setStage] = useState<Stage>("loading");

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 text-rose-900">
      {stage === "loading" && <Loading onDone={() => setStage("intro")} />}
      {stage === "intro" && <Intro onNext={() => setStage("q1")} />}
      {stage === "q1" && <Question1 onYes={() => setStage("q2")} />}
      {stage === "q2" && <Question2 onYes={() => setStage("final")} />}
      {stage === "final" && <FinalPage />}
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
        {/* Candle flames overlay */}
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

/* ---------- Question 1: How much do you love me ---------- */
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

/* ---------- Question 2: Will you marry me ---------- */
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

/* ---------- Final page: photo frame + cake + quote ---------- */
function FinalPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden px-6 py-12 md:px-16 animate-fade-in">
      {/* floating hearts */}
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
        {/* Left: quote */}
        <div className="order-2 md:order-1 space-y-6 md:pr-8">
          <p className="text-2xl md:text-3xl font-serif italic leading-relaxed text-rose-800">
            “In a world full of ordinary days, you make every single moment feel
            like a celebration. Today the world celebrates you — but for me,
            every day with you already feels like your birthday.”
          </p>
          <p className="text-lg text-rose-700/80">
            Wishing you a year filled with laughter, love, and all the cake your
            heart desires. You are my favorite person, today and always. 💕
          </p>
          <p className="text-xl font-semibold text-rose-600">
            — Yours, forever ✨
          </p>
        </div>

        {/* Right: photo frame with cake overlay */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative">
            <div className="rounded-3xl border-[10px] border-white bg-white p-2 shadow-2xl shadow-rose-300/60 rotate-2">
              <div className="flex h-80 w-72 md:h-96 md:w-80 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-pink-200 text-center text-rose-400">
                <span className="px-6 text-sm">
                  📷 Your photo goes here
                  <br />
                  <span className="text-xs opacity-70">(attach later)</span>
                </span>
              </div>
            </div>

            {/* Cake overlay bottom-right, tilted */}
            <img
              src={cakeSmallImg}
              alt="Birthday cake"
              width={200}
              height={200}
              loading="lazy"
              className="absolute -bottom-10 -right-10 w-36 md:w-44 rotate-12 drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
