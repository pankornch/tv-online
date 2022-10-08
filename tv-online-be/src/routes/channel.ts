import express from "express";
import { getListChannel, getChannelById, getSuggestChannel } from "../controllers/channel";
const router = express.Router();

router.get("/", getListChannel);
router.get("/suggest", getSuggestChannel)
router.get("/:id", getChannelById);

export default router;
