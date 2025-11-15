# How to Toggle "Available for Projects" Badge

## To Hide the Badge:

Open `/App.tsx` and comment out this line:

```tsx
export default function App() {
  return (
    <div className="bg-black text-white scroll-smooth overflow-x-hidden">
      <ScrollProgress />
      {/* <AvailabilityBadge /> */}  // <-- Comment this out
      <Hero />
      ...
```

## To Show the Badge:

Uncomment the line:

```tsx
<AvailabilityBadge />
```

## To Change the Text:

Edit `/components/AvailabilityBadge.tsx` and change:

```tsx
<span className="text-sm text-gray-200">Available (ML priority)</span>
```

To whatever you want, like:
- "Currently busy"
- "Booking 2026"
- "Available for select projects"
- etc.

## To Change Color (e.g., to red when busy):

In `/components/AvailabilityBadge.tsx`, replace green with red:

```tsx
// Change from:
border border-green-500/50
bg-green-400

// To:
border border-red-500/50
bg-red-400
```

---

**Pro tip:** Keep it simple - just comment/uncomment the line in App.tsx!
