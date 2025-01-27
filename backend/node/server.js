const express = require("express");
const admin = require("firebase-admin");
const path = require("path");

const app = express();
const port = 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require("../adminkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ttots-trashtotreasures-default-rtdb.firebaseio.com",
});

// Middleware to parse incoming JSON requests
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Sample Firebase route
app.get("/firebase", (req, res) => {
  admin
    .database()
    .ref("/some-data")
    .once("value")
    .then(snapshot => {
      res.send(snapshot.val());
    })
    .catch(error => {
      res.status(500).send("Error accessing Firebase: " + error);
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
