import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged, signOut, User, sendEmailVerification } from "firebase/auth";

export default function TabHomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/screens/login"); // Redirect to Login if not authenticated
      } else if (!currentUser.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before accessing the app.",
          [
            {
              text: "Resend Verification Email",
              onPress: async () => {
                try {
                  await sendEmailVerification(currentUser);
                  Alert.alert(
                    "Verification Email Sent",
                    `A verification email has been sent to ${currentUser.email}.`
                  );
                } catch (error: any) {
                  Alert.alert("Error", error.message);
                }
              },
            },
            { text: "Logout", onPress: handleLogout },
          ]
        );
      } else {
        setUser(currentUser); // Set the current user
      }
    });

    return unsubscribe; // Cleanup the subscription
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Log the user out
      router.replace("/screens/login"); // Navigate to Login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>TTOTS</Text>
      <Text style={styles.title}>Welcome, {user.email}!</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8DC", // Light yellow background
    padding: 20,
  },
  logoText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#F4A300", // Yellowish orange
    marginBottom: 20,
    fontFamily: "Cochin",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#333", // Dark contrast
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#333333", // Dark button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutButtonText: {
    color: "#F4A300", // Yellowish orange text
    fontWeight: "bold",
    fontSize: 16,
  },
});
