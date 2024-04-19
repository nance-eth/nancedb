import { drizzle, type BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { eq, or } from "drizzle-orm";
import * as schema from "./schema";
import type { Proposal } from "./schema";
import fs from "node:fs";
import type { NewProposal, UpdateProposal, Proposal as OldFormatProposal } from "@nance/nance-sdk";

const proposals = schema.proposals;
export const db: Record<string, BunSQLiteDatabase<typeof schema>> = {};
export const dbPath = "./db_files";

const loadDatabases = async () => {
  const files = fs.readdirSync(dbPath);
  for (const file of files) {
    if (file.endsWith(".db") && !file.includes("_sys")) {
      console.log(`\t${file}`);
      const space = file.split(".")[0];
      const sqlite = new Database(`${dbPath}/${file}`);
      const d = drizzle(sqlite, { schema });
      db[space] = d;
    }
  }
  return Promise.resolve();
};

console.log("Loading databases...");
await loadDatabases();
console.log("Databases loaded");

export const proposalById = async (space: string, pid: string): Promise<Proposal | null> => {
  try {
    const res = await db[space].select().from(proposals).where(or(
      eq(proposals.uuid, pid),
      eq(proposals.proposalIdNumber, parseInt(pid))
    )).limit(1);
    if (res.length === 0) return Promise.reject("Proposal not found");
    return res[0] as Proposal;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const addProposal = async (space: string, proposalIn: OldFormatProposal): Promise<string> => {
  try {
    const proposal: Proposal = {
      uuid: proposalIn.uuid,
      createdAt: new Date(proposalIn.createdTime),
      updatedAt: new Date(proposalIn.lastEditedTime || proposalIn.createdTime),
      governanceCycle: proposalIn.governanceCycle || 0,
      status: proposalIn.status,
      proposalIdNumber: proposalIn.proposalId || 0,
      title: proposalIn.title,
      body: proposalIn.body,
      authorAddress: proposalIn.authorAddress as `0x${string}` || null,
      authorDiscordId: proposalIn.authorDiscordId || null,
      discussionURL: proposalIn.discussionThreadURL || null,
      proposalSummary: proposalIn.proposalSummary || null,
      discussionSummary: proposalIn.threadSummary || null,
      coauthorAddresses: null,
      temperatureCheckResults: null,
      voteId: null,
      voteType: null,
      voteChoices: null,
      voteStart: null,
      voteEnd: null,
      voteResults: null,
      voteCount: null,
      voteQuorum: null
    };
    const res = await db[space].insert(proposals).values(proposal).returning({ uuid: proposals.uuid });
    return res[0].uuid;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const updateProposal = async (space: string, proposal: UpdateProposal): Promise<string> => {
  try {
    const res = await db[space].update(proposals).set(proposal).where(
      eq(proposals.uuid, proposal.uuid),
    ).returning({ uuid: proposals.uuid });
    return res[0].uuid;
  } catch (e) {
    return Promise.reject(e);
  }
}
