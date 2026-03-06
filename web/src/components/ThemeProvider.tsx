"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface ThemeContextValue {
  activeSkin: { id: string; slug: string; name: string } | null;
  wear: (id: string, slug: string, name: string) => Promise<void>;
  reset: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  activeSkin: null,
  wear: async () => {},
  reset: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeSkin, setActiveSkin] = useState<{ id: string; slug: string; name: string } | null>(null);

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem("drip-skin");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveSkin(parsed);
        // If server already rendered the skin CSS, no need to re-fetch
        const existingStyle = document.getElementById("drip-skin-css");
        if (existingStyle?.innerHTML) {
          document.documentElement.dataset.dripSkin = parsed.slug;
          return;
        }
        fetch(`/api/styles/${parsed.id}/skin`)
          .then(r => r.ok ? r.text() : null)
          .then(css => {
            if (css) injectCss(css);
            document.documentElement.dataset.dripSkin = parsed.slug;
          });
      } catch {}
      return;
    }
    // Check if server rendered a skin via cookie (no localStorage yet)
    const serverSkin = document.documentElement.dataset.dripSkin;
    if (serverSkin) {
      // Server has a skin active, preserve it and sync to localStorage
      const existingStyle = document.getElementById("drip-skin-css");
      if (existingStyle) {
        const skinData = { id: serverSkin, slug: serverSkin, name: serverSkin };
        localStorage.setItem("drip-skin", JSON.stringify(skinData));
        setActiveSkin(skinData);
      }
    }
  }, []);

  const wear = useCallback(async (id: string, slug: string, name: string) => {
    const res = await fetch(`/api/styles/${id}/skin`);
    if (!res.ok) throw new Error("Failed to fetch skin");
    const css = await res.text();

    injectCss(css);
    document.documentElement.dataset.dripSkin = slug;

    const skinData = { id, slug, name };
    localStorage.setItem("drip-skin", JSON.stringify(skinData));
    document.cookie = `drip-skin=${slug}; path=/; max-age=${60 * 60 * 24 * 365}`;

    setActiveSkin(skinData);
  }, []);

  const reset = useCallback(() => {
    const el = document.getElementById("drip-skin-css");
    if (el) el.remove();
    delete document.documentElement.dataset.dripSkin;
    localStorage.removeItem("drip-skin");
    document.cookie = "drip-skin=; path=/; max-age=0";
    setActiveSkin(null);
  }, []);

  return (
    <ThemeContext.Provider value={{ activeSkin, wear, reset }}>
      {children}
    </ThemeContext.Provider>
  );
}

function injectCss(css: string) {
  let el = document.getElementById("drip-skin-css");
  if (!el) {
    el = document.createElement("style");
    el.id = "drip-skin-css";
    document.head.appendChild(el);
  }
  el.textContent = css;
}
