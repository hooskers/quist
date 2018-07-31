import './firebase-messaging-sw.js';

import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import { css } from 'react-emotion';
import { Router } from '@reach/router';
import database, { provider, auth, messaging } from './firebase';

import UserContext from './components/UserContext';
import FirestoreContext from './components/FirestoreContext';
import ListGallery from './components/ListGallery';

import List from './components/List';

const style = css`
  color: blue;
  background-color: green;
`;

class App extends Component {
  state = {
    name: '',
    user: null,
  };

  componentDidMount() {
    auth.onAuthStateChanged(async authUser => {
      if (authUser) {
        const { email } = authUser;
        console.log(authUser);

        // Get user info and set it on state
        const userDoc = await database
          .collection('users')
          .doc(email)
          .get();

        const userData = userDoc.data();

        console.log({ ...userData });
        console.log({ ...authUser });

        const userSetup = () => {
          this.setState({ user: authUser, ...userData });

          // Setup all the required stuff for FCM
          messaging.usePublicVapidKey(
            'BDeROq70Pj7fXV3hAvYraUfmpQh4VdNf0z-9mVg9-NN-_7EGa6s2owihW4dXuGDsu52tNlcU7u454VaUVB5aatI',
          );

          messaging
            .requestPermission()
            .then(() => {
              console.log('Notification permission granted.');
              messaging.getToken().then(token => {
                console.log(`Got token: ${token}`);
                storeToken(token, email)
                  .then(() => {
                    console.log('Added FCM token!');
                    messaging.onMessage(payload => {
                      console.log('Received message!:');
                      console.log({ ...payload });
                    });
                  })
                  .catch(() => console.log('error updating FCM token!'));

                monitorToken(email);

                if ('serviceWorker' in navigator) {
                  setupServiceWorker();
                }
              });
            })
            .catch(function(err) {
              console.warn('Unable to get permission to notify.', err);
            });
        };

        if (!userData) {
          // New user, add their info
          console.log('Adding new user');
          await database
            .collection('users')
            .doc(authUser.email)
            .set({
              name: authUser.displayName,
              email: authUser.email,
              avatar: authUser.photoURL,
              fcm_tokens: {},
              ownLists: {},
            })
            .then(() => {
              console.log('New user document added to collection!');
              userSetup();
            });
        } else {
          console.log('User exists!');
          userSetup();
        }
      }
    });
  }

  login = () => {
    auth.signInWithPopup(provider).then(result => {
      this.setState({ user: result.user });
    });
  };

  logout = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null,
      });
    });
  };

  render() {
    // If there is no user, show login button
    if (!this.state.user) {
      return <button onClick={this.login}>login</button>;
    }

    return (
      <Fragment>
        <button onClick={this.logout}>logout</button>
        <span>Name: {this.state.user.email}</span>
        <FirestoreContext.Provider value={database}>
          <UserContext.Provider value={this.state.user.email}>
            <ListGallery />
          </UserContext.Provider>
        </FirestoreContext.Provider>
      </Fragment>
    );
  }
}

const Main = () => (
  <Router>
    <App path="/" />
    <List path="list/:id" />
  </Router>
);

const setupServiceWorker = () => {
  navigator.serviceWorker
    .register('./firebase-messaging-sw.js')
    .then(registration => {
      console.log('service worker registered!');
      let serviceWorker;

      if (registration.installing) {
        serviceWorker = registration.installing;
      } else if (registration.waiting) {
        serviceWorker = registration.waiting;
      } else if (registration.active) {
        serviceWorker = registration.active;
      }

      if (serviceWorker.state === 'activated') {
        setupMessaging(registration);
      } else {
        serviceWorker.addEventListener('statechange', e => {
          if (e.target.state === 'activated') {
            setupMessaging(registration);
          }
        });
      }
    });
};

const setupMessaging = registration => {
  registration.pushManager.subscribe({ userVisibleOnly: true });
};

const storeToken = (token, email) => {
  const key = `fcm_tokens.${token}`;
  return database
    .collection('users')
    .doc(email)
    .update({ [key]: true });
};

const monitorToken = email => {
  messaging.onTokenRefresh(() => {
    console.log('Token refreshed!');
    messaging
      .getToken()
      .then(token => storeToken(token, email))
      .catch(e => console.error(e));
  });
};

render(<Main className={style} />, document.getElementById('app'));
