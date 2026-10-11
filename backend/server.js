
import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

console.log(
  "Gemini API key loaded:",
  Boolean(process.env.GEMINI_API_KEY)
);

const app = express();
const PORT = Number(process.env.PORT || 3000);

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ]
}));


app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "AeroEase",
    provider: "Gemini AI",
    message: "Backend is running!"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        error: "Enter a valid message."
      });
    }

    const safeHistory = Array.isArray(history)
      ? history.slice(-10)
          .filter(item =>
            item &&
            ["user", "model"].includes(item.role) &&
            typeof item.text === "string"
          )
          .map(item => ({
            role: item.role,
            parts: [{ text: item.text.slice(0, 2000) }]
          }))
      : [];

    

const result = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL || "gemini-3.8-flash",

  contents: [
    ...safeHistory.map(item => ({
      role: item.role,
      parts: [{ text: item.text }]
    })),
    {
      role: "user",
      parts: [{ text: message.trim() }]
    }
  ],

  config: {
    systemInstruction: `
You are Aero AI, the travel assistant
inside the AeroEase aviation web application.

Introduce yourself as Aero AI, powered by
Google Gemini, when asked who you are.

Help users with:
- Flight and destination planning
- Travel budgets
- Trip itineraries
- Packing checklists
- Airport guidance
- Tourism recommendations

Be friendly, natural, helpful and concise.

Remember context from previous messages.

Never invent live flight availability,
ticket prices, delays or confirmed bookings.
If real-time data is needed, explain that
a verified flight-data API is required.
`
  }
});



   res.json({
  success: true,
  reply: result.text || "No response generated."
});

  




} catch (error) {
  console.error("===== GEMINI DEBUG =====");

  console.error(
    "Status:",
    error.status ?? "Unknown"
  );

  console.error(
    "Code:",
    error.code ?? "Unknown"
  );

  const safeMessage = String(
    error.message || "Unknown error"
  )
    .replace(/AIza[A-Za-z0-9_-]+/g, "[REDACTED_KEY]")
    .replace(/Bearer\s+\S+/gi, "Bearer [REDACTED]");

  console.error(
    "Message:",
    safeMessage.slice(0, 500)
  );

  console.error("========================");

  return res.status(502).json({
    success: false,
    error: "Aero AI is temporarily unavailable."
  });
}


});


/* TEMPORARY GEMINI DIAGNOSTIC ENDPOINT */
/* LOCAL DEVELOPMENT ONLY */

app.get("/api/diagnose", async (req, res) => {
  try {
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents: "Say hello in one short sentence."
    });

    res.json({
      success: true,
      model: process.env.GEMINI_MODEL,
      reply: result.text
    });
  } catch (error) {
    console.error("Gemini diagnostic failed:", error.status);

    const message = String(error.message || "Unknown");

    // Return only controlled diagnostic information.
    res.status(502).json({
      success: false,
      geminiStatus: error.status ?? null,
      geminiCode: error.code ?? null,
      model: process.env.GEMINI_MODEL || null,
      errorCategory:
        error.status === 429 ? "Quota or rate limit" :
        error.status === 404 ? "Model unavailable" :
        error.status === 403 ? "Permission denied" :
        error.status === 400 ? "Invalid request or API key" :
        "Other Gemini failure",
      messageType: message.includes("quota") ? "quota" :
        message.includes("model") ? "model" :
        message.includes("API key") ? "api-key" :
        "unknown"
    });
  }
});

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log("AeroEase Gemini AI Backend Started!");
  console.log(`http://127.0.0.1:${PORT}`);
});

server.on("error", (error) => {
  console.error(
    "Server startup failed:",
    error.code,
    error.message
  );
});
