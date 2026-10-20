"use client";

import { PublicPageError } from "@/components/public/PublicPageFallback";

export default function PlayersError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PublicPageError title="Những người trên đảo." reset={reset} />;
}
