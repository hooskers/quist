import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyA1nM7YtY6NATWUMHTd0LZPs3p2D7oKJeA',
  authDomain: 'quist-bf316.firebaseapp.com',
  databaseURL: 'https://quist-bf316.firebaseio.com',
  projectId: 'quist-bf316',
  storageBucket: 'quist-bf316.appspot.com',
  messagingSenderId: '1019975876001',
};

firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default db;
