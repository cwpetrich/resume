"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen "digital rain" canvas effect. Easter egg launched by typing
 * `matrix` in the interactive terminal. Press Esc, click the ✕, or click the
 * backdrop to dismiss.
 *
 * Notes on robustness (learned the hard way):
 *  - `onExit` is kept in a ref so the animation effect has an EMPTY dependency
 *    array and never tears down / restarts on parent re-renders.
 *  - Dismiss is bound to Escape only (not "any key"), and the listener is
 *    attached on a short delay so the keystroke that launched it can't
 *    immediately close it.
 */
export default function MatrixRain({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const chars = "アイウエオカキクケコｱｲｳ0123456789ABCDEFｸｹｺ".split("");
    const fontSize = 16;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.max(1, Math.floor(canvas.width / fontSize));
      drops = Array(columns).fill(1);
      // Paint an opaque backdrop once so the first frames are unmistakable.
      ctx.fillStyle = "#0a0e0d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // --accent is stored space-separated ("74 222 128"); canvas fillStyle needs
    // the comma form to parse reliably across browsers.
    const accentRaw =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "74 222 128";
    const accent = accentRaw.replace(/\s+/g, ", ");

    const draw = () => {
      ctx.fillStyle = "rgba(10, 14, 13, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgb(${accent})`;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    // Esc to dismiss — attached on a delay so the launching keypress can't.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExitRef.current();
    };
    const t = setTimeout(() => window.addEventListener("keydown", onKey), 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 cursor-pointer"
      onClick={() => onExitRef.current()}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onExitRef.current();
        }}
        className="absolute right-4 top-4 z-10 rounded border border-term-accent/60 px-3 py-1 text-xs text-term-accent hover:bg-term-accent/10"
      >
        ✕ exit
      </button>
      <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-xs text-term-accent">
        [ press Esc or click anywhere to wake up ]
      </p>
    </div>
  );
}
