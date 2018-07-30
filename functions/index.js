/* eslint-disable */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  }
});

const token =
  'flXB0ExPV2Q:APA91bGhHe6s5boxOHw4TNJ2EoXumneQaSkD43MnIeNj0y_0aNrW7gzzSzoQWHAKjK-zazz8M-i8MHskzJk-wqsYJSSXCJsv2E5qWa2p0ymjofViR52pou4c0a8K9ev2XqA0ytWPsij_';

const sendNewSharedListEmail = (email, name, link) => {
  const mailOptions = {
    from: 'Bowerlist <noreply@bowerlist.app>',
    to: email,
    subject: 'A new list was shared with you!',
    text: `Hey ${name}! A new list was just shared with you: ${link}`,
  };

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log(`New welcome email sent to: ${email}`);
  }).catch(e => console.error(e));
};

exports.notifyNewSharedList = functions.firestore
  .document('lists/{listId}') // Can I use `listId` in the function? You can! `context.params.listId`!
  .onUpdate((change, context) => {
    const oldData = change.before.data();
    const newData = change.after.data();

    // Get only the newly added users
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

          // Send the email
          sendNewSharedListEmail(userData.email, userData.name, link);

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
