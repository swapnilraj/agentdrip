import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeBanner } from "@/components/ThemeBanner";
import { findPackage } from "@/lib/find-style";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentDrip",
  description: "Design Skills for the AI Era",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const skin = cookieStore.get("drip-skin")?.value || "";

  let skinCss = "";
  if (skin) {
    const pkg = await findPackage(skin);
    if (pkg?.skinCss) skinCss = pkg.skinCss;
  }

  return (
    <html lang="en" className={inter.className} data-drip-skin={skin || undefined} suppressHydrationWarning>
      <head>
        {skinCss && <style id="drip-skin-css" dangerouslySetInnerHTML={{ __html: skinCss }} />}
        <style dangerouslySetInnerHTML={{ __html: `
          body { background-color: #0a0a0a; color: #f5f5f5; min-height: 100vh; }
        `}} />
      </head>
      <body className="bg-neutral-950 text-neutral-100 min-h-screen">
        <ThemeProvider>
          <Nav />
          <main data-drip="shell">{children}</main>
          <ThemeBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
