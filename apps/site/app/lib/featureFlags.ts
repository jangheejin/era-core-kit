//apps/site/src/lib/featureFlags.ts
function parseEnvFlag(raw: string | undefined, defaultValue: boolean) {
  const v = raw?.trim().toLowerCase();
  if (!v) return { ok: true as const, value: defaultValue };

  if (["1", "true", "yes", "y", "on"].includes(v)) return { ok: true as const, value: true };
  if (["0", "false", "no", "n", "off"].includes(v)) return { ok: true as const, value: false };

  return { ok: false as const, value: defaultValue, raw };
}

const defaultValue = false;
const raw = process.env.NEXT_PUBLIC_SHOW_OUTCOMES;
const parsed = parseEnvFlag(raw, defaultValue);

if (!parsed.ok) {
  const msg =
    `[env] NEXT_PUBLIC_SHOW_OUTCOMES="${raw}" is invalid. ` +
    `Use 1/0 or true/false (or omit it).`;

  if (process.env.NODE_ENV !== "production") throw new Error(msg);
  console.warn(msg);
}

export const showAdvanced = parsed.value;
