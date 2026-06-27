import fs from "node:fs/promises";
import pdf from "pdf-parse";
import mammoth from "mammoth";

const normalize = (text) =>
  text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export async function parseResume(file) {
  if (!file) {
    const error = new Error("Resume file is required.");
    error.statusCode = 400;
    throw error;
  }

  const buffer = await fs.readFile(file.path);
  let text = "";

  if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
    const result = await pdf(buffer);
    text = result.text;
  } else if (
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.originalname.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else {
    const error = new Error("Unsupported file type. Upload a PDF or DOCX resume.");
    error.statusCode = 415;
    throw error;
  }

  const parsedText = normalize(text);
  if (parsedText.length < 120) {
    const error = new Error("Could not extract enough resume text. Try a text-based PDF or DOCX file.");
    error.statusCode = 422;
    throw error;
  }

  return {
    text: parsedText.slice(0, 12000),
    wordCount: parsedText.split(/\s+/).length,
    fileName: file.originalname
  };
}
