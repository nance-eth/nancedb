import type { InferSelectModel } from "drizzle-orm";
import {
  sqliteTable,
  integer,
  text,
} from "drizzle-orm/sqlite-core";
import type { DateEvent, DialogHandlerMessageIds, DiscordConfig } from "@nance/nance-sdk"
import { v4 } from "uuid"

export const proposals = sqliteTable("proposals", {
  uuid: text("uuid").primaryKey().$defaultFn(() => v4().replace(/-/g, "")),
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

export const config = sqliteTable("config", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  space: text("space"),
  displayName: text("display_name"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$onUpdateFn(() => new Date()),
  writeValidation: text("write_validation"),
  dbCID: text("db_cid"),
  proposalIdPrefix: text("proposal_id_prefix", { mode: "json" }).$type<string>(),
  spaceOwners: text("space_owners", { mode: "json" }).$type<`0x${string}`[]>(),
  discordSettings: text("discord_settings", { mode: "json" }).$type<DiscordConfig>(),
  calendar: text("calendar", { mode: "json" }).$type<DateEvent[]>(),
  cycleTriggerTime: text("cycle_trigger_time").$type<number>(),
  cycleStageLengths: text("cycle_stage_lengths", { mode: "json" }).$type<number[]>(),
  dialogHandlerMessageIds: text("dialog_handler_message_ids", { mode: "json" }).$type<DialogHandlerMessageIds>(),
  currentGovernanceCycle: integer("current_governance_cycle"),
  template: text("template"),
});

export type Proposal = InferSelectModel<typeof proposals>;
export type Config = InferSelectModel<typeof config>;
