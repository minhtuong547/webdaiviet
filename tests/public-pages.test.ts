import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { navigationConfig } from "../src/components/navigation/navigation.config";
import {
  mapPublicPlayersResult,
  mapPublicServerResult,
  publicReadStateText,
} from "../src/lib/api/public-community-data";
import type { IslePilotResult } from "../src/lib/api/islepilot-client";

test("public page mappers expose only the existing safe server and player fields", () => {
  const serverResult: IslePilotResult<unknown> = {
    ok: true,
    status: 200,
    requestId: "test-server",
    data: {
      name: "DAI VIET",
      playersOnline: 8,
      maxPlayers: 80,
      steamId: "76561198000000000",
      wallet: 9000,
    },
  };
  const playersResult: IslePilotResult<unknown> = {
    ok: true,
    status: 200,
    requestId: "test-players",
    data: {
      players: [
        {
          name: "Player",
          species: "Tyrannosaurus",
          online: true,
          discordId: "private",
          bans: ["private"],
        },
      ],
    },
  };

  assert.deepEqual(mapPublicServerResult(serverResult), {
    state: "LIVE_VERIFIED",
    data: { name: "DAI VIET", online: 8, maxPlayers: 80, lastSeenAt: null },
  });
  assert.deepEqual(mapPublicPlayersResult(playersResult), {
    state: "LIVE_VERIFIED",
    data: {
      count: 1,
      players: [{ name: "Player", species: "Tyrannosaurus", online: true }],
    },
  });
});

test("public page mappers preserve verified upstream failures without replacement data", () => {
  const result: IslePilotResult<unknown> = {
    ok: false,
    code: "MISSING_SCOPE",
    status: 403,
    requestId: "test-scope",
  };
  assert.deepEqual(mapPublicServerResult(result), {
    state: "MISSING_SCOPE",
    data: null,
  });
  assert.equal(publicReadStateText.MISSING_SCOPE, "API key thiếu quyền đọc");
});

test("navbar keeps standalone public pages out of primary navigation", () => {
  const enabled = [
    navigationConfig.home,
    ...navigationConfig.destinations,
  ].filter((destination) => destination.available);
  assert.deepEqual(
    enabled.map((destination) => [destination.id, destination.href]),
    [["home", "/"]],
  );
  for (const destination of navigationConfig.destinations.filter(
    (destination) => !destination.available,
  )) {
    assert.equal(destination.href, null, destination.id);
  }
  for (const menu of navigationConfig.menus) {
    for (const destination of menu.items)
      assert.equal(destination.available, false, destination.id);
  }
  assert.equal(navigationConfig.launcher.available, false);
  assert.equal(navigationConfig.launcher.href, null);
});

test("homepage uses only the existing safe IslePilot read mappers", () => {
  const page = readFileSync(
    new URL("../src/app/page.tsx", import.meta.url),
    "utf8",
  );
  const portal = readFileSync(
    new URL("../src/components/home/PortalHome.tsx", import.meta.url),
    "utf8",
  );
  assert.match(page, /getPublicCommunityData/);
  assert.match(page, /verifySession/);
  assert.match(page, /homeViewerFromSession/);
  assert.match(
    page,
    /return <PortalHome server=\{community\.server\} players=\{community\.players\} viewer=\{viewer\} \/>/,
  );
  assert.doesNotMatch(page, /getPlayer|steamId|wallet|discordId/i);
  assert.match(portal, /<ServerStatus server=\{server\} \/>/);
  assert.match(portal, /<CommunityRoster players=\{players\} \/>/);
  assert.match(portal, /isPlayer \? <DinoStatus \/> : null/);
  assert.match(portal, /Steam ID và dữ liệu cá nhân không được hiển thị/);
  assert.doesNotMatch(portal, /steamId|getPlayer|getPlayerGarage|getPlayerSkins|wallet/i);
});

