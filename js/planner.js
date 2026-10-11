/* =========================================
   AEROEASE / FLYMATEAI
   COMPLETE AI TRAVEL PLANNER
========================================= */

/* =========================================
   1. TRAVEL CHECKLIST
========================================= */

const checklist = [
  "ID or passport",
  "Booking confirmation",
  "Phone charger",
  "Essential medication",
  "Weather-ready clothing"
];

function renderPlanner() {
  const container = document.getElementById("checklist");

  if (container) {
    container.replaceChildren();

    checklist.forEach((item, index) => {
      const label = document.createElement("label");
      label.className = "check-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = checks.includes(index);

      checkbox.addEventListener("change", () => {
        toggleCheck(index);
      });

      const text = document.createElement("span");
      text.textContent = item;

      label.append(checkbox, text);
      container.appendChild(label);
    });
  }

  const savedList = document.getElementById("saved-list");

  if (savedList) {
    savedList.textContent = saved.length
      ? saved.join(" • ")
      : "No destinations saved yet.";
  }
}

function toggleCheck(index) {
  checks = checks.includes(index)
    ? checks.filter(i => i !== index)
    : [...checks, index];

  put("ae_checks", checks);
}

/* =========================================
   2. GEMINI CHAT SETTINGS
========================================= */

// Local backend for VS Code development.
// Set a deployed backend URL here when available.

const AERO_AI_API = "http://127.0.0.1:3000/api/chat";

const aeroChatHistory = [];

let aeroChatBusy = false;

/* =========================================
   3. CHAT MESSAGE DISPLAY
========================================= */

function addMessage(message, sender) {
  const container = document.getElementById("messages");

  if (!container) return null;

  const bubble = document.createElement("div");

  bubble.className = `bubble ${sender}`;
  bubble.textContent = message;

  container.appendChild(bubble);

  container.scrollTop = container.scrollHeight;

  return bubble;
}

/* =========================================
   4. GEMINI AI CHAT
========================================= */

async function sendMessage(event) {
  if (event) event.preventDefault();

  if (aeroChatBusy) return;

  const input = document.getElementById("chat-input");

  if (!input) return;

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";
  input.disabled = true;

  aeroChatBusy = true;

  const typing = addMessage(
    "✦ Aero AI is planning your journey...",
    "bot"
  );

  try {
    const response = await fetch(AERO_AI_API, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message,
        history: aeroChatHistory
      }),

      signal: AbortSignal.timeout(45000)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Gemini request failed"
      );
    }

    if (
      typeof data.reply !== "string" ||
      !data.reply.trim()
    ) {
      throw new Error("Invalid Gemini response");
    }

    // Display Gemini's real response
    if (typing) {
      typing.textContent = data.reply;
    }

    // Store recent conversation history
    aeroChatHistory.push(
      {
        role: "user",
        text: message
      },
      {
        role: "model",
        text: data.reply
      }
    );

    if (aeroChatHistory.length > 20) {
      aeroChatHistory.splice(
        0,
        aeroChatHistory.length - 20
      );
    }

    // Voice errors must never interrupt text chat
    try {
      if (typeof speakAeroReply === "function") {
        speakAeroReply(data.reply);
      }
    } catch (voiceError) {
      console.warn(
        "Aero AI voice error:",
        voiceError
      );
    }

  } catch (error) {
    console.warn("Aero AI request failed:", error);

    // Clearly labeled fallback, not a fake AI response
    const fallback = getTravelFallback(message);

    if (typing) {
      typing.textContent = fallback;
    }
  }
}