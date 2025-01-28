import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const isEduEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.(edu)$/i.test(email); // Regex for .edu email validation
  };

  const handleRegister = async () => {
    if (!isEduEmail(email)) {
      Alert.alert("Invalid Email", "Please use a .edu email address.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      Alert.alert(
        "Registration Successful",
        `A verification email has been sent to ${user.email}. Please verify your email before logging in.`
      );

      router.push("/screens/login"); // Navigate to LoginScreen
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/screens/login")}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF8DC", // Light yellow background
  },
  title: {
    fontSize: 30, // Slightly larger title
    fontWeight: "bold",
    color: "#F4A300", // Yellowish orange for the title
    marginBottom: 20,
    fontFamily: "Cochin", // Matching font style
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#F4A300", // Yellowish orange border
    borderRadius: 10,
    backgroundColor: "#FFFFFF", // White input background
    color: "#333", // Dark text for readability
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
    paddingVertical: 12,
    backgroundColor: "#333333", // Dark background for the button
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#F4A300", // Yellowish orange text
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    marginTop: 10,
    width: "80%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#F4A300", // Yellowish orange for the back button
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFF8DC", // Light yellow text
    fontWeight: "bold",
    fontSize: 16,
  },
});
