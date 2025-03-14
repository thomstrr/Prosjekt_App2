if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              console.log(
                "Ny Service Worker er tilgjengelig! Oppdater siden for å bruke den."
              );
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

async function sendRequest(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(endpoint, options);
  if (!response.ok) {
    alert("Feil: " + (await response.json()).error);
    return;
  }

  return response.json();
}

function showPage(pageId) {
  document
    .querySelectorAll(".page")
    .forEach((page) => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  if (pageId === "workoutPage") {
    fetchWorkouts();
  }
}

async function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const response = await sendRequest("/auth/register", "POST", {
    name,
    email,
    password,
  });

  if (response?.id) {
    alert("Registrering vellykket! Logg inn nå.");
    showPage("loginPage");
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const response = await sendRequest("/auth/login", "POST", {
    email,
    password,
  });

  if (response?.user) {
    alert("Innlogging vellykket!");
    document.cookie = "loggedIn=true; path=/";
    showPage("homePage");
  }
}

async function logout() {
  await sendRequest("/auth/logout", "POST");

  document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  alert("Du er logget ut!");

  showPage("loginPage");
}

async function fetchWorkouts() {
  const response = await sendRequest("/workouts");

  const list = document.getElementById("workoutList");

  if (!list) {
    console.error("Elementet #workoutList finnes ikke i DOM!");
    return;
  }

  list.innerHTML = "";

  if (Array.isArray(response) && response.length > 0) {
    response.forEach((workout) => {
      const date = new Date(workout.date).toLocaleDateString("no-NO");

      const item = document.createElement("li");
      item.textContent = `${date} - ${workout.exercise_name}: ${workout.sets} sett x ${workout.reps} reps (${workout.weight}kg)`;

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

  if (!date || !exercise_name || !sets || !reps || !weight) {
    alert("Vennligst fyll ut alle felt!");
    return;
  }

  try {
    const response = await sendRequest("/workouts", "POST", {
      date,
      exercise_name,
      sets,
      reps,
      weight,
    });

    const workout = Array.isArray(response) && response.length > 0 ? response[0] : null;

    if (workout?.id) {
      alert(`Treningsøkt "${exercise_name}" lagt til!`);
      fetchWorkouts();
    } else {
      alert("Kunne ikke lagre treningsøkt. Prøv igjen.");
    }
  } catch (error) {
    console.error("Feil ved opprettelse:", error);
    alert("Feil ved opprettelse av treningsøkt. Prøv igjen.");
  }
}

function isLoggedIn() {
  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith("loggedIn=true"));
}

document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    showPage("loginPage");
  } else {
    showPage("homePage");
  }
  if (document.getElementById("workoutList")) {
    fetchWorkouts();
  }
});

window.showPage = showPage;
window.register = register;
window.login = login;
window.logout = logout;
window.fetchWorkouts = fetchWorkouts;
window.addWorkout = addWorkout;
