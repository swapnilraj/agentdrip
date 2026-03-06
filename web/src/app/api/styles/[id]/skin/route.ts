import { findPackage } from "@/lib/find-style";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const pkg = await findPackage(id);

  if (!pkg || !pkg.skinCss) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(pkg.skinCss, {
    headers: { "Content-Type": "text/css" },
  });
}
