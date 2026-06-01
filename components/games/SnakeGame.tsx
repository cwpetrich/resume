"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Classic Snake, rendered on a canvas. Easter-egg game launched by typing
 * `snake` (or `play snake`) in the interactive terminal.
 *
 * Controls: arrow keys / WASD to move, Space to pause, Esc or Q to quit.
 */
const GRID = 20; // cells per side
const CELL = 16; // px per cell
const SIZE = GRID * CELL;
const TICK_MS = 110;

type Point = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};
const DELTA: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function randFood(snake: Point[]): Point {
  // Deterministic-enough food placement that avoids the snake body.
  let p: Point;
  do {
    p = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export default function SnakeGame({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"playing" | "paused" | "over">(
    "playing",
  );

  // Mutable game state kept in refs so the tick loop doesn't churn React state.
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Dir>("right");
  const nextDirRef = useRef<Dir>("right");
  const foodRef = useRef<Point>(randFood(snakeRef.current));
  const statusRef = useRef(status);
  statusRef.current = status;

  const reset = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = "right";
    nextDirRef.current = "right";
    foodRef.current = randFood(snakeRef.current);
    setScore(0);
    setStatus("playing");
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    // --accent is stored space-separated ("74 222 128"); canvas fillStyle needs
    // the comma form to parse reliably across browsers.
    const accentRaw =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "74 222 128";
    const accent = accentRaw.replace(/\s+/g, ", ");

    ctx.fillStyle = "#0a0e0d";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // grid
    ctx.strokeStyle = "rgba(28,39,35,0.6)";
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, SIZE);
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(SIZE, i * CELL);
      ctx.stroke();
    }

    // food
    ctx.fillStyle = "#ff5f56";
    const f = foodRef.current;
    ctx.fillRect(f.x * CELL + 3, f.y * CELL + 3, CELL - 6, CELL - 6);

    // snake
    ctx.fillStyle = `rgb(${accent})`;
    snakeRef.current.forEach((s, i) => {
      ctx.globalAlpha = i === 0 ? 1 : 0.8;
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    });
    ctx.globalAlpha = 1;
  }, []);

  // Game loop
  useEffect(() => {
    const id = setInterval(() => {
      if (statusRef.current !== "playing") return;

      const dir = nextDirRef.current;
      dirRef.current = dir;
      const head = snakeRef.current[0];
      const next = { x: head.x + DELTA[dir].x, y: head.y + DELTA[dir].y };

      const hitWall =
        next.x < 0 || next.y < 0 || next.x >= GRID || next.y >= GRID;
      const hitSelf = snakeRef.current.some(
        (s) => s.x === next.x && s.y === next.y,
      );
      if (hitWall || hitSelf) {
        setStatus("over");
        return;
      }

      const ate = next.x === foodRef.current.x && next.y === foodRef.current.y;
      const newSnake = [next, ...snakeRef.current];
      if (ate) {
        setScore((s) => s + 1);
        foodRef.current = randFood(newSnake);
      } else {
        newSnake.pop();
      }
      snakeRef.current = newSnake;
      draw();
    }, TICK_MS);
    return () => clearInterval(id);
  }, [draw]);

  // Initial paint
  useEffect(() => {
    draw();
  }, [draw, status]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const map: Record<string, Dir> = {
        arrowup: "up",
        w: "up",
        arrowdown: "down",
        s: "down",
        arrowleft: "left",
        a: "left",
        arrowright: "right",
        d: "right",
      };
      if (map[k]) {
        e.preventDefault();
        const want = map[k];
        // Can't reverse directly into yourself.
        if (want !== OPPOSITE[dirRef.current]) nextDirRef.current = want;
      } else if (k === " ") {
        e.preventDefault();
        setStatus((s) => (s === "playing" ? "paused" : s === "paused" ? "playing" : s));
      } else if (k === "escape" || k === "q") {
        onExit();
      } else if (k === "enter" && statusRef.current === "over") {
        reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit, reset]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onExit}
    >
      <div
        className="rounded-lg border border-term-border bg-term-panel p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-term-accent">snake</span>
          <span className="text-term-dim">score: {score}</span>
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="rounded border border-term-border"
          />
          {status !== "playing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded bg-black/70 text-center">
              <p className="text-lg font-bold text-term-accent">
                {status === "over" ? "GAME OVER" : "PAUSED"}
              </p>
              {status === "over" ? (
                <button
                  onClick={reset}
                  className="rounded border border-term-accent px-3 py-1 text-sm text-term-accent hover:bg-term-accent/10"
                >
                  press Enter to retry
                </button>
              ) : (
                <p className="text-xs text-term-dim">press Space to resume</p>
              )}
            </div>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-term-dim">
          arrows / WASD · Space = pause · Esc or Q = quit
        </p>
      </div>
    </div>
  );
}
