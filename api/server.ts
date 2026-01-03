import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const serverBuildPath = path.join(
  __dirname,
  "../build/server/index.js"
);

// Dynamic import (important)
const serverBuild = await import(serverBuildPath);

app.all("*", serverBuild.default);

export default app;
