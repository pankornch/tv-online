import express from "express";

import chanelRouter from "./channel";
import adminRouter from "./admin";
import { getImage, uploadImage } from "../controllers/image";
import { upload } from "../utils/upload";

const router = express.Router();

router.get("/", (_req, res) => res.json({ message: "hello" }));

router.use("/channel", chanelRouter);
router.use("/admin", adminRouter);

router.post("/upload", upload.single("image"), uploadImage);
router.get("/image/:filename", getImage);

export default router;
