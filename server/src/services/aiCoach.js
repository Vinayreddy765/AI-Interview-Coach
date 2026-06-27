import { config } from "../config.js";
import { createLocalEvaluation, createLocalQuestion } from "./localCoach.js";

const systemPrompt = `You are an expert AI Interview Coach. You run realistic mock interviews.
Ask exactly one question at a time. Use the resume and role for context.
Generate thoughtful follow-up questions based on prior answers.
When evaluating, be direct, specific, and practical. Return only valid JSON.`;

async function callOpenAI(messages, schemaName) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openaiApiKey}`
    },
    body: JSON.stringify({
      model: config.openaiModel,
      temperature: 0.55,
      response_format: { type: "json_object" },
      messages
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI ${schemaName} request failed: ${text}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

function historyToText(history) {
  return history
    .map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`)
    .join("\n\n");
}

export async function generateQuestion(session) {
  if (!config.openaiApiKey) {
    return createLocalQuestion(session);
  }

  const result = await callOpenAI(
    [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: JSON.stringify({
          task: "Generate the next mock interview question.",
          targetRole: session.role,
          resumeText: session.resumeText,
          previousTurns: historyToText(session.history),
          outputShape: { question: "string" }
        })
      }
    ],
    "question"
  );

  return result.question;
}

export async function generateEvaluation(session) {
  if (!config.openaiApiKey) {
    return createLocalEvaluation(session);
  }

  return callOpenAI(
    [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: JSON.stringify({
          task: "Evaluate this completed mock interview.",
          targetRole: session.role,
          resumeText: session.resumeText,
          previousTurns: historyToText(session.history),
          outputShape: {
            summary: "string",
            scores: {
              communication: "number 0-100",
              technicalKnowledge: "number 0-100",
              confidence: "number 0-100",
              problemSolving: "number 0-100"
            },
            strengths: ["string"],
            weaknesses: ["string"],
            roadmap: ["string"]
          }
        })
      }
    ],
    "evaluation"
  );
}
