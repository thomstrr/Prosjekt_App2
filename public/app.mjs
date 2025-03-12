if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js") 
    .then((registration) => {
      console.log("Service Worker registrert:", registration);

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              console.log("🔄 Ny Service Worker er tilgjengelig! Oppdater siden for å bruke den.");
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Service Worker registrering feilet:", error);
    });

  navigator.serviceWorker.ready
    .then((registration) => {
      console.log("Service Worker er klar:", registration);
    })
    .catch((error) => {
      console.error("Feil ved Service Worker readiness:", error);
    });
}


let sessionId = localStorage.getItem("session_id");

async function sendRequest(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-ID"] = sessionId;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(endpoint, options);
  if (!response.ok) {
    alert("Feil: " + (await response.json()).error);
    return;
  }

  const newSessionId = response.headers.get("X-Session-ID");
  if (newSessionId && newSessionId !== sessionId) {
    sessionId = newSessionId;
    localStorage.setItem("session_id", sessionId);
  }

  return response.json();
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

async function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const response = await sendRequest("/auth/register", "POST", { name, email, password });

  if (response?.id) {
    alert("Registrering vellykket! Logg inn nå.");
    showPage("loginPage");
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const response = await sendRequest("/auth/login", "POST", { email, password });

  if (response?.user) {
    alert("Innlogging vellykket!");
    showPage("homePage");
  }
}

function logout() {
  localStorage.removeItem("session_id");
  sessionId = null;
  alert("Du er logget ut!");
  showPage("homePage");
}

async function fetchWorkouts() {
  const response = await sendRequest("/workouts");

  const list = document.getElementById("workoutList");
  list.innerHTML = "";

  if (Array.isArray(response)) {
    response.forEach((workout) => {
      const item = document.createElement("li");
      item.textContent = `${workout.date} - ${workout.exercise_name}: ${workout.sets} sett x ${workout.reps} reps (${workout.weight}kg)`;
      list.appendChild(item);
    });
  }
}

async function addWorkout() {
  const date = document.getElementById("workoutDate").value;
  const exercise_name = document.getElementById("exerciseName").value;
  const sets = document.getElementById("sets").value;
  const reps = document.getElementById("reps").value;
  const weight = document.getElementById("weight").value;

  const response = await sendRequest("/workouts", "POST", { date, exercise_name, sets, reps, weight });

  if (response?.id) {
    alert("Treningsøkt lagt til!");
    fetchWorkouts();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("workoutList")) fetchWorkouts();
});

window.showPage = showPage;
window.register = register;
window.login = login;
window.logout = logout;
window.fetchWorkouts = fetchWorkouts;
window.addWorkout = addWorkout;
