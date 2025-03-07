if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/public/sw.js')
      .then(function(registration) {
          console.log('Service Worker registrert:', registration.scope);
      })
      .catch(function(error) {
          console.error('Service Worker registrering feilet:', error);
      });
}

