require('file-loader!./firebase-messaging-sw.js');

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
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker
    //     .register('firebase-messaging-sw.js')
    //     .then(registration => {
    //       var serviceWorker;
    //       if (registration.installing) {
    //         serviceWorker = registration.installing;
    //         // console.log('Service worker installing');
    //       } else if (registration.waiting) {
    //         serviceWorker = registration.waiting;
    //         // console.log('Service worker installed & waiting');
    //       } else if (registration.active) {
    //         serviceWorker = registration.active;
    //         // console.log('Service worker active');
    //       }

    //       if (serviceWorker) {
    //         console.log('sw current state', serviceWorker.state);
    //         if (serviceWorker.state == 'activated') {
    //           //If push subscription wasnt done yet have to do here
    //           console.log('sw already activated - Do watever needed here');
    //           registration.pushManager.subscribe({ userVisibleOnly: true });
    //           messaging
    //             .getToken()
    //             .then(token => {
    //               console.log(token);
    //             })
    //             .catch(e => console.warn(e));
    //           messaging.onMessage(payload => {
    //             console.log(`message received: ${payload}`);
    //           });
    //         }
    //         serviceWorker.addEventListener('statechange', function(e) {
    //           console.log('sw statechange : ', e.target.state);
    //           if (e.target.state == 'activated') {
    //             // use pushManger for subscribing here.
    //             console.log(
    //               'Just now activated. now we can subscribe for push notification',
    //             );
    //             // subscribeForPushNotification(reg);
    //             registration.pushManager.subscribe({ userVisibleOnly: true });
    //             messaging
    //               .getToken()
    //               .then(token => {
    //                 console.log(token);
    //               })
    //               .catch(e => console.warn(e));
    //             messaging.onMessage(payload => {
    //               console.log(`message received: ${payload}`);
    //             });
    //           }
    //         });
    //       }
    //     })
    //     .catch(e => console.warn(e));
    // }

    auth.onAuthStateChanged(async authUser => {
      if (authUser) {
        const { uid } = authUser;

        const userDoc = await database
          .collection('users')
          .doc(uid)
          .get();

        const userData = userDoc.data();

        this.setState({ user: authUser, ...userData });

        messaging.usePublicVapidKey(
          'BDeROq70Pj7fXV3hAvYraUfmpQh4VdNf0z-9mVg9-NN-_7EGa6s2owihW4dXuGDsu52tNlcU7u454VaUVB5aatI',
        );

        messaging
          .requestPermission()
          .then(() => {
            console.log('Notification permission granted.');
            messaging.getToken().then(token => {
              console.log(`Got token: ${token}`);
              console.log(`User ID: ${uid}}`);
              console.log({ ...userData });
              database
                .collection('users')
                .doc(uid)
                .update({ fcm_token: token })
                .then(() => console.log('Added FCM token!'))
                .catch(() => console.log('error updating FCM token!'));
              setupServiceWorker();
            });
            // TODO(developer): Retrieve an Instance ID token for use with FCM.
            // ...
          })
          .catch(function(err) {
            console.warn('Unable to get permission to notify.', err);
          });
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
        <span>Name: {this.state.name}</span>
        <FirestoreContext.Provider value={database}>
          <UserContext.Provider value={this.state.user.uid}>
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
  messaging.onMessage(payload => {
    console.log(`message received: ${payload}`);
  });
};

const init = () => {
  render(<Main className={style} />, document.getElementById('app'));
};

init();
