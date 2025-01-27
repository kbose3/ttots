const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("../routes/auth"); // Import the auth routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes); // Add the auth routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
