export type HomeViewer =
  | { mode: "guest" }
  | { mode: "player" };

type VerifiedSession = {
  steamId: string;
  expiresAt: number;
};

/**
 * This pure gate is invoked from a server component after the signed cookie is
 * verified. Its Steam ID must never cross into the public home UI.
 */
export function homeViewerFromSession(
  session: VerifiedSession | null,
  steamAuthEnabled = process.env.STEAM_AUTH_ENABLED === "true",
): HomeViewer {
  return session && steamAuthEnabled ? { mode: "player" } : { mode: "guest" };
}
