/* =========================================
   FLYMATEAI - HOTELS & PACKAGES FIX
========================================= */

(function () {
  "use strict";

  const hotelPrompts = {
    "Tropical Resorts":
      "Plan a 3-day Goa beach holiday. Suggest tropical resorts, activities, transport and an estimated budget in INR.",

    "Luxury Hotels":
      "Plan a 4-day Dubai luxury holiday. Suggest hotel areas, attractions, transport and an estimated budget.",

    "Mountain Retreats":
      "Plan a peaceful 3-day Manali mountain getaway with accommodation suggestions, sightseeing and estimated costs."
  };

  const packagePrompts = {
    "Beach Escapes":
      "Plan a budget-friendly 3-day beach trip to Goa with a day-wise itinerary and estimated budget in INR.",

    "Luxury Getaways":
      "Plan a 4-day luxury trip to Dubai with hotels, sightseeing and travel suggestions.",

    "Adventure Trips":
      "Plan a 5-day Manali adventure holiday with sightseeing, safe outdoor activities and estimated costs."
  };

  function openTripPlanner(prompt) {
    console.log("FlyMateAI trip selected:", prompt);

    // Navigate to the AI Planner.
    if (typeof window.go === "function") {
      window.go("planner");
    } else {
      document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
      });

      document.getElementById("planner")
        ?.classList.add("active");
    }

    const input = document.getElementById("chat-input");

    if (!input) {
      alert("AI Planner input was not found.");
      return;
    }

    input.value = prompt;

    // Don't interrupt a running AI request.
    if (
      typeof aeroChatBusy !== "undefined" &&
      aeroChatBusy
    ) {
      input.focus();
      return;
    }

    if (typeof window.sendMessage === "function") {
      window.sendMessage();
    } else {
      input.focus();
      console.warn("Gemini sendMessage() not available.");
    }
  }

  function setupHotels() {
    const cards = document.querySelectorAll(
      "#hotels .destination"
    );

    cards.forEach(card => {
      const title = card.querySelector("h3")
        ?.textContent.trim();

      const prompt = hotelPrompts[title];

      if (!prompt) return;

      // Remove old click handlers.
      card.removeAttribute("onclick");
      card.removeAttribute("onkeydown");

      card.style.cursor = "pointer";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      card.addEventListener("click", () => {
        openTripPlanner(prompt);
      });

      card.addEventListener("keydown", event => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          openTripPlanner(prompt);
        }
      });
    });

    console.log("FlyMateAI: Hotel cards connected.");
  }

  function setupPackages() {
    const cards = document.querySelectorAll(
      "#packages .feature"
    );

    cards.forEach(card => {
      const title = card.querySelector("h3")
        ?.textContent.trim();

      const prompt = packagePrompts[title];
      const button = card.querySelector("button");

      if (!prompt || !button) return;

      // Remove any broken previous onclick.
      button.removeAttribute("onclick");

      // Remove incorrectly pasted onclick text.
      button.textContent = "Plan Trip →";

      button.addEventListener("click", event => {
        event.preventDefault();
        openTripPlanner(prompt);
      });
    });

    console.log("FlyMateAI: Package buttons connected.");
  }

  function initHotelPackages() {
    setupHotels();
    setupPackages();

    console.log(
      "FlyMateAI Hotels & Packages ready!"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initHotelPackages
    );
  } else {
    initHotelPackages();
  }
})();