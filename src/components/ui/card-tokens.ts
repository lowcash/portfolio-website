/** Shared card shell + 5-tier typography scale. */

export const CARD_SHELL_CLASS = 'rounded-2xl p-6 transition-all duration-500 sm:p-8'

/** Card titles. */
export const CARD_TITLE_CLASS = 'text-sm font-semibold text-balance text-zinc-100 sm:text-base'

/** Body copy & bullet lists. */
export const CARD_BODY_CLASS = 'text-pretty text-sm font-normal leading-relaxed text-zinc-300'

/** Mono sub-labels (column headers, etc.). */
export const CARD_MONO_LABEL_CLASS = 'font-mono text-xs tracking-wider text-zinc-400 uppercase'

/** Status / timeline badges — same geometry as tech pills; muted tone. */
export const CARD_BADGE_CLASS =
  'inline-flex shrink-0 items-center whitespace-nowrap rounded-md border border-zinc-700/40 bg-zinc-800/60 px-2.5 py-1 font-mono text-xs text-zinc-400'

/** Tech pills — same geometry as status badges; brighter tone. */
export const CARD_TECH_PILL_CLASS =
  'inline-flex items-center rounded-md border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-1 font-mono text-xs text-zinc-200'
