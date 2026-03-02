import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPUGNzvPTgh7sXFVXEWE2dp1l4SpvVfb8",
  authDomain: "tej-lite.firebaseapp.com",
  projectId: "tej-lite",
  storageBucket: "tej-lite.firebasestorage.app",
  messagingSenderId: "210349569144",
  appId: "1:210349569144:web:a3fa5cf5f9a11522e5a98d",
  measurementId: "G-BWC8EGDCXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };

/*
 * ============================================
 * FIREBASE SETUP INSTRUCTIONS
 * ============================================
 * 
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Add Project" and name it "tej-lite-website"
 * 3. Enable Firestore Database, Authentication, and Storage
 * 4. Copy the config values from Project Settings > General > Your apps
 * 5. Update the environment variables in .env file
 * 
 * ============================================
 * ENVIRONMENT VARIABLES (.env file)
 * ============================================
 * 
 * VITE_FIREBASE_API_KEY=your_actual_api_key
 * VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
 * VITE_FIREBASE_PROJECT_ID=your-project-id
 * VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
 * VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
 * VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
 * 
 * ============================================
 * FIREBASE SERVICES ENABLED
 * ============================================
 * 
 * 1. Firestore Database - For storing products, projects, enquiries, etc.
 * 2. Firebase Storage - For storing images, PDFs, and other files
 * 3. Firebase Authentication - For admin panel login
 * 
 */
