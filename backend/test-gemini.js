
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const model = process.env.GEMINI_MODEL;

console.log("Testing model:", model);

try {
  const response = await ai.models.generateContent({
    model,
    contents: "Say hello to an AeroEase traveler in one sentence."
  });

  console.log("SUCCESS!");
  console.log("AI REPLY:", response.text);

} catch (error) {
  console.error("GEMINI REQUEST FAILED");
  console.error("Status:", error.status ?? "Unknown");

  const safeMessage = String(error.message || "Unknown")
    .replace(/AIza[A-Za-z0-9_-]+/g, "[REDACTED]");

  console.error("Error:", safeMessage.slice(0, 400));
}
