import express from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { createSession, getSession, updateSession } from "../services/interviewStore.js";
import { generateEvaluation, generateQuestion } from "../services/aiCoach.js";

const router = express.Router();

const startSchema = z.object({
  role: z.string().min(2).max(120),
  resumeText: z.string().min(120).max(12000),
  maxQuestions: z.number().min(3).max(8).default(5)
});

const answerSchema = z.object({
  answer: z.string().min(10).max(5000)
});

router.post("/start", async (req, res, next) => {
  try {
    const payload = startSchema.parse(req.body);
    const session = createSession({
      id: randomUUID(),
      role: payload.role,
      resumeText: payload.resumeText,
      maxQuestions: payload.maxQuestions,
      history: [],
      status: "active",
      createdAt: new Date().toISOString()
    });

    const question = await generateQuestion(session);
    res.status(201).json({ sessionId: session.id, question, questionNumber: 1, maxQuestions: session.maxQuestions });
  } catch (error) {
    next(error);
  }
});

router.post("/:sessionId/answer", async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const payload = answerSchema.parse(req.body);
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Interview session not found." });
    }

    const currentQuestion = req.body.question;
    const updated = updateSession(sessionId, (existing) => ({
      ...existing,
      history: [
        ...existing.history,
        {
          question: currentQuestion || "Interview question",
          answer: payload.answer,
          answeredAt: new Date().toISOString()
        }
      ]
    }));

    if (updated.history.length >= updated.maxQuestions) {
      updated.status = "ready_for_evaluation";
      return res.json({ finished: true, history: updated.history });
    }

    const question = await generateQuestion(updated);
    res.json({
      finished: false,
      question,
      questionNumber: updated.history.length + 1,
      maxQuestions: updated.maxQuestions
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:sessionId/evaluate", async (req, res, next) => {
  try {
    const session = getSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Interview session not found." });
    }
    if (session.history.length === 0) {
      return res.status(400).json({ message: "Answer at least one question before evaluation." });
    }

    const evaluation = await generateEvaluation(session);
    updateSession(session.id, (existing) => ({ ...existing, status: "completed", evaluation }));
    res.json(evaluation);
  } catch (error) {
    next(error);
  }
});

export default router;
