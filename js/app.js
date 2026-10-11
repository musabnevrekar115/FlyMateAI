
/* AEROEASE MAIN APPLICATION */

const $ = id => document.getElementById(id);

function storage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function put(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let user = null;
let bookings = storage("ae_bookings", []);
let saved = storage("ae_saved", []);
let checks = storage("ae_checks", []);

let authMode = "signup";
let selectedFlight = null;
let tripType = "One Way";

function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.aeroToastTimeout);
  window.aeroToastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

function toggleMenu() {
  const nav = $("nav");
  const open = nav.classList.toggle("open");

  document.querySelector(".menu-toggle")
    .setAttribute("aria-expanded", String(open));
}

function showPage(pageId) {
  const nextPage = $(pageId);
  if (!nextPage || !nextPage.classList.contains("page")) {
    console.warn("Unknown AeroEase page:", pageId);
    return;
  }

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  nextPage.classList.add("active");

  document.querySelectorAll("[data-nav]").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.nav === pageId
    );
  });

  
/* ANIMATED PAGE NAVIGATION */

function showPage(pageId) {
  // Ignore navigation to unknown pages.
  const page = document.getElementById(pageId);

  if (!page || !page.classList.contains("page")) {
    return;
  }

  // No need to animate if already on this page.
  if (page.classList.contains("active")) {
    return;
  }

  if (typeof window.playAeroTransition === "function") {
    window.playAeroTransition(() => {
      showPage(pageId);
    });
  } else {
    showPage(pageId);
  }
}
 

function go(pageId) {
  const page = document.getElementById(pageId);

  if (!page || !page.classList.contains("page")) return;

  if (page.classList.contains("active")) return;

  if (typeof window.playAeroTransition === "function") {
    window.playAeroTransition(() => showPage(pageId));
  } else {
    showPage(pageId);
  }
}


  $("nav").classList.remove("open");
  document.querySelector(".menu-toggle")
    .setAttribute("aria-expanded", "false");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (pageId === "flights") renderFlights();
  if (pageId === "bookings") renderBookings();
  if (pageId === "dashboard") renderDashboard();
  if (pageId === "planner") renderPlanner();

  const cta = $("nav-cta");
  cta.textContent = user ? "Dashboard ↗" : "Sign Up Free ↗";
  cta.onclick = () => go(user ? "dashboard" : "login");
}

function save(button, place) {
  if (saved.includes(place)) {
    saved = saved.filter(item => item !== place);
  } else {
    saved.push(place);
  }

  put("ae_saved", saved);
  updateHearts();

  notify(
    saved.includes(place)
      ? `${place} saved!`
      : `${place} removed.`
  );
}

function updateHearts() {
  document.querySelectorAll(".heart").forEach(button => {
    const place = button.dataset.place;
    const isSaved = saved.includes(place);

    button.classList.toggle("saved", isSaved);
    button.textContent = isSaved ? "♥" : "♡";
    button.setAttribute(
      "aria-pressed",
      String(isSaved)
    );
  });
}

function renderDashboard() {
  $("display-name").textContent = user?.name || "Traveler";

  $("account-email").textContent =
    user?.email || "Browsing in guest demo mode.";

  $("booking-count").textContent =
    String(bookings.length).padStart(2, "0");

  $("saved-count").textContent =
    String(saved.length).padStart(2, "0");
}

/* INITIALIZATION */

function getLocalDate(daysAhead = 0) {
  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysAhead
  );

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const tomorrow = getLocalDate(1);

  $("departure").value = tomorrow;
  $("departure").min = tomorrow;

  $("flight-date").value = tomorrow;
  $("flight-date").min = tomorrow;

  updateHearts();
  showPage("home");

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });

  $("modal").addEventListener("click", event => {
    if (event.target === $("modal")) closeModal();
  });

  console.log("AeroEase application initialized.");
});


/* AEROEASE PAGE NAVIGATION FIX */

window.go = function(pageId) {
  const page = document.getElementById(pageId);

  if (!page || !page.classList.contains("page")) {
    console.warn("Page not found:", pageId);
    return;
  }

  if (page.classList.contains("active")) {
    return;
  }

  if (typeof window.playAeroTransition === "function") {
    window.playAeroTransition(() => {
      showPage(pageId);
    });
  } else {
    showPage(pageId);
  }
};


/* AEROEASE NAVIGATION */

window.go = function(pageId) {
  const page = document.getElementById(pageId);

  if (!page || !page.classList.contains("page")) {
    console.error("Page not found:", pageId);
    return;
  }

  if (page.classList.contains("active")) {
    return;
  }

  const navigate = () => showPage(pageId);

  if (typeof window.playAeroTransition === "function") {
    window.playAeroTransition(navigate);
  } else {
    navigate();
  }
};
