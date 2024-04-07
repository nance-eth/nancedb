import type { InferSelectModel } from "drizzle-orm";
import {
  sqliteTable,
  integer,
  text,
} from "drizzle-orm/sqlite-core";

export const proposals = sqliteTable("proposals", {
  uuid: text("uuid").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp_ms"}).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$onUpdateFn(() => new Date()),
  governanceCycle: integer("governance_cycle"),
  status: text("status"),
  proposalIdNumber: integer("proposal_id_number"),
  title: text("title"),
  body: text("body"),
  authorAddress: text("author_address").$type<`0x${string}`>(),
  authorDiscordId: text("author_discord_id"),
  coauthorAddresses: text("coauthor_addresses", { mode: "json" }).$type<`0x${string}`[]>(),
  discussionURL: text("discussion_url"),
  proposalSummary: text("proposal_summary"),
  discussionSummary: text("discussion_summary"),
  temperatureCheckResults: text("temperature_check_results", { mode: "json" }).$type<[number, number]>(),
  voteId: text("vote_id"),
  voteType: text("vote_type"),
  voteChoices: text("vote_choices", { mode: "json" }).$type<string[]>(),
  voteStart: integer("vote_start", { mode: "timestamp_ms" }),
  voteEnd: integer("vote_end", { mode: "timestamp_ms" }),
  voteResults: text("vote_results", { mode: "json" }).$type<number[]>(),
  voteCount: integer("vote_count"),
  voteQuorum: integer("vote_quorum"),
});

export type Proposal = InferSelectModel<typeof proposals>;