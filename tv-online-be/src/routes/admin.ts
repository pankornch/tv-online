import express from "express";
import { adminAuthMiddleware } from "../middlewares/admin";

import { adminLogin, adminRegister } from "../controllers/admin/auth";
import {
  adminUpdateChannel,
  adminCreateChannel,
  adminDeleteChannel,
  adminGetChannleLogByChannelID,
  adminGetChannelLogByUID,
  adminGetChannelChatsByChannelID,
} from "../controllers/admin/channel";

const router = express.Router();
const adminChannelRouter = express.Router();

// ------------ auth router
router.post("/login", adminLogin);
router.post("/register", adminAuthMiddleware, adminRegister);

// ############ end of auth router

// ------------ auth channel router
adminChannelRouter
  .use("/channel", adminAuthMiddleware)
  .post("/channel", adminCreateChannel);

adminChannelRouter.get(
  "/channel/log/channel/:channelID",
  adminGetChannleLogByChannelID
);

adminChannelRouter.get("/channel/log/user/:uid", adminGetChannelLogByUID);
adminChannelRouter.get(
  "/channel/chat/:channelID",
  adminGetChannelChatsByChannelID
);

adminChannelRouter
  .patch("/channel/:id", adminUpdateChannel)
  .delete("/channel/:id", adminDeleteChannel);

// ############ auth channel router

router.use(adminChannelRouter);

export default router;
