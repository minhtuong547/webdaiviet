import test from "node:test";
import assert from "node:assert/strict";
import { signSession, verifySession } from "../src/lib/security/steam-session";

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
