"use client";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";

interface WearButtonProps {
  styleId: string;
  slug: string;
  name: string;
  variant?: "default" | "hero";
}

export function WearButton({ styleId, slug, name, variant = "default" }: WearButtonProps) {
  const { activeSkin, wear, reset } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const isActive = activeSkin?.slug === slug;

  // Pulse animation on mount to draw attention (only for hero variant)
  useEffect(() => {
    if (variant === "hero" && !isActive) {
      const timer = setTimeout(() => setShowPulse(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [variant, isActive]);

  async function handleClick() {
    if (isActive) {
      reset();
      return;
    }
    setLoading(true);
    setShowPulse(false);
    try {
      await wear(styleId, slug, name);
    } catch (err) {
      console.error("Failed to wear skin:", err);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "hero") {
    return (
      <div className="relative inline-flex flex-col items-center gap-2">
        {/* Pulsing ring behind button */}
        {showPulse && !isActive && (
          <span className="absolute inset-0 rounded-xl bg-purple-500/20 animate-ping" style={{ animationDuration: "2s" }} />
        )}
        <button
          onClick={handleClick}
          disabled={loading}
          data-drip="button"
          className={`relative z-10 px-8 py-4 rounded-xl text-base font-semibold transition-all ${
            isActive
              ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/25"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40 hover:scale-105"
          } disabled:opacity-50`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Applying...
            </span>
          ) : isActive ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Wearing — Click to Remove
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Wear This Style
            </span>
          )}
        </button>
        {!isActive && (
          <span className="text-xs text-neutral-500">Transform this entire site with one click</span>
        )}
      </div>
    );
  }

  // Default compact variant (for card overlays etc.)
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      data-drip="button"
      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-green-600 hover:bg-green-500 text-white"
          : "bg-purple-600 hover:bg-purple-500 text-white hover:scale-105"
      } disabled:opacity-50`}
    >
      {loading ? "Applying..." : isActive ? "Wearing ✓" : "Wear This Style"}
    </button>
  );
}
