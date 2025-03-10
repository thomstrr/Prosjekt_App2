if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then((registration) => {
      registration.update();
      console.log("Service Worker registrert:", registration);
  }).catch((error) => {
      console.error("Service Worker registrering feilet:", error);
  });

  navigator.serviceWorker.ready.then((registration) => {
    registration.update();
  });
}

let sessionId = localStorage.getItem("session_id");

async function sendRequest() {
    const headers = {};
    if (sessionId) {
        headers["X-Session-ID"] = sessionId;
    }

    const response = await fetch("/", { headers });

    const newSessionId = response.headers.get("X-Session-ID");
    if (newSessionId && newSessionId !== sessionId) {
        sessionId = newSessionId;
        localStorage.setItem("session_id", sessionId);
    }

    const data = await response.json();
}

sendRequest();
