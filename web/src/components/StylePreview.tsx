"use client";

export function StylePreview({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <iframe
      srcDoc={html}
      sandbox="allow-scripts"
      className={className}
      style={{ border: "none" }}
    />
  );
}
