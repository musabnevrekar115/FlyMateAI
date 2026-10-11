/* ==========================================
   AEROEASE VOICE ASSISTANT
   Welcome Greeting + Gemini Voice Replies
========================================== */

let lastVoiceUser = null;

// Shared preference for all AeroEase speech.
// Enabled by default.
let aeroVoiceEnabled = true;

try {
  aeroVoiceEnabled =
    localStorage.getItem("ae_voice_enabled") !== "false";
} catch (error) {
  console.warn("Could not load voice preference:", error);
}

/* ==========================================
   SOUND ON / OFF
========================================== */

function isAeroVoiceEnabled() {
  return aeroVoiceEnabled;
}

function setAeroVoiceEnabled(enabled) {
  aeroVoiceEnabled = Boolean(enabled);

  try {
    localStorage.setItem(
      "ae_voice_enabled",
      String(aeroVoiceEnabled)
    );
  } catch (error) {
    console.warn("Could not save voice preference:", error);
  }

  if (!aeroVoiceEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  return aeroVoiceEnabled;
}

// Call this from your existing sound toggle.
function toggleAeroVoice() {
  return setAeroVoiceEnabled(!aeroVoiceEnabled);
}

/* ==========================================
   SHARED SPEECH ENGINE
========================================== */

function aeroSpeak(text, options = {}) {
  if (!isAeroVoiceEnabled()) return;

  if (!("speechSynthesis" in window)) {
    console.warn("Speech playback not supported.");
    return;
  }

  const cleanText = String(text)
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*#`_]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanText) return;

  const synthesis = window.speechSynthesis;

  synthesis.cancel();

  const speech = new SpeechSynthesisUtterance(
    cleanText.slice(0, 2500)
  );

  speech.lang = "en-IN";
  speech.rate = options.rate ?? 1;
  speech.pitch = options.pitch ?? 1;
  speech.volume = options.volume ?? 0.95;

  const voices = synthesis.getVoices();

  const preferredVoice =
    voices.find(v => v.lang === "en-IN") ||
    voices.find(
      v =>
        v.lang.startsWith("en") &&
        /Google|Microsoft|Natural/i.test(v.name)
    ) ||
    voices.find(v => v.lang.startsWith("en"));

  if (preferredVoice) {
    speech.voice = preferredVoice;
  }

  synthesis.speak(speech);
}

/* ==========================================
   FIREBASE WELCOME GREETING
========================================== */

function speakWelcome(name) {
  aeroSpeak(
    `Welcome aboard, ${name}! Your journey begins here.`,
    {
      rate: 0.88,
      pitch: 1.05,
      volume: 0.9
    }
  );
}

function welcomeLoggedInUser(firebaseUser) {
  if (!firebaseUser) return;

  if (lastVoiceUser === firebaseUser.uid) return;

  lastVoiceUser = firebaseUser.uid;

  const name =
    firebaseUser.displayName ||
    firebaseUser.email?.split("@")[0] ||
    "Traveler";

  speakWelcome(name);
}

function resetWelcomeVoice() {
  lastVoiceUser = null;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/* ==========================================
   GEMINI VOICE REPLIES
========================================== */

function speakAeroReply(text) {
  aeroSpeak(text, {
    rate: 1,
    pitch: 1,
    volume: 1
  });
}