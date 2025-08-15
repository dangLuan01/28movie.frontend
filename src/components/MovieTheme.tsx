import { Suspense, lazy } from "react";

const MovieThemeInner = lazy(() => import("./MovieThemeInner.tsx"));

export default function MovieTheme() {
  return (
    <Suspense fallback={<div>Loading theme…</div>}>
      <MovieThemeInner />
    </Suspense>
  );
}
