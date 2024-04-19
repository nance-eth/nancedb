import { Hono } from "hono";
import { addProposal, db, proposalById } from "../db/queries";
import type { Proposal, ProposalUploadRequest } from "@nance/nance-sdk";
import { approvedAddress } from "../signature";

const space = new Hono();

// [ALL] check space exists
space.use("/:space/*", async (c, next) => {
  const { space } = c.req.param();
  if (!space || !db[space]) {
    return c.json({ error: `Space ${space} not found` });
  }
  await next();
});

// [GET] proposal by id
space.get("/:space/:id", async (c) => {
  try {
    const { space, id } = c.req.param()
    const proposal = await proposalById(space, id);
    return c.json({ data: proposal });
  } catch (e) {
    return c.json({ error: e }, 404);
  }
});

// [POST] new proposal
space.post("/:space/proposals", async (c) => {
  try {
    const { space } = c.req.param();
    const {
      proposal,
      uploaderSignature,
      uploaderAddress
    } = await c.req.json() as { proposal: Proposal, uploaderSignature: `0x${string}`, uploaderAddress: `0x${string}` };
    if (!proposal || !uploaderSignature || !uploaderAddress) return c.json({ error: "Invalid request" }, 400);
    const approved = await approvedAddress("NANCE", uploaderSignature);
    if (!approved) return c.json({ error: "Unauthorized" }, 401);
    const uuid = await addProposal(space, proposal);
    return c.json({ data: uuid });
  } catch (e) {
    return c.json({ error: e }, 404);
  }
});

// [PUT] edit proposal
space.put("/:space/:id", async (c) => {

});

export default space;
