"use client";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";

interface WearButtonProps {
  styleId: string;
  slug: string;
  name: string;
}

export function WearButton({ styleId, slug, name }: WearButtonProps) {
  const { activeSkin, wear, reset } = useTheme();
  const [loading, setLoading] = useState(false);
  const isActive = activeSkin?.slug === slug;

  async function handleClick() {
    if (isActive) {
      reset();
      return;
    }
    setLoading(true);
    try {
      await wear(styleId, slug, name);
    } catch (err) {
      console.error("Failed to wear skin:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      data-drip="button"
      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-green-600 hover:bg-green-500 text-white"
          : "bg-purple-600 hover:bg-purple-500 text-white"
      } disabled:opacity-50`}
    >
      {loading ? "Loading..." : isActive ? "Wearing" : "Wear This Style"}
    </button>
  );
}
