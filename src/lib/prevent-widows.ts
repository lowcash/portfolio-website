const CONNECTORS = 'I|a|an|the|and|or|nor|but|for|of|with|in|on|at|by|to|as|is|via|into|&|\\+'

/** Bind short connectors, dates, and compound terms so copy wraps cleanly. */
export function formatTypography(str: string): string {
  if (!str) return str

  return (
    str
      // 1. Date ranges: keep (2017 – 2020) intact and glued to the prior word
      .replace(/\((\d{4})\s*[–\u2014-]\s*(\d{4})\)/g, '($1\u00A0\u2013\u00A0$2)')
      .replace(/(\S+)\s+(\(\d{4}\u00A0\u2013\u00A0\d{4}\))/g, '$1\u00A0$2')
      // Keep "& Augmented Reality (years)" / "& Game Development (years)" on one row
      .replace(
        /&\s+Augmented\s+Reality\s+(\(\d{4}\u00A0\u2013\u00A0\d{4}\))/gi,
        '&\u00A0Augmented\u00A0Reality\u00A0$1',
      )
      .replace(
        /&\s+Game\s+Development\s+(\(\d{4}\u00A0\u2013\u00A0\d{4}\))/gi,
        '&\u00A0Game\u00A0Development\u00A0$1',
      )
      // 2. Short connectors/prepositions (incl. runs like "for a") must not end a line
      .replace(
        new RegExp(`(^|\\s)((?:(?:${CONNECTORS})\\s+)+)`, 'gi'),
        (_, lead: string, chunk: string) =>
          `${lead}${chunk.trimEnd().replace(/\s+/g, '\u00A0')}\u00A0`,
      )
      // 3. Technical compound words (non-breaking hyphens)
      .replace(/\bwalk-forward\b/gi, (match) => match.replace('-', '\u2011'))
      .replace(/\btime-series\b/gi, (match) => match.replace('-', '\u2011'))
      .replace(/\bevent-driven\b/gi, (match) => match.replace('-', '\u2011'))
      .replace(/\blow-latency\b/gi, (match) => match.replace('-', '\u2011'))
      .replace(/\bhigh-throughput\b/gi, (match) => match.replace('-', '\u2011'))
      .replace(/\brole-based\b/gi, (match) => match.replace('-', '\u2011'))
      .replace(/\bmulti-user\b/gi, (match) => match.replace('-', '\u2011'))
      .replace(/\bmulti-device\b/gi, (match) => match.replace('-', '\u2011'))
      .replace(/\bpart-time\b/gi, (match) => match.replace('-', '\u2011'))
      .replace(/\bfull-stack\b/gi, (match) => match.replace('-', '\u2011'))
      .replace(/\bLucas-Kanade\b/g, 'Lucas\u2011Kanade')
      .replace(/\bservice-layer\b/gi, (match) => match.replace('-', '\u2011'))
      // 4. Glued multi-word collocations & DJ anchor
      .replace(/\bfee\s+structures\b/gi, 'fee\u00A0structures')
      .replace(/\bas\s+Lowcash\b/gi, 'as\u00A0Lowcash')
      .replace(/\bdrum\s+&\s+bass\b/gi, 'drum\u00A0&\u00A0bass')
      .replace(/\bInteractive\s+Dev\s+Console\b/gi, 'Interactive\u00A0Dev\u00A0Console')
  )
}

/** @deprecated Prefer `formatTypography`. */
export const preventWidows = formatTypography
