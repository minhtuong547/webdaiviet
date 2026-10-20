import test from "node:test";
import assert from "node:assert/strict";
import { parseServerSnapshot, publicPlayersSummary, publicServerSnapshot } from "../src/lib/api/islepilot-schemas";

test("server response schema accepts actual-shaped server data without inventing fields",()=>{
  const result=parseServerSnapshot({name:"Dai Viet",status:"online",online:12,maxPlayers:100,extra:"preserved"});
  assert.equal(result.success,true);
});

test("server response schema rejects invalid player counts",()=>{
  assert.equal(parseServerSnapshot({online:-4}).success,false);
});

test("public server snapshot only emits approved fields",()=>{
  const safe=publicServerSnapshot({name:"DAI VIET",playersOnline:7,maxPlayers:80,steamId:"76561198000000000",discordId:"secret",wallet:9000,bans:["private"]});
  assert.deepEqual(safe,{name:"DAI VIET",online:7,maxPlayers:80,lastSeenAt:null});
  assert.equal(JSON.stringify(safe).includes("76561198000000000"),false);
  assert.equal(JSON.stringify(safe).includes("secret"),false);
});

test("public players summary emits only approved online-list fields",()=>{
  const safe=publicPlayersSummary({players:[{steamId:"76561198000000000",discordId:"secret",wallet:9000,bans:["private"],name:"Player",species:"Tyrannosaurus",online:true}]});
  assert.deepEqual(safe,{count:1,players:[{name:"Player",species:"Tyrannosaurus",online:true}]});
  assert.equal(JSON.stringify(safe).includes("76561198000000000"),false);
  assert.equal(JSON.stringify(safe).includes("wallet"),false);
  assert.deepEqual(publicPlayersSummary([{steamId:"private"}]),{count:0,players:[]});
  assert.equal(publicPlayersSummary({unexpected:true}),null);
});

test("no write endpoints are registered in the read-only client registry",async()=>{
  const {officialReadEndpoints}=await import("../src/lib/api/islepilot-endpoints");
  for(const path of Object.values(officialReadEndpoints)) assert.equal(/\/(?:apply|buy|sell|park|restore|execute|claim|open|cancel|create|accept|decline|spin|play)(?:\/|$)/i.test(path),false,path);
});
