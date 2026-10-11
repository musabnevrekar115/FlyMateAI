
/* =========================================
   AEROEASE - FIREBASE AUTHENTICATION
   Email / Password / Google
========================================= */

let firebaseAuthUnsubscribe = null;

/* LOGIN / SIGNUP SWITCH */

function toggleAuth() {
  authMode = authMode === "signup" ? "login" : "signup";

  const isSignup = authMode === "signup";

  $("name-field")?.classList.toggle("hidden", !isSignup);

  $("auth-heading").textContent = isSignup
    ? "Create Your Account"
    : "Welcome Back";

  $("auth-submit").textContent = isSignup
    ? "Create Account →"
    : "Log In →";

  $("switch-prompt").textContent = isSignup
    ? "Already have an account?"
    : "New to AeroEase?";

  $("switch-auth").textContent = isSignup
    ? "Log In"
    : "Sign Up";
}

/* USER STATE */

function syncFirebaseUser(firebaseUser) {
  if (!firebaseUser) {
    user = null;
  } else {
    user = {
      uid: firebaseUser.uid,
      name:
        firebaseUser.displayName ||
        firebaseUser.email?.split("@")[0] ||
        "Traveler",
      email: firebaseUser.email || ""
    };
  }

  const navButton = $("nav-cta");

  if (navButton) {
    navButton.textContent = user
      ? "Dashboard ↗"
      : "Sign Up Free ↗";

    navButton.onclick = () =>
      go(user ? "dashboard" : "login");
  }

  if (user && typeof renderDashboard === "function") {
    renderDashboard();
  }

  return user;
}

/* EMAIL SIGNUP / LOGIN */

async function authenticate(event) {
  event?.preventDefault();

  if (!window.aeroFirebase || !window.aeroAuth) {
    notify("Firebase is still loading.");
    return;
  }

  const email = $("auth-email")?.value.trim();
  const password = $("auth-password")?.value;
  const name = $("auth-name")?.value.trim() || "";
  const submitButton = $("auth-submit");

  if (!email || !password) {
    notify("Please enter your email and password.");
    return;
  }

  if (authMode === "signup" && !name) {
    notify("Please enter your full name.");
    return;
  }

  if (submitButton) submitButton.disabled = true;

  try {
    const { auth } = window.aeroFirebase;
    const api = window.aeroAuth;

    let credential;

    if (authMode === "signup") {
      credential =
        await api.createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      // The account already exists if this step fails.
      try {
        await api.updateProfile(credential.user, {
          displayName: name
        });
      } catch (profileError) {
        console.warn(
          "Account created, but name update failed:",
          profileError
        );
      }
    } else {
      credential =
        await api.signInWithEmailAndPassword(
          auth,
          email,
          password
        );
    }

    syncFirebaseUser(credential.user);
    welcomeLoggedInUser(credential.user);

    $("auth-password").value = "";

    notify(
      `Welcome aboard, ${user.name}! ✈`
    );

    go("dashboard");

  } catch (error) {
    console.error("Firebase auth error:", error);
    notify(getFirebaseError(error.code));

  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

/* GOOGLE AUTHENTICATION */

async function loginWithGoogle() {
  if (!window.aeroFirebase || !window.aeroAuth) {
    notify("Firebase is still loading.");
    return;
  }

  try {
    const { auth } = window.aeroFirebase;
    const api = window.aeroAuth;

    const provider = new api.GoogleAuthProvider();

    const result = await api.signInWithPopup(
      auth,
      provider
    );

    syncFirebaseUser(result.user);
    welcomeLoggedInUser(result.user);

    notify(`Welcome aboard, ${user.name}! ✈`);

    go("dashboard");

  } catch (error) {
    console.error("Google auth error:", error);

    if (error.code !== "auth/popup-closed-by-user") {
      notify(getFirebaseError(error.code));
    }
  }
}

/* REAL FIREBASE LOGOUT */

async function logout() {
  if (!window.aeroFirebase || !window.aeroAuth) {
    notify("Firebase is not available.");
    return;
  }

  try {
    await window.aeroAuth.signOut(
      window.aeroFirebase.auth
    );

    syncFirebaseUser(null);
    resetWelcomeVoice();

    // Remove any legacy demo login state.
    localStorage.removeItem("ae_user");

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    notify("Signed out successfully.");
    go("home");

  } catch (error) {
    console.error("Logout error:", error);
    notify("Unable to sign out. Please try again.");
  }
}

/* USER-FRIENDLY ERROR MESSAGES */

function getFirebaseError(code) {
  const messages = {
    "auth/email-already-in-use":
      "An account already exists with this email.",

    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/weak-password":
      "Please choose a stronger password.",

    "auth/invalid-credential":
      "Incorrect email or password.",

    "auth/user-disabled":
      "This account has been disabled.",

    "auth/too-many-requests":
      "Too many attempts. Please try again later.",

    "auth/popup-blocked":
      "Please allow Google login popups.",

    "auth/popup-closed-by-user":
      "Google sign-in was cancelled.",

    "auth/unauthorized-domain":
      "Add localhost to Firebase authorized domains.",

    "auth/operation-not-allowed":
      "Enable this login method in Firebase Console.",

    "auth/network-request-failed":
      "Network error. Check your connection."
  };

  return messages[code] ||
    "Authentication failed. Please try again.";
}

/* RESTORE FIREBASE SESSION ON REFRESH */

function initializeFirebaseAuth() {
  if (!window.aeroFirebase || !window.aeroAuth) {
    console.error(
      "Firebase not initialized before authentication."
    );
    return;
  }

  if (firebaseAuthUnsubscribe) return;

  const { auth } = window.aeroFirebase;
  const { onAuthStateChanged } = window.aeroAuth;

  firebaseAuthUnsubscribe = onAuthStateChanged(
    auth,
    (firebaseUser) => {
      syncFirebaseUser(firebaseUser);

      console.log(
        firebaseUser
          ? "AeroEase: Firebase user authenticated."
          : "AeroEase: No authenticated user."
      );
    },
    (error) => {
      console.error(
        "Firebase session error:",
        error
      );
    }
  );
}

window.addEventListener("load", initializeFirebaseAuth);
