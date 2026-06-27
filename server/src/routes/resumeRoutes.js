import express from "express";
import multer from "multer";
import fs from "node:fs/promises";
import { config } from "../config.js";
import { parseResume } from "../services/resumeParser.js";

const router = express.Router();

const upload = multer({
  dest: config.uploadDir,
  limits: { fileSize: config.maxFileSizeMb * 1024 * 1024 }
});

router.post("/upload", upload.single("resume"), async (req, res, next) => {
  try {
    const parsed = await parseResume(req.file);
    res.json(parsed);
  } catch (error) {
    next(error);
  } finally {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
  }
});

export default router;
