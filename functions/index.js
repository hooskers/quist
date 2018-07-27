/* eslint-disable */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const token =
  'flXB0ExPV2Q:APA91bGhHe6s5boxOHw4TNJ2EoXumneQaSkD43MnIeNj0y_0aNrW7gzzSzoQWHAKjK-zazz8M-i8MHskzJk-wqsYJSSXCJsv2E5qWa2p0ymjofViR52pou4c0a8K9ev2XqA0ytWPsij_';

exports.notifyNewSharedList = functions.firestore
  .document('lists/{listId}') // Can I use `listId` in the function? You can! `context.params.listId`!
  .onUpdate((change, context) => {
    const oldData = change.before.data();
    const newData = change.after.data();

    let newUserIds;
    newUserIds = Object.keys(newData.sharedUsers).filter(newId => {
      return !oldData.sharedUsers.hasOwnProperty(newId);
    });

    let promises = [];
    // let tokens = [];

    newUserIds.forEach(id => {
      promises.push(
        admin
          .firestore()
          .doc(`users/${id}`)
          .get() // eslint-disable-line
      );
      // .then(userSnapshot => {
      //   let userData = userSnapshot.data();
      //   tokens.push(userData.fcm_token);
      // })
      // .catch(err => console.error(err));
    });

    return Promise.all(promises)
      .then(snapshots => {
        return snapshots.forEach(snapshot => {
          const userData = snapshot.data();
          const link = 'localhost:8080' + '/list/' + context.params.listId;
          const payload = {
            notification: {
              title: 'A list has been shared with you',
              body: 'Click to view list',
              click_action: link,
            },
            // What is the `data` object supposed to do?
            data: {
              custom_key_1: 'Data for key one',
              custom_key_2: 'Helloooo',
            },
          };

          Object.keys(userData.fcm_tokens).forEach(token => {
            admin
              .messaging()
              .sendToDevice(token, payload)
              .then(() => console.log('Message successfully sent.'))
              .catch(response =>
                console.error(`Error sending message to ${token}`)
              );
          });
        });
      })
      .catch(err => console.error(err));
  });

// exports.testFunction = functions.firestore
//   .document('test/yeah')
//   .onUpdate(() => {
//     const payload = {
//       notification: {
//         body: 'Click to view list',
//         title: 'A list has been shared with you',
//         click_action: 'localhost:8080',
//       },
//       data: {
//         custom_key_1: 'Data for key one',
//         custom_key_2: 'Helloooo',
//       },
//     };

//     return admin.messaging().sendToDevice(token, payload);
//   });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
