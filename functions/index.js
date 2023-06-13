const functions = require("firebase-functions");
const admin = require("firebase-admin");
// admin.initializeApp();
// The Firebase Admin SDK to access Firestore.
// const {initializeApp} = require("firebase-admin/app");
// const {getFirestore} = require("firebase-admin/firestore");


const serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://digital-artifact-d878d.firebaseio.com", // Replace with your database URL
});
const db = admin.firestore();

const findCorrelationsWithTimeframes = (data) => {
  const timeframes = ["morning", "afternoon", "evening", "night"];

  // Create an object to store the mood counts for each timeframe
  const correlations = {};
  for (let i = 0; i < timeframes.length; i++) {
    const timeframe = timeframes[i];
    correlations[timeframe] = {};
  }

  // Loop through the data
  for (let i = 0; i < data.length; i++) {
    const subtasks = data[i].subtasks;

    // Loop through the subtasks
    for (let j = 0; j < subtasks.length; j++) {
      const subtask = subtasks[j];

      // Check if the subtask is completed
      if (subtask.completed) {
        const time = subtask.timeOfCompletion;
        const mood = subtask.moodOnCompletion;

        let timeframe;

        // Determine the timeframe based on the hour of completion
        const hour = parseInt(time.split(":")[0]);

        if (hour >= 5 && hour < 12) {
          timeframe = "morning";
        } else if (hour >= 12 && hour < 17) {
          timeframe = "afternoon";
        } else if (hour >= 17 && hour < 21) {
          timeframe = "evening";
        } else {
          timeframe = "night";
        }
        // Check if the mood exists in
        // the correlations object for the given timeframe
        if (!correlations[timeframe][mood]) {
          // If not, initialize it with a count of 1
          correlations[timeframe][mood] = 1;
        } else {
          // If it exists, increment the count
          correlations[timeframe][mood]++;
        }
      }
    }
  }
  // Create an object to store the most
  // commonly associated mood for each timeframe
  const mostCommonMoods = {};
  for (let i = 0; i < timeframes.length; i++) {
    const timeframe = timeframes[i];
    const moodCounts = correlations[timeframe];

    // Find the mood with the maximum count
    let maxCount = 0;
    let mostCommonMood = null;

    const moods = Object.keys(moodCounts);
    for (let j = 0; j < moods.length; j++) {
      const mood = moods[j];
      const count = moodCounts[mood];
      if (count > maxCount) {
        maxCount = count;
        mostCommonMood = mood;
      }
    }

    // Assign the most commonly associated mood for the timeframe
    mostCommonMoods[timeframe] = mostCommonMood;
  }

  return mostCommonMoods;
};
exports.welcomeEmail = functions.auth.user().onCreate((user) => {
  admin
      .firestore()
      .collection("mail")
      .add({
        to: ["smithkevin1100@gmail.com", user.email],
        message: {
          subject: "Hello from Firebase!",
          html: "This is an <code>HTML</code> email body.",
        },
      });
});

exports.getAllDataFromCollection = functions.https
    .onRequest(async (req, res) => {
      try {
        // Get a reference to the collection
        const collectionRef = admin.firestore().collection("users");

        // Get all documents in the collection
        const snapshot = await collectionRef.get();

        // Extract the data from each document
        const data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });

        // Send the data as a response
        res.json(data);
        return data;
      } catch (error) {
        console.error("Error getting data from collection:", error);
        res.status(500).send("Internal Server Error");
      }
    });
// write an ansync onRun function that will run every tuesday at 4:45pm
exports.timeBased = functions.region("europe-west1").pubsub
    .schedule("every Wednesday 20:00")
    .onRun(async (context) => {
      const collectionRef = db.collection("users");
      let userData = [];
      userData = [];
      // Fetch all documents in the collection
      const testGet = exports.getAllDataFromCollection();
      const allInfo = collectionRef.get()
          .then((snapshot) => {
          // Process each document
            snapshot.forEach((doc) => {
            // Access the document data
              userData.push("doc.data()");
              // ... process the data as needed
            });
          })
          .then(() => {
            admin
                .firestore()
                .collection("mail")
                .add({
                  to: "smithkevin1100@gmail.com",
                  message: {
                    subject: "15th Email Test",
                    html: `Why Not Working???? ${userData.length}, 
                    ${JSON.stringify(userData)},
                    ${allInfo}},
                    ${testGet.toString()}}`,
                  },
                });
          })
          .catch((error) => {
            admin
                .firestore()
                .collection("mail")
                .add({
                  to: "smithkevin1100@gmail.com",
                  message: {
                    subject: "Error in 13th Email Test",
                    html: error,
                  },
                });
          });
      /* const batch = admin.firestore().batch();
      users.forEach((user) => {
        const docRef = admin.firestore().collection("mail").doc();
        batch.set(docRef, {
          to: user.email,
          message: {
            subject: "Hello from Firebase!",
            html: "This is an <code>HTML</code> email body.",
          },
        });
      });
      await batch.commit();*/
    });
