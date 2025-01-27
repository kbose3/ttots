const admin = require("firebase-admin");
const path = require("path");

// Initialize the Firebase Admin SDK with the service account key JSON file
const serviceAccount = require('./adminkey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ttots-trashtotreasures-default-rtdb.firebaseio.com",
});

module.exports = admin;
