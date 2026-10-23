import test from "node:test";
import assert from "node:assert/strict";
import { hasValidSessionSecret, signSession, verifySession } from "../src/lib/security/steam-session";
import { homeViewerFromSession } from "../src/lib/security/home-viewer";

test("session cookie signature verifies and rejects tampering",()=>{
  process.env.SESSION_SECRET="test-secret-that-is-at-least-thirty-two-characters-long";
  const value=signSession({steamId:"76561198000000000",expiresAt:Date.now()+60_000});
  assert.equal(verifySession(value)?.steamId,"76561198000000000");
  assert.equal(verifySession(`${value}x`),null);
});

test("expired session is rejected",()=>{
  process.env.SESSION_SECRET="test-secret-that-is-at-least-thirty-two-characters-long";
  const value=signSession({steamId:"76561198000000000",expiresAt:1000});
  assert.equal(verifySession(value,1001),null);
});

test("the auth configuration predicate requires a sufficiently long secret",()=>{
  assert.equal(hasValidSessionSecret("short"),false);
  assert.equal(hasValidSessionSecret("a".repeat(31)),false);
  assert.equal(hasValidSessionSecret("a".repeat(32)),true);
});

test("home player mode requires both a verified session and enabled Steam auth",()=>{
  const session={steamId:"76561198000000000",expiresAt:Date.now()+60_000};
  assert.deepEqual(homeViewerFromSession(null,true),{mode:"guest"});
  assert.deepEqual(homeViewerFromSession(session,false),{mode:"guest"});
  assert.deepEqual(homeViewerFromSession(session,true),{mode:"player"});
});