exports.sendEmailToUsers = functions.pubsub
    .schedule("every sunday 12:00")
    .timeZone("Etc/GMT")
    .onRun(async (context) => {
      try {
        // Fetch all users from Firestore
        const users = await admin.firestore().collection("users").get();
        const userData = [];
        const emails = [];
        // Collect user emails
        users.forEach((userSnapshot) => {
          /* console.log(`Snapshot is: ${JSON.stringify(userSnapshot)}`);
          console.log(`Email is: ${userSnapshot.email}`);
          console.log(`Email2 is: ${userSnapshot.data().email}`);
          console.log(`Data is: ${JSON.stringify(userSnapshot.data())}`); */
          // const userData = userSnapshot.data();
          emails.push(userSnapshot.data().email);
          userData.push(userSnapshot.data());
        });
        // console.log(`Email Array Is: ${emails}`);
        // console.log(`userData Array Is: ${userData}`);
        // Trigger the "Trigger Email from Firestore" extension
        userData.forEach(async (user) => {
          const userTasks = await admin.firestore()
              .collection(`users/${user.uid}/todos`).get();
          /* console.log(`User Tasks are: ${userTasks}`);
          console.log(`Testo Pesto Hey Email Presto: ${user.email}`);
          console.log(`Testo Pesto Hey UID Presto: ${user.uid}`); */
          const todoOne = [];
          userTasks.forEach((task) => {
            todoOne.push(task.data());
          });
          /* const returnTable = () => {
            let table = "";
            console.log(`Type of todoOne is: ${typeof todoOne.subtasks}`);
            console.log(`Subtasks: ${todoOne.subtasks}`);
            todoOne.forEach((task) => {
              table += `<emphasis><tr style="border: 1px solid black;">
              <td>${task.title}</td>
              <td>${task.completed}</td>
              <td>${task.moodOnCompletion}</td>
              <td>${task.timeOfCompletion}</td>
              </tr></emphasis>`;
              if (task.subtasks) {
                task.subtasks.forEach((subtask) => {
                  table += `<tr style="border: 1px solid black;">
                  <td>${subtask.title}</td>
                  <td>${subtask.completed}</td>
                  <td>${subtask.moodOnCompletion}</td>
                  <td>${subtask.timeOfCompletion}</td>
                  </tr>`;
                });
              } else {
                table += `<tr style="border: 1px solid black;">
                <td>No Subtasks</td>
                <td>No Subtasks</td>
                <td>No Subtasks</td>
                <td>No Subtasks</td>
                </tr>`;
              }
            });
            return table;
          }; */
          const info = findCorrelationsWithTimeframes(todoOne);
          let infoString = "";
          if (info) {
            if (info.morning !== null) {
              infoString += `in the <u>Morning</u>, you 
              tend to rate yourself as 
              feeling <b>${info["morning"]}.</b>`;
            }
            if (info.afternoon !== null) {
              infoString += `In the <u>Afternoon</u>, you 
              tend to rate yourself as 
              feeling <b>${info["afternoon"]}.</b>`;
            }
            if (info.evening !== null) {
              infoString += `In the <u>Evening</u>, you 
              tend to rate yourself as 
              feeling <b>${info["evening"]}.</b>`;
            }
            if (info.night !== null) {
              infoString += `At <u>Night</u>, you 
              tend to rate yourself as 
              feeling <b>${info["night"]}.</b>`;
            }
          }
          admin
              .firestore()
              .collection("mail")
              .add({
                to: user.email.toString(),
                message: {
                  subject: "Weekly Analysis Email",
                  html: `<!doctype html>
                  <html>
                    <head>
                      <meta name="viewport" 
                      content="width=device-width, initial-scale=1.0">
                      <meta http-equiv="Content-Type" 
                      content="text/html; charset=UTF-8">
                      <title>Simple Transactional Email</title>
                      <style>
                  @media only screen and (max-width: 620px) {
                    table.body h1 {
                      font-size: 28px !important;
                      margin-bottom: 10px !important;
                    }
                  
                    table.body p,
                  table.body ul,
                  table.body ol,
                  table.body td,
                  table.body span,
                  table.body a {
                      font-size: 16px !important;
                      color: white !important;
                    }
                  
                    table.body .wrapper,
                  table.body .article {
                      padding: 10px !important;
                    }
                  
                    table.body .content {
                      padding: 0 !important;
                    }
                  
                    table.body .container {
                      padding: 0 !important;
                      width: 100% !important;
                    }
                  
                    table.body .main {
                      border-left-width: 0 !important;
                      border-radius: 0 !important;
                      border-right-width: 0 !important;
                    }
                  
                    table.body .btn table {
                      width: 100% !important;
                    }
                  
                    table.body .btn a {
                      width: 100% !important;
                    }
                  
                    table.body .img-responsive {
                      height: auto !important;
                      max-width: 100% !important;
                      width: auto !important;
                    }
                  }
                  @media all {
                    .ExternalClass {
                      width: 100%;
                    }
                  
                    .ExternalClass,
                  .ExternalClass p,
                  .ExternalClass span,
                  .ExternalClass font,
                  .ExternalClass td,
                  .ExternalClass div {
                      line-height: 100%;
                    }
                  
                    .apple-link a {
                      color: inherit !important;
                      font-family: inherit !important;
                      font-size: inherit !important;
                      font-weight: inherit !important;
                      line-height: inherit !important;
                      text-decoration: none !important;
                    }
                  
                    #MessageViewBody a {
                      color: inherit;
                      text-decoration: none;
                      font-size: inherit;
                      font-family: inherit;
                      font-weight: inherit;
                      line-height: inherit;
                    }
                  
                    .btn-primary table td:hover {
                      background-color: #e53170 !important;
                    }
                  
                    .btn-primary a:hover {
                      background-color: #e53170 !important;
                      border-color: none !important;
                    }
                  }
                  </style>
                    </head>
                    <body style="background-color: #0f0e17; 
                    font-family: sans-serif; font-size: 14px; 
                    line-height: 1.4; margin: 0; padding: 0; 
                    -ms-text-size-adjust: 100%; 
                    -webkit-text-size-adjust: 100%;">
                      <table role="presentation" border="0" 
                      cellpadding="0" cellspacing="0" class="body" 
                      style="border-collapse: separate; mso-table-lspace: 0pt; 
                      mso-table-rspace: 0pt; 
                      background-color: #0f0e17; width: 100%;" 
                      width="100%" bgcolor="#0f0e17">
                        <tr>
                          <td 
                          style="font-family: sans-serif; font-size: 14px; 
                          vertical-align: top;" valign="top">&nbsp;</td>
                          <td class="container" 
                          style="font-family: sans-serif; font-size: 14px; 
                          vertical-align: top; display: block; 
                          max-width: 580px; padding: 10px; width: 580px; 
                          margin: 0 auto;" width="580" valign="top">
                            <div class="content" 
                            style="box-sizing: border-box; display: block; 
                            margin: 0 auto; max-width: 580px; padding: 10px;">
                  
                              <!-- START CENTERED WHITE CONTAINER -->
                              <table role="presentation" class="main" 
                              style="border-collapse: separate; 
                              mso-table-lspace: 0pt; mso-table-rspace: 0pt; 
                              background: #fffffe; border-radius: 3px; 
                              width: 100%;" width="100%">
                  
                                <!-- START MAIN CONTENT AREA -->
                                <tr>
                                  <td class="wrapper" 
                                  style="font-family: sans-serif; 
                                  font-size: 14px; vertical-align: top; 
                                  box-sizing: border-box; padding: 20px;" 
                                  valign="top">
                                    <table 
                                    role="presentation" border="0" 
                                    cellpadding="0" cellspacing="0" 
                                    style="border-collapse: separate; 
                                    mso-table-lspace: 0pt; 
                                    mso-table-rspace: 0pt; 
                                    width: 100%;" width="100%">
                                      <tr>
                                        <td 
                                        style="font-family: sans-serif; 
                                        font-size: 14px; vertical-align: top;" 
                                        valign="top">
                                          <p 
                                          style="font-family: sans-serif; 
                                          font-size: 14px; font-weight: normal; 
                                          margin: 0; margin-bottom: 15px;">
                                          Hi there,</p>
                                          <p> 
                                          Thank you for participating in 
                                          our study! This is your weekly 
                                          analysis email where we provide 
                                          you with a summary of the data 
                                          you have submitted during the 
                                          week. Just a reminder that all 
                                          of the data you submitted is 
                                          100% confidential and will not 
                                          be shared with anyone, not even 
                                          the researchers. Upon the 
                                          completion of the study, 
                                          all of the data will be deleted.
                                          </p>
                                          <p>
                                          What we have noticed is that: 
                                          in the ${infoString}
                                          </p>
                                          <p> From this information, 
                                          we hope that you can get 
                                          some kind of insight. 
                                          Perhaps this is all info 
                                          you felt you already knew, 
                                          or maybe it is something 
                                          you didn't realize. 
                                          Either way, we hope 
                                          that this information 
                                          can help you in some way. </p>
                                         <p> To keep adding data to the 
                                         app, simply click the button 
                                         below. </p>
                                          <table role="presentation" 
                                          border="0" cellpadding="0" 
                                          cellspacing="0" 
                                          class="btn btn-primary" 
                                          style="border-collapse: separate; 
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt; 
                                          box-sizing: border-box; 
                                          width: 100%;" width="100%">
                                            <tbody>
                                              <tr>
                                                <td align="left" 
                                                style="font-family: sans-serif; 
                                                font-size: 14px; 
                                                vertical-align: top; 
                                                padding-bottom: 15px;" 
                                                valign="top">
                                                  <table 
                                                  role="presentation" 
                                                  border="0" 
                                                  cellpadding="0" 
                                                  cellspacing="0" 
                                                  style="
                                                  border-collapse:separate;
                                                  mso-table-lspace: 0pt; 
                                                  mso-table-rspace: 0pt; 
                                                  width: auto;">
                                                    <tbody>
                                                      <tr>
                                                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" valign="top" align="center" bgcolor="#3498db"> <a href="https://digital-artefact-madh.vercel.app/" target="_blank" style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #ff8906; border-color: none; color: #ffffff;">Open The App</a> </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          <p>
                                          Thank you again for
                                          participating in our study!
                                          </p>
                                          <p 
                                          style="font-family: sans-serif; 
                                          font-size: 14px; font-weight: normal; 
                                          margin: 0; margin-bottom: 15px;">
                                          This is a really simple email 
                                          template. Its sole purpose is 
                                          to get the recipient to click 
                                          the button with no distractions.</p>
                                          <p 
                                          style="font-family: sans-serif; 
                                          font-size: 14px; font-weight: normal; 
                                          margin: 0; margin-bottom: 15px;">
                                          Good luck! Hope it works.</p>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                  
                              <!-- END MAIN CONTENT AREA -->
                              </table>
                              <!-- END CENTERED WHITE CONTAINER -->
                              <!-- START FOOTER -->
                              <div class="footer" 
                              style="clear: both; 
                              margin-top: 10px; text-align: center; 
                              width: 100%;">
                                <table role="presentation"
                                 border="0" cellpadding="0" 
                                 cellspacing="0" 
                                 style="border-collapse: separate;
                                  mso-table-lspace: 0pt; 
                                  mso-table-rspace: 0pt; 
                                  width: 100%;" width="100%">
                                  <tr>
                                    <td class="content-block" 
                                    style="font-family: sans-serif; 
                                    vertical-align: top; padding-bottom: 10px; 
                                    padding-top: 10px; color: white; 
                                    font-size: 12px; text-align: center;" 
                                    valign="top" align="center">
                                      <br> 
                                      Having any issues? 
                                      <a href="mailto:smithkevin1100@gmail.com" 
                                      style="text-decoration: underline; 
                                      color: white; font-size: 12px; 
                                      text-align: center;">Contact Us.</a>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!-- END FOOTER -->
                  
                            </div>
                          </td>
                          <td 
                          style="font-family: sans-serif; 
                          font-size: 14px; 
                          vertical-align: top;" 
                          valign="top">&nbsp;</td>
                        </tr>
                      </table>
                    </body>
                  </html>`,
                },
              });
        });
        return null; // Return null or a promise to indicate completion
      } catch (error) {
        console.error("Error retrieving users:", error);
        return null;
      }
    });
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  admin
      .firestore()
      .document(`users/${user.uid}`)
      .update({
        email: user.email,
        uid: user.uid,
        displayName: user.displayName,
      });
  admin
      .firestore()
      .collection("mail")
      .add({
        to: user.email.toString(),
        message: {
          subject: "Welcome!",
          html: `<!doctype html>
                  <html>
                    <head>
                      <meta name="viewport" 
                      content="width=device-width, initial-scale=1.0">
                      <meta http-equiv="Content-Type" 
                      content="text/html; charset=UTF-8">
                      <title>Simple Transactional Email</title>
                      <style>
                  @media only screen and (max-width: 620px) {
                    table.body h1 {
                      font-size: 28px !important;
                      margin-bottom: 10px !important;
                    }
                  
                    table.body p,
                  table.body ul,
                  table.body ol,
                  table.body td,
                  table.body span,
                  table.body a {
                      font-size: 16px !important;
                      color: white !important;
                    }
                  
                    table.body .wrapper,
                  table.body .article {
                      padding: 10px !important;
                    }
                  
                    table.body .content {
                      padding: 0 !important;
                    }
                  
                    table.body .container {
                      padding: 0 !important;
                      width: 100% !important;
                    }
                  
                    table.body .main {
                      border-left-width: 0 !important;
                      border-radius: 0 !important;
                      border-right-width: 0 !important;
                    }
                  
                    table.body .btn table {
                      width: 100% !important;
                    }
                  
                    table.body .btn a {
                      width: 100% !important;
                    }
                  
                    table.body .img-responsive {
                      height: auto !important;
                      max-width: 100% !important;
                      width: auto !important;
                    }
                  }
                  @media all {
                    .ExternalClass {
                      width: 100%;
                    }
                  
                    .ExternalClass,
                  .ExternalClass p,
                  .ExternalClass span,
                  .ExternalClass font,
                  .ExternalClass td,
                  .ExternalClass div {
                      line-height: 100%;
                    }
                  
                    .apple-link a {
                      color: inherit !important;
                      font-family: inherit !important;
                      font-size: inherit !important;
                      font-weight: inherit !important;
                      line-height: inherit !important;
                      text-decoration: none !important;
                    }
                  
                    #MessageViewBody a {
                      color: inherit;
                      text-decoration: none;
                      font-size: inherit;
                      font-family: inherit;
                      font-weight: inherit;
                      line-height: inherit;
                    }
                  
                    .btn-primary table td:hover {
                      background-color: #e53170 !important;
                    }
                  
                    .btn-primary a:hover {
                      background-color: #e53170 !important;
                      border-color: none !important;
                    }
                  }
                  </style>
                    </head>
                    <body style="background-color: #0f0e17; 
                    font-family: sans-serif; font-size: 14px; 
                    line-height: 1.4; margin: 0; padding: 0; 
                    -ms-text-size-adjust: 100%; 
                    -webkit-text-size-adjust: 100%;">
                      <table role="presentation" border="0" 
                      cellpadding="0" cellspacing="0" class="body" 
                      style="border-collapse: separate; mso-table-lspace: 0pt; 
                      mso-table-rspace: 0pt; 
                      background-color: #0f0e17; width: 100%;" 
                      width="100%" bgcolor="#0f0e17">
                        <tr>
                          <td 
                          style="font-family: sans-serif; font-size: 14px; 
                          vertical-align: top;" valign="top">&nbsp;</td>
                          <td class="container" 
                          style="font-family: sans-serif; font-size: 14px; 
                          vertical-align: top; display: block; 
                          max-width: 580px; padding: 10px; width: 580px; 
                          margin: 0 auto;" width="580" valign="top">
                            <div class="content" 
                            style="box-sizing: border-box; display: block; 
                            margin: 0 auto; max-width: 580px; padding: 10px;">
                  
                              <!-- START CENTERED WHITE CONTAINER -->
                              <table role="presentation" class="main" 
                              style="border-collapse: separate; 
                              mso-table-lspace: 0pt; mso-table-rspace: 0pt; 
                              background: #fffffe; border-radius: 3px; 
                              width: 100%;" width="100%">
                  
                                <!-- START MAIN CONTENT AREA -->
                                <tr>
                                  <td class="wrapper" 
                                  style="font-family: sans-serif; 
                                  font-size: 14px; vertical-align: top; 
                                  box-sizing: border-box; padding: 20px;" 
                                  valign="top">
                                    <table 
                                    role="presentation" border="0" 
                                    cellpadding="0" cellspacing="0" 
                                    style="border-collapse: separate; 
                                    mso-table-lspace: 0pt; 
                                    mso-table-rspace: 0pt; 
                                    width: 100%;" width="100%">
                                      <tr>
                                        <td 
                                        style="font-family: sans-serif; 
                                        font-size: 14px; vertical-align: top;" 
                                        valign="top">
                                          <p 
                                          style="font-family: sans-serif; 
                                          font-size: 14px; font-weight: normal; 
                                          margin: 0; margin-bottom: 15px;">
                                          Hi, ${user.displayName}</p>
                                          <p> 
                                          Thank you for participating in 
                                          our study! This is your weekly 
                                          analysis email where we provide 
                                          you with a summary of the data 
                                          you have submitted during the 
                                          week. Just a reminder that all 
                                          of the data you submitted is 
                                          100% confidential and will not 
                                          be shared with anyone, not even 
                                          the researchers. Upon the 
                                          completion of the study, 
                                          all of the data will be deleted.
                                          </p>
                                          <p> From this information, 
                                          we hope that you can get 
                                          some kind of insight. 
                                          Perhaps this is all info 
                                          you felt you already knew, 
                                          or maybe it is something 
                                          you didn't realize. 
                                          Either way, we hope 
                                          that this information 
                                          can help you in some way. </p>
                                         <p> To keep adding data to the 
                                         app, simply click the button 
                                         below. </p>
                                          <table role="presentation" 
                                          border="0" cellpadding="0" 
                                          cellspacing="0" 
                                          class="btn btn-primary" 
                                          style="border-collapse: separate; 
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt; 
                                          box-sizing: border-box; 
                                          width: 100%;" width="100%">
                                            <tbody>
                                              <tr>
                                                <td align="left" 
                                                style="font-family: sans-serif; 
                                                font-size: 14px; 
                                                vertical-align: top; 
                                                padding-bottom: 15px;" 
                                                valign="top">
                                                  <table 
                                                  role="presentation" 
                                                  border="0" 
                                                  cellpadding="0" 
                                                  cellspacing="0" 
                                                  style="
                                                  border-collapse:separate;
                                                  mso-table-lspace: 0pt; 
                                                  mso-table-rspace: 0pt; 
                                                  width: auto;">
                                                    <tbody>
                                                      <tr>
                                                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" valign="top" align="center" bgcolor="#3498db"> <a href="https://digital-artefact-madh.vercel.app/" target="_blank" style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #ff8906; border-color: none; color: #ffffff;">Open The App</a> </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          <p>
                                          Thank you again for
                                          participating in our study!
                                          </p>
                                          <p 
                                          style="font-family: sans-serif; 
                                          font-size: 14px; font-weight: normal; 
                                          margin: 0; margin-bottom: 15px;">
                                          This is a really simple email 
                                          template. Its sole purpose is 
                                          to get the recipient to click 
                                          the button with no distractions.</p>
                                          <p 
                                          style="font-family: sans-serif; 
                                          font-size: 14px; font-weight: normal; 
                                          margin: 0; margin-bottom: 15px;">
                                          Good luck! Hope it works.</p>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                  
                              <!-- END MAIN CONTENT AREA -->
                              </table>
                              <!-- END CENTERED WHITE CONTAINER -->
                              <!-- START FOOTER -->
                              <div class="footer" 
                              style="clear: both; 
                              margin-top: 10px; text-align: center; 
                              width: 100%;">
                                <table role="presentation"
                                 border="0" cellpadding="0" 
                                 cellspacing="0" 
                                 style="border-collapse: separate;
                                  mso-table-lspace: 0pt; 
                                  mso-table-rspace: 0pt; 
                                  width: 100%;" width="100%">
                                  <tr>
                                    <td class="content-block" 
                                    style="font-family: sans-serif; 
                                    vertical-align: top; padding-bottom: 10px; 
                                    padding-top: 10px; color: white; 
                                    font-size: 12px; text-align: center;" 
                                    valign="top" align="center">
                                      <br> 
                                      Having any issues? 
                                      <a href="mailto:smithkevin1100@gmail.com" 
                                      style="text-decoration: underline; 
                                      color: white; font-size: 12px; 
                                      text-align: center;">Contact Us.</a>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <!-- END FOOTER -->
                  
                            </div>
                          </td>
                          <td 
                          style="font-family: sans-serif; 
                          font-size: 14px; 
                          vertical-align: top;" 
                          valign="top">&nbsp;</td>
                        </tr>
                      </table>
                    </body>
                  </html>`,
        },
      });
});
