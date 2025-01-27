// Import the functions you need from the Firebase SDKs
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  Auth,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPkHspISQTDjLbui8bb1i_d-LRnytOWCA",
  authDomain: "ttots-trashtotreasures.firebaseapp.com",
  projectId: "ttots-trashtotreasures",
  storageBucket: "ttots-trashtotreasures.appspot.com",
  messagingSenderId: "461462611158",
  appId: "1:461462611158:web:0f1d18c27540ed40945577",
  // measurementId removed unless you're using Analytics
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Authentication with React Native persistence
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore and Storage
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Export the initialized app if needed elsewhere
export default app;
