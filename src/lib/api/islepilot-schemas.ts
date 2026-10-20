import { z } from "zod";
export const serverSnapshotSchema=z.object({name:z.string().optional(),status:z.string().optional(),online:z.number().int().nonnegative().optional(),players:z.number().int().nonnegative().optional(),maxPlayers:z.number().int().positive().optional(),playersOnline:z.number().int().nonnegative().optional(),lastPlayerCount:z.number().int().nonnegative().optional(),lastSeenAt:z.string().datetime().optional()}).passthrough();
export const leaderboardSchema=z.object({leaderboard:z.array(z.record(z.string(),z.unknown())).optional(),players:z.array(z.record(z.string(),z.unknown())).optional()}).passthrough();
export function parseServerSnapshot(value:unknown){return serverSnapshotSchema.safeParse(value);}
export function publicServerSnapshot(value:unknown){const parsed=serverSnapshotSchema.safeParse(value);if(!parsed.success)return null;const item=parsed.data;return {name:item.name??null,online:item.playersOnline??item.online??item.players??item.lastPlayerCount??null,maxPlayers:item.maxPlayers??null,lastSeenAt:item.lastSeenAt??null};}
export function publicPlayersSummary(value:unknown){
  const records=Array.isArray(value)?value:value&&typeof value==="object"?(value as {players?:unknown;data?:unknown}).players??(value as {data?:unknown}).data:undefined;
  if(!Array.isArray(records))return null;
  const players=records.map((record)=>{
    if(!record||typeof record!=="object")return null;
    const player=record as {name?:unknown;species?:unknown;online?:unknown};
    if(player.online!==true)return null;
    return {
      name:typeof player.name==="string"?player.name.slice(0,80):null,
      species:typeof player.species==="string"?player.species.slice(0,60):null,
      online:true as const,
    };
  }).filter((player):player is {name:string|null;species:string|null;online:true}=>player!==null);
  return {count:players.length,players};
}
