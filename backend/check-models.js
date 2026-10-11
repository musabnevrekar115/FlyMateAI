
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function checkModels() {
  try {
    const models = await ai.models.list();

    console.log("AVAILABLE GEMINI MODELS:");

    for await (const model of models) {
      if (
        model.supportedActions?.includes("generateContent")
      ) {
        console.log(model.name);
      }
    }
  } catch (error) {
    console.error(
      "Error:",
      error.status || "Unknown",
      String(error.message || "")
        .replace(/AIza[A-Za-z0-9_-]+/g, "[REDACTED]")
        .slice(0, 300)
    );
  }
}

checkModels();
