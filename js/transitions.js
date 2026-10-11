
/* AEROEASE AIRPLANE TRANSITION CONTROLLER */

(() => {
  const overlay = document.getElementById("aero-transition");

  if (!overlay) {
    console.error("AeroEase transition overlay not found.");
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let transitioning = false;
  let openingTimer = null;

  function finishTransition() {
    overlay.className = "aero-transition";
    overlay.setAttribute("aria-hidden", "true");
    transitioning = false;
  }

  function openCurtains() {
    overlay.className = "aero-transition is-active";

    // Restart CSS animations consistently.
    void overlay.offsetWidth;

    overlay.classList.add("is-opening");

    openingTimer = setTimeout(() => {
      finishTransition();
    }, 1250);
  }

  // Initial cinematic website reveal.
  function initialReveal() {
    if (reducedMotion.matches) {
      finishTransition();
      return;
    }

    transitioning = true;
    overlay.className = "aero-transition is-active";

    setTimeout(() => {
      openCurtains();
    }, 450);
  }

  // Used when changing pages.
  window.playAeroTransition = function (changePage) {
    if (typeof changePage !== "function") return;

    if (transitioning || reducedMotion.matches) {
      if (!transitioning) changePage();
      return;
    }

    transitioning = true;

    clearTimeout(openingTimer);

    overlay.setAttribute("aria-hidden", "true");
    overlay.className =
      "aero-transition is-active is-closing";

    setTimeout(() => {
      try {
        changePage();
      } finally {
        overlay.setAttribute("aria-hidden", "true");
        openCurtains();
      }
    }, 390);
  };

  // Hide the overlay while the page is backgrounded.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearTimeout(openingTimer);
      finishTransition();
    }
  });

  initialReveal();

  console.log("AeroEase cinematic transitions ready.");
})();
