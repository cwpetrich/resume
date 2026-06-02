"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResumeData } from "@/lib/data";
import SnakeGame from "./games/SnakeGame";
import MatrixRain from "./games/MatrixRain";

/* -------------------------------------------------------------------------- */
/*  Theme accent presets (RGB triplets matching --accent in globals.css).     */
/* -------------------------------------------------------------------------- */
const THEMES: Record<string, string> = {
  green: "74 222 128",
  amber: "251 191 36",
  cyan: "34 211 238",
  magenta: "232 121 249",
  red: "248 113 113",
};

type Line = { id: number; html: string };

let lineId = 0;

/** Build a styled output line (very small markup vocabulary). */
const L = (html: string): Line => ({ id: lineId++, html });

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const BANNER = String.raw`
   ___                          _
  / __|___ _ _  _ _ __ _ __ _  | |
 | (__/ _ \ ' \| '_/ _` + "`" + ` / _` + "`" + ` | |_|
  \___\___/_||_|_| \__,_\__,_| (_)
`;

export default function InteractiveTerminal({ data }: { data: ResumeData }) {
  const { profile, socials, skills, projects, experience, education } = data;
  const email = profile.email;

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [game, setGame] = useState<null | "snake" | "matrix">(null);
  /** Sub-shell mode for the number-guessing easter egg. */
  const [mode, setMode] = useState<"shell" | "guess">("shell");
  const guessRef = useRef<{ secret: number; tries: number }>({
    secret: 0,
    tries: 0,
  });
  const historyRef = useRef<string[]>([]);
  const histIdxRef = useRef<number>(-1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const print = useCallback((html: string | string[]) => {
    const arr = Array.isArray(html) ? html : [html];
    setLines((prev) => [...prev, ...arr.map(L)]);
  }, []);

  // Greeting on first mount.
  useEffect(() => {
    print([
      `<span class="text-term-accent">${BANNER.replace(/</g, "&lt;")}</span>`,
      `Welcome to <span class="text-term-accent">${profile.username}@${profile.host}</span>. This is a real shell — sort of.`,
      `Type <span class="text-term-accent">help</span> to list commands. Type <span class="text-term-accent">ls</span> to look around.`,
      `<span class="text-term-dim">(psst: some commands aren't in <span class="text-term-accent">help</span>. and there's a famous 10-key code…)</span>`,
      "",
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom on new output.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  /* ----------------------------- Konami code ---------------------------- */
  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const want =
        KONAMI[pos].length === 1 ? KONAMI[pos].toLowerCase() : KONAMI[pos];
      if (key === want) {
        pos++;
        if (pos === KONAMI.length) {
          pos = 0;
          print([
            "",
            `<span class="text-term-accent">★ KONAMI CODE ACCEPTED ★</span>`,
            `30 extra lives granted. Also: all hidden games unlocked.`,
            `Try <span class="text-term-accent">snake</span>, <span class="text-term-accent">matrix</span>, <span class="text-term-accent">guess</span>, or <span class="text-term-accent">games</span>.`,
            "",
          ]);
        }
      } else {
        pos = key === (KONAMI[0].length === 1 ? KONAMI[0].toLowerCase() : KONAMI[0]) ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [print]);

  /* --------------------------- Command handling -------------------------- */
  const runShell = useCallback(
    (raw: string): string[] | "CLEAR" => {
      const setAccent = (name: string): string => {
        const rgb = THEMES[name];
        if (!rgb) {
          return `theme: unknown color "${name}". try: ${Object.keys(THEMES).join(", ")}`;
        }
        document.documentElement.style.setProperty("--accent", rgb);
        return `theme set to <span class="text-term-accent">${name}</span>.`;
      };

      const [cmd, ...rest] = raw.trim().split(/\s+/);
      const arg = rest.join(" ");
      switch (cmd.toLowerCase()) {
        case "help":
          return [
            "available commands:",
            "  <span class='text-term-accent'>help</span>        this list",
            "  <span class='text-term-accent'>ls</span>          list sections",
            "  <span class='text-term-accent'>whoami</span>      who is this guy",
            "  <span class='text-term-accent'>skills</span>      tech I work with",
            "  <span class='text-term-accent'>experience</span>  work history",
            "  <span class='text-term-accent'>projects</span>    things I've built",
            "  <span class='text-term-accent'>education</span>    where I studied",
            "  <span class='text-term-accent'>contact</span>     how to reach me",
            "  <span class='text-term-accent'>resume</span>      download résumé as PDF",
            "  <span class='text-term-accent'>theme</span> [c]   recolor the UI (green/amber/cyan/...)",
            "  <span class='text-term-accent'>clear</span>       clear the screen",
            "  <span class='text-term-dim'>...and a few more that aren't on this list.</span>",
          ];
        case "ls":
          return [
            "about.md   experience.log   skills.txt",
            "projects/  education.md     contact.sh",
          ];
        case "whoami":
        case "about":
          return [
            `<span class="text-term-accent">${profile.name}</span> — ${profile.title}`,
            "",
            ...profile.about,
          ];
        case "skills":
          return skills.map(
            (g) =>
              `<span class="text-term-accent">${g.label.padEnd(14)}</span>${g.items.join(", ")}`,
          );
        case "experience":
        case "work":
          return experience.flatMap((j) => [
            `<span class="text-term-accent">${j.role}</span> @ ${j.company} <span class="text-term-dim">(${j.period})</span>`,
            ...j.highlights.map((h) => `  ▸ ${h}`),
            "",
          ]);
        case "projects":
          return projects.flatMap((p) => [
            `<span class="text-term-accent">${p.slug}/</span>  ${p.description}`,
          ]);
        case "education":
          return education.map(
            (e) =>
              `<span class="text-term-accent">${e.credential}</span> — ${e.school} <span class="text-term-dim">(${e.period})</span>`,
          );
        case "contact":
          return [
            `email     <span class="text-term-accent">${email}</span>`,
            ...socials
              .filter((s) => s.label !== "Email")
              .map(
                (s) =>
                  `${s.label.toLowerCase().padEnd(10)}<span class="text-term-accent">${s.href}</span>`,
              ),
          ];
        case "resume":
        case "download":
          setTimeout(() => window.print(), 250);
          return ["opening print dialog — save as PDF…"];
        case "theme":
          return [setAccent(arg.toLowerCase() || "green")];
        case "banner":
          return [`<span class="text-term-accent">${BANNER.replace(/</g, "&lt;")}</span>`];
        case "games":
          return [
            "hidden games & toys:",
            "  <span class='text-term-accent'>snake</span>   the classic",
            "  <span class='text-term-accent'>matrix</span>  follow the white rabbit",
            "  <span class='text-term-accent'>guess</span>   number guessing game",
            "  <span class='text-term-accent'>coffee</span>  ☕",
          ];
        case "clear":
        case "cls":
          return "CLEAR";

        /* --------------------------- easter eggs -------------------------- */
        case "snake":
          setGame("snake");
          return ["launching snake… (Esc to quit)"];
        case "matrix":
          setGame("matrix");
          return ["wake up, Neo…"];
        case "guess": {
          const secret = Math.floor(Math.random() * 100) + 1;
          guessRef.current = { secret, tries: 0 };
          setMode("guess");
          return [
            "I'm thinking of a number between 1 and 100.",
            "type your guess (or <span class='text-term-accent'>q</span> to quit).",
          ];
        }
        case "sudo":
          return [
            `<span class="text-red-400">${profile.username} is not in the sudoers file. This incident will be reported.</span> 🚓`,
          ];
        case "rm":
          if (arg.includes("-rf") || arg.includes("/")) {
            return [
              "<span class='text-red-400'>nice try.</span> this résumé is immutable. 🛡️",
            ];
          }
          return [`rm: missing operand`];
        case "vim":
        case "vi":
          return ["you're trapped in vim forever now. (just kidding — :q)"];
        case "exit":
        case "logout":
          return ["there is no escape. you're hired. 😄"];
        case "coffee":
        case "☕":
          return [
            "      ( (",
            "       ) )",
            "    ........",
            "    |      |]",
            "    \\      /",
            "     `----'",
            "brewing… ☕ stay caffeinated.",
          ];
        case "date":
          return [new Date().toString()];
        case "echo":
          return [arg || ""];
        case "pwd":
          return [`/home/${profile.username}`];
        case "":
          return [];
        default:
          return [
            `command not found: <span class="text-red-400">${cmd}</span>. try <span class="text-term-accent">help</span>.`,
          ];
      }
    },
    [profile, socials, skills, projects, experience, education, email],
  );

  const runGuess = (raw: string): string[] => {
    const t = raw.trim().toLowerCase();
    if (t === "q" || t === "quit" || t === "exit") {
      setMode("shell");
      return [`the number was ${guessRef.current.secret}. back to shell.`];
    }
    const n = parseInt(t, 10);
    if (Number.isNaN(n)) return ["please enter a number (or q to quit)."];
    guessRef.current.tries++;
    const { secret, tries } = guessRef.current;
    if (n === secret) {
      setMode("shell");
      return [
        `<span class="text-term-accent">correct!</span> got it in ${tries} ${tries === 1 ? "try" : "tries"}. 🎉`,
      ];
    }
    return [n < secret ? "higher ↑" : "lower ↓"];
  };

  const submit = (raw: string) => {
    const prompt =
      mode === "guess"
        ? `<span class="text-term-accent">guess></span> `
        : `<span class="text-term-accent">${profile.username}@${profile.host}</span>:<span class="text-sky-400">~</span>$ `;
    print(`${prompt}${raw.replace(/</g, "&lt;")}`);

    if (raw.trim()) {
      historyRef.current.unshift(raw);
      histIdxRef.current = -1;
    }

    if (mode === "guess") {
      print(runGuess(raw));
      return;
    }
    const out = runShell(raw);
    if (out === "CLEAR") {
      setLines([]);
      return;
    }
    print(out);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = historyRef.current;
      if (h.length && histIdxRef.current < h.length - 1) {
        histIdxRef.current++;
        setInput(h[histIdxRef.current]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdxRef.current > 0) {
        histIdxRef.current--;
        setInput(historyRef.current[histIdxRef.current]);
      } else {
        histIdxRef.current = -1;
        setInput("");
      }
    }
  };

  return (
    <div className="no-print">
      {game === "snake" && <SnakeGame onExit={() => setGame(null)} />}
      {game === "matrix" && <MatrixRain onExit={() => setGame(null)} />}

      <div
        className="scanlines overflow-hidden rounded-lg border border-term-border bg-term-panel shadow-2xl shadow-black/40"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-term-border bg-black/30 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-xs text-term-dim">
            {profile.username}@{profile.host}: ~/play
          </span>
        </div>

        {/* Output */}
        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto px-4 py-3 text-xs leading-relaxed sm:text-sm"
        >
          {lines.map((line) => (
            <pre
              key={line.id}
              className="whitespace-pre-wrap break-words font-mono text-term-fg"
              dangerouslySetInnerHTML={{ __html: line.html }}
            />
          ))}

          {/* Prompt line */}
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 font-mono text-term-accent"
              dangerouslySetInnerHTML={{
                __html:
                  mode === "guess"
                    ? "guess&gt;"
                    : `${profile.username}@${profile.host}:<span class="text-sky-400">~</span>$`,
              }}
            />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              aria-label="terminal input"
              className="flex-1 bg-transparent font-mono text-term-fg caret-term-accent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
