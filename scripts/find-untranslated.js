/**
 * Finds probable user-facing English copy left behind in folders that have
 * already been translated.
 *
 * Why this exists: converting a screen by hand-grepping for `<Text` and
 * `Alert.alert` misses whole categories — most notably strings passed to state
 * setters (`setLocationError('...')`), which render later and look nothing like
 * copy at the call site. One shipped to a user that way. This sweeps every
 * string literal AND every JSX text node instead of guessing patterns.
 *
 * Usage:
 *   node scripts/find-untranslated.js src/presentation/driver src/shared/components
 *
 * Heuristic by design: it errs toward false positives (className strings, format
 * masks). Read each hit and decide; don't silence it by narrowing the regex.
 * Known-unconverted folders and dead code will light it up — that's expected.
 */
const fs = require("fs");
const path = require("path");

const ROOTS = process.argv.slice(2);

if (ROOTS.length === 0) {
  console.error("Usage: node scripts/find-untranslated.js <dir> [dir...]");
  process.exit(2);
}

// Lines that legitimately contain English literals.
const IGNORE_LINE =
  /(^\s*(\/\/|\*|\/\*))|console\.(log|warn|error)|logger\.(info|warn|error)|^\s*import |require\(|from ["']|\.svg|\.png|\.jpg|test\(|describe\(|expect\(|StyleSheet|className=|style=|accessibilityRole|keyboardType|autoCapitalize|returnKeyType|animationType|resizeMode|behavior=|mediaType|placeholderTextColor/;

// Values that are data/contract, not copy.
const IGNORE_VALUE =
  /^(image\/|application\/|file:|content:|https?:|\/|#[0-9a-fA-F]{3,8}$)|^[A-Z0-9_]+$|^(en|fr)$/;

const findings = [];

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(entry.name) && !/\.d\.ts$/.test(entry.name)) scan(p);
  }
};

const scan = (file) => {
  const rel = file.replace(process.cwd() + path.sep, "");
  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (IGNORE_LINE.test(line)) return;

      // JSX text nodes: >Some visible text<  — not quoted, so the literal scan
      // below cannot see them.
      for (const raw of line.match(/>\s*([A-Za-z][^<>{}"']{3,120})\s*</g) ?? []) {
        const value = raw.slice(1, -1).trim();
        if (!/[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(value)) continue;
        findings.push(`${rel}:${i + 1}  [jsx] ${value}`);
      }

      // Quoted literals that read like prose.
      for (const lit of line.match(/(["'])((?:(?!\1).){4,120})\1/g) ?? []) {
        const value = lit.slice(1, -1);
        if (IGNORE_VALUE.test(value)) continue;
        if (!/[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(value)) continue;
        if (/^[a-z][a-zA-Z]*(\.[a-zA-Z_]+)+$/.test(value)) continue; // already a key
        findings.push(`${rel}:${i + 1}  ${value}`);
      }
    });
};

ROOTS.forEach((r) => walk(r));

if (findings.length === 0) {
  console.log("CLEAN — no probable untranslated copy found.");
} else {
  console.log(`${findings.length} probable untranslated string(s):\n`);
  findings.forEach((f) => console.log("  " + f));
}
