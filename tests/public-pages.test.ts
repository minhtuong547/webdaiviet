import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { navigationConfig } from "../src/components/navigation/navigation.config";
import { mapPublicPlayersResult, mapPublicServerResult, publicReadStateText } from "../src/lib/api/public-community-data";
import type { IslePilotResult } from "../src/lib/api/islepilot-client";

test("public page mappers expose only the existing safe server and player fields", () => {
  const serverResult: IslePilotResult<unknown> = {
    ok: true,
    status: 200,
    requestId: "test-server",
    data: { name: "DAI VIET", playersOnline: 8, maxPlayers: 80, steamId: "76561198000000000", wallet: 9000 },
  };
  const playersResult: IslePilotResult<unknown> = {
    ok: true,
    status: 200,
    requestId: "test-players",
    data: { players: [{ name: "Player", species: "Tyrannosaurus", online: true, discordId: "private", bans: ["private"] }] },
  };

  assert.deepEqual(mapPublicServerResult(serverResult), {
    state: "LIVE_VERIFIED",
    data: { name: "DAI VIET", online: 8, maxPlayers: 80, lastSeenAt: null },
  });
  assert.deepEqual(mapPublicPlayersResult(playersResult), {
    state: "LIVE_VERIFIED",
    data: { count: 1, players: [{ name: "Player", species: "Tyrannosaurus", online: true }] },
  });
});

test("public page mappers preserve verified upstream failures without replacement data", () => {
  const result: IslePilotResult<unknown> = { ok: false, code: "MISSING_SCOPE", status: 403, requestId: "test-scope" };
  assert.deepEqual(mapPublicServerResult(result), { state: "MISSING_SCOPE", data: null });
  assert.equal(publicReadStateText.MISSING_SCOPE, "API key thiếu quyền đọc");
});

test("navbar keeps standalone public pages out of primary navigation", () => {
  const enabled = [navigationConfig.home, ...navigationConfig.destinations].filter((destination) => destination.available);
  assert.deepEqual(enabled.map((destination) => [destination.id, destination.href]), [
    ["home", "/"],
  ]);
  for (const destination of navigationConfig.destinations.filter((destination) => !destination.available)) {
    assert.equal(destination.href, null, destination.id);
  }
  for (const menu of navigationConfig.menus) {
    for (const destination of menu.items) assert.equal(destination.available, false, destination.id);
  }
  assert.equal(navigationConfig.launcher.available, false);
  assert.equal(navigationConfig.launcher.href, null);
});

test("home page contains no placeholder href links", () => {
  const source = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  assert.equal(source.includes('href="#"'), false);
});

test("homepage keeps the cinematic background, live data, and unavailable actions honest", () => {
  const source = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  const heroStyles = readFileSync(new URL("../src/components/home/HomePage.module.css", import.meta.url), "utf8");
  const showcaseSource = readFileSync(new URL("../src/components/home/EcosystemShowcase.tsx", import.meta.url), "utf8");
  assert.match(source, /dai-viet-forest-hero\.jpg/);
  assert.equal(source.includes("dai-viet-survival-scene.svg"), false);
  assert.match(source, /disabled title="Launcher chưa được cấu hình URL tải"/);
  assert.match(source, /disabled title="Steam authentication chưa được xác minh"/);
  assert.match(source, /disabled title="Discord chưa được cấu hình URL chính thức"/);
  assert.match(source, /PLAYERS ONLINE/);
  assert.match(source, /MAX SLOTS/);
  assert.match(source, /maxSlots !== null/);
  assert.match(source, /homeFeatures\.slice\(0, 6\)/);
  assert.match(source, /homeFeatures\.slice\(6\)/);
  assert.match(source, /publicReadStateText\[server\.state\]/);
  assert.match(source, /serverUnavailable/);
  assert.match(source, /EcosystemShowcase/);
  assert.match(heroStyles, /min-height:\s*clamp\(620px/);
  assert.match(heroStyles, /grid-template-columns:\s*repeat\(12/);
  assert.match(heroStyles, /featureGarageDino/);
  assert.match(heroStyles, /serverValuePending/);
  assert.match(showcaseSource, /useState/);
  assert.match(showcaseSource, /role="tablist"/);
  assert.equal(showcaseSource.includes("href="), false);
  assert.equal(heroStyles.includes("dai-viet-survival-scene.svg"), false);
  assert.equal(source.includes("SỨC CHỨA HIỆN TẠI"), false);
});