test("homepage destinations are real routes or visibly disabled, never placeholder links", () => {
  const sources = [
    "../src/app/page.tsx",
    "../src/components/home/PortalHome.tsx",
    "../src/components/home/CommunityRoster.tsx",
    "../src/components/home/QuickAccess.tsx",
    "../src/components/layout/SiteFooter.tsx",
  ].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));
  for (const source of sources) assert.equal(source.includes('href="#"'), false);
  assert.match(sources[2], /href="\/nguoi-choi"/);
  assert.match(sources[4], /href="\/may-chu"/);
  assert.match(sources[4], /href="\/nguoi-choi"/);
  assert.match(sources[3], /aria-disabled="true"/);
});

test("player vitals remain unavailable without data and never contain design mock values", () => {
  const dino = readFileSync(
    new URL("../src/components/home/DinoStatus.tsx", import.meta.url),
    "utf8",
  );
  const progress = readFileSync(
    new URL("../src/components/ui/ProgressBar.tsx", import.meta.url),
    "utf8",
  );
  assert.match(dino, /dinoMetricLabels/);
  assert.match(dino, /metrics\[metric\]/);
  assert.doesNotMatch(dino, /72%|94%|68%|81%|76%/);
  assert.match(progress, /valid \? \(safeValue \/ max\) \* 100 : 0/);
  assert.match(progress, /Chưa có dữ liệu/);
});

test("server API read health is not presented as verified game-server runtime status", () => {
  const component = readFileSync(
    new URL("../src/components/home/ServerStatus.tsx", import.meta.url),
    "utf8",
  );
  assert.match(component, /API đã xác minh/);
  assert.match(component, /runtime của máy chủ không được giả định/);
  assert.doesNotMatch(component, /label=\{status === "online" \? "Live"/);
  assert.match(component, /hasCapacity && online !== null/);
});

test("donate ticker uses a neutral message, route configuration, and accessible pause control", () => {
  const ticker = readFileSync(
    new URL("../src/components/layout/DonateTicker.tsx", import.meta.url),
    "utf8",
  );
  const tickerStyles = readFileSync(
    new URL("../src/components/layout/DonateTicker.module.css", import.meta.url),
    "utf8",
  );
  assert.match(ticker, /Cảm ơn những người đang giữ lửa/);
  assert.match(ticker, /tickerRoutes/);
  assert.match(ticker, /aria-pressed=\{paused\}/);
  assert.match(ticker, /setPaused/);
  assert.match(tickerStyles, /prefers-reduced-motion/);
  assert.doesNotMatch(ticker, /đã donate|donated|ủng hộ \d/i);
});

test("shared design system has centralized tokens and reusable primitives", () => {
  const tokens = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");
  assert.match(tokens, /--dv-color-primary:\s*#ffbdbd/i);
  for (const name of ["Button", "Card", "Badge", "ProgressBar", "StatusIndicator", "Skeleton"]) {
    assert.equal(
      existsSync(new URL(`../src/components/ui/${name}.tsx`, import.meta.url)),
      true,
      name,
    );
  }
});

test("signature design lab routes remain private previews", () => {
  const navbarSource = readFileSync(
    new URL("../src/components/navigation/DaiVietNavbar.tsx", import.meta.url),
    "utf8",
  );
  const labSource = readFileSync(
    new URL("../src/components/design-lab/DesignLab.tsx", import.meta.url),
    "utf8",
  );
  assert.equal(navbarSource.includes("design-lab"), false);
  assert.equal(
    existsSync(
      new URL("../src/app/design-lab/lost-world/page.tsx", import.meta.url),
    ),
    true,
  );
  assert.equal(
    existsSync(
      new URL(
        "../src/app/design-lab/survival-archive/page.tsx",
        import.meta.url,
      ),
    ),
    true,
  );
  assert.equal(
    existsSync(
      new URL("../src/app/design-lab/the-island/page.tsx", import.meta.url),
    ),
    true,
  );
  assert.match(labSource, /data-design-lab/);
  assert.match(labSource, /dai-viet-forest-hero\.jpg/);
});
