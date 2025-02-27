const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
      try {
          const registration = await navigator.serviceWorker.register("/sw.js", {
              scope: "/",
          });
          console.log("Service Worker registrert!", registration);
      } catch (error) {
          console.error(`Service Worker-registrering feilet: ${error}`);
      }
  }
};

registerServiceWorker();

