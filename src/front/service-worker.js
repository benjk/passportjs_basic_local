// Sert à déterminer les évolutions du serviceWorker
const CACHE_NAME  = "V12";

// Sert à définir les fichiers à mettre en cache
const urlsToCache  = [
    '/',
    '/login',
    '/register',
    '/protected-route',
    '/admin-route',
    '/img/img_connect.jpg',
    '/img/icon_home.png',
    '/img/icons/apple-touch-icon.png',
    '/img/icons/bklogo-192.png',
    '/img/icons/bklogo-512.png',
    '/styles/style.css'];

// Lors que le SW est installé on enregistre en cache
// L'enregistrement en cache à lui seul peut permettre à l'app de fonctionner en offline
self.addEventListener('install', (event) => {
    // On installe le nouveau SW sans attendre
    self.skipWaiting();
    // On attend que tous les assets soient mis en cache avant de lancer l'activation
    event.waitUntil(
        caches.open(CACHE_NAME)
          .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
          })
      );
    console.log(`serviceWorker ${CACHE_NAME} installed`)
})

// Une fois le SW installé il va s'activer
self.addEventListener('activate', function(event) {

    var cacheWhitelist = [CACHE_NAME];
    // Permet de controler immédiatemment la page
    clients.claim();
    console.log(`serviceWorker ${CACHE_NAME} activated`)
    
    event.waitUntil(
      // Check de toutes les clés de cache.
      // Si un cache est obsolète (= pas dans la whitelist) on le delete
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                console.log(`${cacheName} supprimé`);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

  // // Le traitement de l'évènement concerne toutes les requêtes de l'application
  // // Ici on va définir la politique à adopter : online first / offline first / whilerevalidate ... 
  // self.addEventListener('fetch', function(event) {
  //   event.respondWith(
  //       // Si le contenu de la requête est disponible dans le cache, alors on va le chercher depuis le cache
  //     caches.match(event.request)
  //       .then(function(response) {
  //         // Cache hit - return response
  //         if (response) {
  //           return response;
  //         }
  
  //         // IMPORTANT: Cloner la requête.
  //         // Une requete est un flux et est à consommation unique
  //         // Il est donc nécessaire de copier la requete pour pouvoir l'utiliser et la servir
  //         var fetchRequest = event.request.clone();
  
  //         return fetch(fetchRequest).then(
  //           function(response) {
  //             if (!response || response.status !== 200 || response.type !== 'basic') {
  //               return response;
  //             }
  
  //             // IMPORTANT: Même constat qu'au dessus, mais pour la mettre en cache
  //             var responseToCache = response.clone();
  
  //             // Enfin si on est arrivé ici c'est que la requête:
  //             // n'était pas en cache (l46)
  //             // n'était pas vide || en erreur || du mauvais type (l61)
  //             // Alors on ajoute les nouvelles données en cache
  //             caches.open(CACHE_NAME)
  //               .then(function(cache) {
  //                 cache.put(event.request, responseToCache);
  //               });
  
  //             return response;
  //           }
  //         );
  //       })
  //   );
  // });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              return cache.match(event.request)
            })
        })
    )
  })