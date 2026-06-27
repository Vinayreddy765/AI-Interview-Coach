import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ZodError } from "zod";
import { config } from "./config.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  contentSecurityPolicy: config.nodeEnv === "production" ? undefined : false
}));
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiProvider: config.openaiApiKey ? "openai" : "local-fallback" });
});

app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);

if (config.nodeEnv === "production") {
  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err instanceof ZodError ? 400 : err.statusCode ?? 500;
  res.status(status).json({
    message: err instanceof ZodError ? "Invalid request payload." : err.message ?? "Something went wrong.",
    issues: err instanceof ZodError ? err.issues : undefined,
    details: config.nodeEnv === "development" ? err.stack : undefined
  });
});

app.listen(config.port, () => {
  console.log(`AI Interview Coach API running on port ${config.port}`);
});
