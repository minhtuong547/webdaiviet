import { islepilotGet, type IslePilotResult } from "./islepilot-client";

export const officialReadEndpoints = {
  server:"/server", players:"/players", leaderboard:"/leaderboard", bans:"/bans", shopDinos:"/shop/dinos", shopSkins:"/shop/skins", teleportLocations:"/teleport/locations", bounties:"/bounties", killfeed:"/killfeed", combatLog:"/combat-log", events:"/events", creators:"/creators", whitelist:"/whitelist", diets:"/diets", casino:"/casino", pvp:"/pvp", bets:"/bets", crashes:"/crashes", outcasts:"/outcasts", chatLogs:"/chat-logs", giveaways:"/giveaways", announcements:"/announcements", spawnZones:"/spawn-zones", cases:"/cases", customCommands:"/custom-commands", nodes:"/nodes", discordLinks:"/discord-links", customEvents:"/custom-events", pages:"/pages", mapObjects:"/map-objects", growthOverrides:"/growth-overrides", playerPowers:"/player-powers", sellRules:"/sell-rules", scheduledRewards:"/scheduled-rewards", friends:"/friends", tickets:"/tickets", ticketCategories:"/tickets/categories"
} as const;
function playerPath(steamId:string,suffix="") { if(!/^\d{5,25}$/.test(steamId))throw new Error("Invalid Steam identifier"); return `/players/${steamId}${suffix}`; }
export const getServer=()=>islepilotGet(officialReadEndpoints.server);
export const getPlayers=()=>islepilotGet(officialReadEndpoints.players);
export const getLeaderboard=()=>islepilotGet(officialReadEndpoints.leaderboard);
export const getEvents=()=>islepilotGet(officialReadEndpoints.events);
export const getKillfeed=()=>islepilotGet(officialReadEndpoints.killfeed);
export const getDiets=()=>islepilotGet(officialReadEndpoints.diets);
export const getSpawnZones=()=>islepilotGet(officialReadEndpoints.spawnZones);
export const getPlayer=(steamId:string)=>islepilotGet(playerPath(steamId));
export const getPlayerGarage=(steamId:string)=>islepilotGet(playerPath(steamId,"/garage"));
export const getPlayerSkins=(steamId:string)=>islepilotGet(playerPath(steamId,"/skins"));
export const getPlayerWallet=(steamId:string)=>islepilotGet(playerPath(steamId,"/wallet"));
export const getPlayerQuests=(steamId:string)=>islepilotGet(playerPath(steamId,"/quests"));
export const getDinoShop=()=>islepilotGet(officialReadEndpoints.shopDinos);
export const getSkinShop=()=>islepilotGet(officialReadEndpoints.shopSkins);
export type OfficialResource=keyof typeof officialReadEndpoints;
export const getOfficialResource=(resource:OfficialResource):Promise<IslePilotResult<unknown>>=>islepilotGet(officialReadEndpoints[resource]);
