import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const isEduEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.(edu)$/i.test(email); // Regex for .edu email validation
  };

  const handleLogin = async () => {
    if (!isEduEmail(email)) {
      Alert.alert("Invalid Email", "Please use a .edu email address.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user's email is verified
      if (!user.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Your email is not verified. Would you like to resend the verification email?",
          [
            {
              text: "Yes",
              onPress: async () => {
                try {
                  await sendEmailVerification(user);
                  Alert.alert(
                    "Verification Email Sent",
                    `A verification email has been sent to ${user.email}. Please check your inbox.`
                  );
                } catch (error: any) {
                  Alert.alert("Error", error.message);
                }
              },
            },
            {
              text: "No",
              onPress: () => {
                // nothing happens just exits
              },
              style: "cancel", // This styles the "No" button as a cancel option
            },
          ]
        );
        return; // Prevent navigation to the Home Screen
      }

      // Successful login with a verified email
      Alert.alert("Login Successful", `Welcome, ${user.email}!`);
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={handleLogin} />
          </View>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <View style={styles.registerButtonContainer}>
            <Button title="Go to Register" onPress={handleRegister} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  footerText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  registerButtonContainer: {
    marginTop: 10,
    width: "100%",
  },
});
