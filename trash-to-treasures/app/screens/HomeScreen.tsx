import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../services/firebaseConfig"; // Correctly import auth from firebaseConfig
import { onAuthStateChanged, signOut, User } from "firebase/auth"; // Import User type

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login"); // Redirect to LoginScreen if not authenticated
      } else {
        setUser(currentUser); // Set the current user
      }
    });

    return unsubscribe; // Cleanup the subscription
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Log the user out
      router.push("/login"); // Navigate to LoginScreen
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.email}!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
