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
        router.replace("/screens/login"); 
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
        setUser(currentUser); 
      }
    });

    return unsubscribe; 
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      router.replace("/screens/login"); 
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
    backgroundColor: "#FFF8DC", 
    padding: 20,
  },
  logoText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#F4A300", 
    marginBottom: 20,
    fontFamily: "Cochin",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#333", 
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#333333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutButtonText: {
    color: "#F4A300", 
    fontWeight: "bold",
    fontSize: 16,
  },
});
