"use client";

import { PublicPageError } from "@/components/public/PublicPageFallback";

export default function ServerError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PublicPageError title="Tình trạng trên đảo." reset={reset} />;
}
