"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen "digital rain" canvas effect. Easter egg launched by typing
 * `matrix` in the interactive terminal. Click or press any key to dismiss.
 */
export default function MatrixRain({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const chars = "アイウエオカキクケコｱｲｳ0123456789ABCDEFｸｹｺ".split("");
    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };
    resize();
    window.addEventListener("resize", resize);

    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "74 222 128";

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

    const dismiss = () => onExit();
    window.addEventListener("keydown", dismiss);
    window.addEventListener("click", dismiss);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("click", dismiss);
    };
  }, [onExit]);

  return (
    <div className="fixed inset-0 z-50 cursor-pointer">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-term-accent">
        [ click or press any key to wake up ]
      </p>
    </div>
  );
}
