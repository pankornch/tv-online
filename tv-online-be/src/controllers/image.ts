import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export function uploadImage(req: Request, res: Response) {
  const url = req.file?.filename;
  res.json({ url });
}

export function getImage(req: Request, res: Response) {
  const { filename } = req.params;

  try {
    const pathname = path.join(__dirname, `../../uploads/${filename}`);

    const isFileExists = fs.existsSync(pathname);

    if (!isFileExists) {
      res.status(404).send("no such file");
      return;
    }

    res.sendFile(pathname);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
