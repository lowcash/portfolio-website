/** Mutable holder for the latest unlock function, so trigger effects never re-subscribe when it changes. */
export type UnlockRef = { current: (id: string) => void }
