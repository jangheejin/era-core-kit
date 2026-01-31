//apps/site/app/admin/components/MiniFormatBar.tsx
"use client";

import * as React from "react";

type Props = {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onValueChange: (next: string) => void;

  /** Optional: show/hide specific buttons */
  show?: {
    bold?: boolean;
    italic?: boolean;
    link?: boolean;
    bullets?: boolean;
    h2?: boolean;
  };
};

const DEFAULT_SHOW = {
  bold: true,
  italic: true,
  link: true,
  bullets: true,
  h2: false,
};

export function MiniFormatBar({
  textareaRef,
  value,
  onValueChange,
  show,
}: Props) {
  const flags = { ...DEFAULT_SHOW, ...(show ?? {}) };

  function withTextarea(fn: (ta: HTMLTextAreaElement) => void) {
    const ta = textareaRef.current;
    if (!ta) return;
    fn(ta);
  }

  function commit(next: string, selStart: number, selEnd: number) {
    onValueChange(next);
    // Let React re-render, then restore focus + selection.
    requestAnimationFrame(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(selStart, selEnd);
    });
  }

  function getSel(ta: HTMLTextAreaElement) {
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    return { start, end, text: value.slice(start, end) };
  }

  function wrap(left: string, right = left) {
    withTextarea((ta) => {
      const { start, end, text } = getSel(ta);

      // Toggle: if selection is already wrapped, unwrap it.
      const before = value.slice(0, start);
      const after = value.slice(end);

      const hasLeft = before.endsWith(left);
      const hasRight = after.startsWith(right);

      if (text.length > 0 && hasLeft && hasRight) {
        const next =
          before.slice(0, before.length - left.length) +
          text +
          after.slice(right.length);
        const nextStart = start - left.length;
        const nextEnd = end - left.length;
        commit(next, nextStart, nextEnd);
        return;
      }

      // If empty selection: insert wrapper and put cursor inside.
      if (text.length === 0) {
        const next = value.slice(0, start) + left + right + value.slice(end);
        const cursor = start + left.length;
        commit(next, cursor, cursor);
        return;
      }

      // Normal wrap
      const next = before + left + text + right + after;
      const nextStart = start + left.length;
      const nextEnd = end + left.length;
      commit(next, nextStart, nextEnd);
    });
  }

  function insertLink() {
    withTextarea((ta) => {
      const { start, end, text } = getSel(ta);
      const url = window.prompt("Link URL (https://...)", "https://");
      if (!url) return;

      const linkText = text.length > 0 ? text : "link text";
      const insert = `[${linkText}](${url})`;

      const next = value.slice(0, start) + insert + value.slice(end);

      // Select the link text if they had no selection; otherwise keep cursor after.
      if (text.length === 0) {
        const selStart = start + 1;
        const selEnd = start + 1 + linkText.length;
        commit(next, selStart, selEnd);
      } else {
        const cursor = start + insert.length;
        commit(next, cursor, cursor);
      }
    });
  }

  function toggleBullets() {
    withTextarea((ta) => {
      const { start, end } = getSel(ta);

      // Expand selection to full lines
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const lineEndIdx = value.indexOf("\n", end);
      const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;

      const block = value.slice(lineStart, lineEnd);
      const lines = block.split("\n");

      const allBulleted = lines.every(
        (ln) => ln.trim() === "" || ln.trimStart().startsWith("- "),
      );
      const nextLines = lines.map((ln) => {
        if (ln.trim() === "") return ln;
        if (allBulleted) {
          // remove one "- " after leading whitespace
          return ln.replace(/^(\s*)-\s+/, "$1");
          //const m = ln.match(/^(\s*)-\s+/);
          //return m ? ln.slice(m[0].length - m[1].length) : ln;
        }
        // add "- " after leading whitespace
        const indent = ln.match(/^(\s*)/)?.[0] ?? "";
        return indent + "- " + ln.slice(indent.length);
      });

      const nextBlock = nextLines.join("\n");
      const next = value.slice(0, lineStart) + nextBlock + value.slice(lineEnd);

      // Keep selection covering the same line block
      commit(next, lineStart, lineStart + nextBlock.length);
    });
  }

  function prefixHeading(prefix: string) {
    withTextarea((ta) => {
      const { start, end } = getSel(ta);
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const lineEndIdx = value.indexOf("\n", end);
      const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;

      const line = value.slice(lineStart, lineEnd);

      const has = line.startsWith(prefix);
      const nextLine = has ? line.slice(prefix.length) : prefix + line;
      const next = value.slice(0, lineStart) + nextLine + value.slice(lineEnd);

      // Keep cursor position roughly stable
      const delta = has ? -prefix.length : prefix.length;
      const nextStart = Math.max(lineStart, start + delta);
      const nextEnd = Math.max(lineStart, end + delta);
      commit(next, nextStart, nextEnd);
    });
  }

  return (
    <div className="mini-formatbar" role="toolbar" aria-label="Formatting">
      {flags.bold && (
        <button
          type="button"
          className="mini-formatbar__btn"
          onClick={() => wrap("**")}
        >
          Bold
        </button>
      )}
      {flags.italic && (
        <button
          type="button"
          className="mini-formatbar__btn"
          onClick={() => wrap("_")}
        >
          Italic
        </button>
      )}
      {flags.link && (
        <button
          type="button"
          className="mini-formatbar__btn"
          onClick={insertLink}
        >
          Link
        </button>
      )}
      {flags.bullets && (
        <button
          type="button"
          className="mini-formatbar__btn"
          onClick={toggleBullets}
        >
          Bullets
        </button>
      )}
      {flags.h2 && (
        <button
          type="button"
          className="mini-formatbar__btn"
          onClick={() => prefixHeading("## ")}
        >
          H2
        </button>
      )}
    </div>
  );
}
