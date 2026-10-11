
/* =========================================
   AEROEASE — AI TRAVEL PLANNER
   Powered by Google Gemini
========================================= */

/* TRAVEL CHECKLIST */

const checklist = [
  "ID or passport",
  "Booking confirmation",
  "Phone charger",
  "Essential medication",
  "Weather-ready clothing"
];

function renderPlanner() {
  const container = $("checklist");

  if (!container) return;

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

  const savedList = $("saved-list");

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
   LIVE GEMINI CHAT
========================================= */

const aeroChatHistory = [];
let aeroChatBusy = false;

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

async function sendMessage(event) {
  event?.preventDefault();

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
    "✦ Aero AI is thinking...",
    "bot"
  );

  try {
    const response = await fetch(
      "http://127.0.0.1:3000/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          history: aeroChatHistory
        }),
        signal: AbortSignal.timeout(90000)
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "AI request failed"
      );
    }

    if (typeof data.reply !== "string") {
      throw new Error("Invalid AI response");
    }

    if (typing) {
      typing.textContent = data.reply;
    }
     
if (typing) {
  typing.textContent = data.reply;
}

// Automatically speak Gemini's reply
try {
  if (typeof speakAeroReply === "function") {
    speakAeroReply(data.reply);
  }
} catch (voiceError) {
  console.warn("Aero AI voice error:", voiceError);
}

// Save conversation history
aeroChatHistory.push(
  { role: "user", text: message },
  { role: "model", text: data.reply }
);

if (aeroChatHistory.length > 20) {
  aeroChatHistory.splice(
    0,
    aeroChatHistory.length - 20
  );
}

 } catch (error) {
  console.error("Aero AI chat error:", error);

  if (typing) {
    if (error.name === "TimeoutError") {
      typing.textContent =
        "Aero AI is taking longer than expected. " +
        "Please try again.";
    } else {
      typing.textContent =
        "Unable to connect to Aero AI. " +
        "Please check the backend connection.";
    }
  }

  } finally {
    input.disabled = false;
    aeroChatBusy = false;

    input.focus();

    const container = document.getElementById("messages");

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
