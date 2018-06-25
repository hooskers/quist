/* eslint-env serviceworker */
/* global firebase */

importScripts('https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js',
);

// workbox.skipWaiting();
// workbox.clientsClaim();

console.log('wttffff');

self.addEventListener('message', event => {
  console.log('message event fired');
  console.log(event);
});

firebase.initializeApp({
  messagingSenderId: '1019975876001',
});

const messaging = firebase.messaging();

// messaging
//   .getToken()
//   .then(token => {
//     console.log(token);
//   })
//   .catch(e => console.warn(e));

// messaging.onTokenRefresh(() => {
//   console.log('Token refreshed');
//   messaging
//     .getToken()
//     .then(token => {
//       console.log(token);
//     })
//     .catch(e => console.log(e));
// });

// messaging.onMessage(payload => {
//   console.log(`message received: ${payload}`);
// });

messaging.setBackgroundMessageHandler(payload => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );

  return self.registration.showNotification('Test notif title', {
    body: 'Test notif body',
  });
});
