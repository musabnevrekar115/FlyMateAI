# ✈️ FlyMateAI — Intelligent Aviation Experience

**FlyMateAI (AeroEase)** is a hackathon web application designed to make travel discovery and planning more convenient through an interactive interface, Firebase authentication, and a Gemini-powered AI travel companion.

> **Project status:** Active hackathon development. Some screens use demonstration data. Real-time flight prices, availability, and confirmed ticket bookings are **not yet provided** by the current demo.

## ✨ Features

### Implemented / in progress
- **Responsive AeroGlass UI:** Dark, glass-inspired layout for desktop and mobile.
- **Interactive 3D Earth:** An animated globe built with Three.js and mouse interaction.
- **Cinematic transitions:** Airplane-themed page-loading and navigation effects.
- **User accounts:** Google and email/password sign-in using Firebase Authentication.
- **Personal dashboard:** Welcome experience, saved destinations, and trip-related sections.
- **AI travel planner:** A chat interface connected to a Node.js/Express backend using the Google Gemini API.
- **Travel checklist:** Track essential packing and travel items.
- **Voice replies:** Browser text-to-speech support for welcome messages and AI responses (browser-dependent).
- **Flight discovery UI:** Explore sample routes and illustrative fares.

### Planned / being refined
- Microphone-based voice input and improved speech controls.
- Live flight-data integration and genuine fare comparisons.
- Trip recommendations, smart itineraries, and more complete booking workflows.
- Hosted deployment of the frontend and secure backend.

## 🛠️ Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| 3D visuals | Three.js |
| Authentication | Firebase Authentication |
| AI | Google Gemini API |
| Backend | Node.js, Express |
| Development | VS Code, Git, GitHub |

## 📁 Project structure

```text
FlyMateAI/
├── index.html
├── css/
│   ├── style.css
│   ├── earth.css
│   └── transitions.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── earth.js
│   ├── flights.js
│   ├── planner.js
│   ├── transitions.js
│   ├── voice.js
│   └── firebase-config.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env                # Local only; do not commit
├── .gitignore
└── README.md
```

*The structure above reflects the development layout. Additional helper scripts or project files may be present.*

## 🚀 Run locally

### Prerequisites
- [Node.js](https://nodejs.org/) and npm
- [Git](https://git-scm.com/)
- VS Code, optionally with the Live Server extension
- Firebase Web App configuration and enabled authentication providers
- A Google Gemini API key with access to a supported model

### 1. Clone the repository

```bash
git clone https://github.com/musabnevrekar115/FlyMateAI.git
cd FlyMateAI
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a local `backend/.env` file:

```dotenv
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=your_available_gemini_model
PORT=3000
```

Replace the placeholder values with your own. Choose a Gemini model available to your API key. **Never commit `.env` or share live API keys in screenshots.**

> **Windows PowerShell:** If the `npm` script is blocked by your execution policy, try `npm.cmd install`.

### 3. Start the backend

From the `backend` directory:

```bash
node server.js
```

For the current local setup, the API is expected at `http://127.0.0.1:3000`, with the chat endpoint at `POST /api/chat`.

### 4. Start the frontend

Open the project root in VS Code, start **Live Server** on `index.html`, and visit the address it provides (commonly `http://127.0.0.1:5500/index.html`).

Make sure your Firebase Web App configuration in `js/firebase-config.js` matches your Firebase project. Configure the appropriate authorized domains and sign-in providers in Firebase Console.

**Note:** The frontend currently connects to a localhost backend. Uploading the frontend alone to a hosting service will not make AI chat work for remote visitors; deploy the backend separately and update the API URL before production use.

## 🔐 Security notes

- Keep Gemini API keys and private Firebase Admin credentials on the server, never in frontend JavaScript.
- Commit only safe configuration examples; check `.gitignore` before every push.
- Before public deployment, protect AI endpoints with authentication, rate limiting, appropriate CORS settings, and request validation.
- Do not present sample fares or AI-generated estimates as confirmed flight prices or bookings.
- Browser voice playback and speech-recognition availability vary by browser and permissions.

## 🤝 Team collaboration

Contributors should work on feature branches and open pull requests instead of editing `main` directly.

Suggested branches:

- `feature/frontend` — design, animations, responsive layout
- `feature/backend` — APIs, Firebase integration, booking logic
- `feature/ai-voice` — Gemini chat and voice interaction
- `feature/flights` — flight search and itinerary features

Example workflow:

```bash
git switch main
git pull origin main
git switch -c feature/my-improvement
# Edit files and test changes
git add .
git commit -m "Describe the improvement"
git push -u origin feature/my-improvement
```

Then open a **Pull Request** on GitHub targeting `main`, request a review, and merge after testing.

## 🧭 Roadmap

- [x] Responsive aviation-themed frontend
- [x] Animated 3D Earth
- [x] Firebase authentication integration
- [x] Gemini chat backend and frontend integration
- [x] Initial browser speech playback
- [ ] Reliable microphone-based voice interaction
- [ ] Production-ready AI endpoint security and deployment
- [ ] Real-time flight and fare APIs
- [ ] Fully integrated trip and booking experience

## 📌 Hackathon disclaimer

FlyMateAI is a student hackathon project under active development. Demo fares, example journeys, and AI-generated suggestions are for planning and illustration, not guaranteed availability or confirmed purchases.

---

**Built by the FlyMateAI hackathon team CORTEX CREW.** ✈️
