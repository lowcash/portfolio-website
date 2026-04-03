/**
 * CSS Module Type Declarations
 * Allows TypeScript to recognize CSS imports in Next.js
 */

declare module '*.css' {
  const content: Record<string, string>
  export default content
}
