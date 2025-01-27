import { Router } from "express";
import admin from "../firebaseAdmin.js"; // Import Firebase Admin SDK

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Validate .edu email
  if (!/^[^\s@]+@[^\s@]+\.(edu)$/i.test(email)) {
    return res.status(400).json({ message: "Only .edu emails are allowed." });
  }

  try {
    // Create a user in Firebase Authentication using admin.auth()
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    res.status(201).json({ user: userRecord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
