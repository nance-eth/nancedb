import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { eq, or } from "drizzle-orm";
import * as schema from "./schema";
import type { Proposal } from "./schema";

const proposals = schema.proposals;

export const proposalById = async (space: string, pid: string): Promise<Proposal | null> => {
  const sqlite = new Database(`./src/db_files/${space}.db`);
  const db = drizzle(sqlite, { schema });
  const res = await db.select().from(proposals).where(or(
    eq(proposals.uuid, pid),
    eq(proposals.proposalIdNumber, parseInt(pid))
  )).limit(1);
  return res[0] as Proposal;
}
