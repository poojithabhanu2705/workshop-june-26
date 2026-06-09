// ── auth.js ───────────────────────────────────────────────────────────────
// Handles all authentication logic using the browser's Local Storage.
// No backend, no database — everything is stored in the browser.

// ── Key names used in Local Storage ───────────────────────────────────────
const USERS_KEY   = "drawing_app_users";    // stores the list of registered users
const SESSION_KEY = "drawing_app_session";  // stores the currently logged-in user

// ── Helper: get all registered users ──────────────────────────────────────
// Returns an array of user objects: [{ name, email, password }, ...]
function getUsers() {
  // localStorage stores strings, so we parse the JSON string back to an array
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : []; // return empty array if nothing stored
}

// ── Helper: save the updated users list ───────────────────────────────────
function saveUsers(users) {
  // Convert the array to a JSON string before storing
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Sign Up ────────────────────────────────────────────────────────────────
// Registers a new user if the email is not already taken.
// Returns an error message string, or null on success.
function signUp(name, email, password) {
  const users = getUsers();

  // Check if a user with this email already exists
  const alreadyExists = users.find(function (user) {
    return user.email === email;
  });

  if (alreadyExists) {
    return "An account with this email already exists.";
  }

  // Add the new user to our list
  users.push({ name: name, email: email, password: password });
  saveUsers(users);

  return null; // null means success (no error)
}

// ── Sign In ────────────────────────────────────────────────────────────────
// Checks email + password against stored users.
// On success: saves session and returns null.
// On failure: returns an error message string.
function signIn(email, password) {
  const users = getUsers();

  // Look for a user whose email AND password both match
  const matchedUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });

  if (!matchedUser) {
    return "Incorrect email or password.";
  }

  // Save the logged-in user's info as the current session
  // We store only name and email (not the password) in the session
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    name:  matchedUser.name,
    email: matchedUser.email
  }));

  return null; // null means success
}

// ── Get current session ────────────────────────────────────────────────────
// Returns the logged-in user object, or null if no one is logged in.
function getSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

// ── Logout ─────────────────────────────────────────────────────────────────
// Clears the current session from Local Storage.
function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// ── Route guard ────────────────────────────────────────────────────────────
// Call this on pages that require login (e.g., the drawing board).
// If no one is logged in, redirect to the Sign In page immediately.
function requireLogin() {
  if (!getSession()) {
    window.location.href = "signin.html";
  }
}

// ── Redirect if already logged in ─────────────────────────────────────────
// Call this on auth pages (sign in / sign up).
// If someone is already logged in, send them to the drawing board.
function redirectIfLoggedIn() {
  if (getSession()) {
    window.location.href = "index.html";
  }
}
