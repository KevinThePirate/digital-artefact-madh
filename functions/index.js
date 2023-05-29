const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// const db = admin.firestore();

const sgMail = require("@sendgrid/mail");
const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

exports.welcomeEmail = functions.auth.user().onCreate((user) => {
  const msg = {
    to: user.email,
    from: "smithkevin1100@gmail.com",
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      subject: "Welcome to the Firebase!",
      name: user.displayName,
    },
  };
  return sgMail.send(msg);
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
