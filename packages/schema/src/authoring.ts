//packages/schema/src/authoring.ts

// makes “Write-up” section not feel like markdown (and keep line breaks)
// (helper that converts plain textarea text into “markdown that preserves line breaks”)

export function plainTextToMdxPreservingLineBreaks(input: string): string {
  const s = (input ?? "").replace(/\r\n/g, "\n").trim();
  if (!s) return "";

  // Convert single newlines into markdown hard line breaks ("  \n")
  // Preserve blank lines (paragraph breaks) as-is.
  const lines = s.split("\n");

  let out = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const next = i < lines.length - 1 ? (lines[i + 1] ?? "") : null;

    out += line;

    if (next === null) break;

    const isBlank = line.trim() === "";
    const nextIsBlank = next.trim() === "";

    if (isBlank) {
      out += "\n";          // keep blank line
    } else if (nextIsBlank) {
      out += "\n";          // paragraph break
    } else {
      out += "  \n";        // hard line break
    }
  }

  return out;
}

export function deriveSummaryFromWriteUp(writeUp: string, max = 180): string {
  const s = (writeUp ?? "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length <= max ? s : s.slice(0, max - 1) + "…";
}
