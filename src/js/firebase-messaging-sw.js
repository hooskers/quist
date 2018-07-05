/* eslint-env serviceworker */
/* global firebase */

importScripts('https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js',
);

console.log('wttffff');

self.addEventListener('message', event => {
  console.log('message event fired');
  console.log(event);
});

firebase.initializeApp({
  messagingSenderId: '1019975876001',
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
  console.log('[firebase-messaging-sw.js] Received background message ');
  console.log({ ...payload });
});
