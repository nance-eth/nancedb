import type { ProposalUploadRequest } from "@nance/nance-sdk";
import { expect, test } from "bun:test";

test("proposalById", async () => {
  const proposalId = 489;
  const { data: proposal } = await fetch(`http://localhost:3000/s/juicebox/${proposalId}`).then((res) => res.json());
  expect(proposal).not.toBeNull();
  expect(proposal).toHaveProperty("proposalIdNumber", proposalId);
});

test("uploadProposal", async () => {
  const proposal: ProposalUploadRequest = {
    space: "waterbox",
    proposal: {
      title: "Waterbox Proposal",
      body: "This is a proposal for the Waterbox DAO",
      status: "Discussion",
      actions: [],
    }
  }
  const res = await fetch("http://localhost:3000/s/waterbox/propose", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proposal),
  });
});