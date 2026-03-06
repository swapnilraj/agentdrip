"use client";
import { useTheme } from "./ThemeProvider";

export function ThemeBanner() {
  const { activeSkin, reset } = useTheme();
  if (!activeSkin) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-700 px-4 py-2 flex items-center justify-between text-sm">
      <span className="text-neutral-300">
        Wearing: <strong className="text-white">{activeSkin.name}</strong>
      </span>
      <button
        onClick={reset}
        className="text-neutral-400 hover:text-white transition-colors text-xs px-3 py-1 rounded border border-neutral-700 hover:border-neutral-500"
      >
        Reset
      </button>
    </div>
  );
}
