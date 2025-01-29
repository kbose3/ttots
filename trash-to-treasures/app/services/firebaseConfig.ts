import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPkHspISQTDjLbui8bb1i_d-LRnytOWCA",
  authDomain: "ttots-trashtotreasures.firebaseapp.com",
  databaseURL: "https://ttots-trashtotreasures-default-rtdb.firebaseio.com",
  projectId: "ttots-trashtotreasures",
  storageBucket: "ttots-trashtotreasures.firebasestorage.app",
  messagingSenderId: "461462611158",
  appId: "1:461462611158:web:0f1d18c27540ed40945577",
  measurementId: "G-5VCP6KBJCZ"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Authentication without any persistence
export const auth: Auth = getAuth(app);

// Initialize Firestore and Storage
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export const firestore: Firestore = getFirestore(app);

// Export the initialized app if needed elsewhere
export default app;
