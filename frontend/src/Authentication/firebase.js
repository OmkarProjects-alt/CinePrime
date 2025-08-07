import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider , FacebookAuthProvider } from "firebase/auth";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB5eE-cnT4Dt4NkiDpLe-VxtBobRRbuODw",
  authDomain: "cineprime-e6fa7.firebaseapp.com",
  projectId: "cineprime-e6fa7",
  storageBucket: "cineprime-e6fa7.appspot.com",
  messagingSenderId: "259033433461",
  appId: "1:259033433461:web:3e8c0e62ce6d8e0c54bf3c",
  measurementId: "G-XSR9JN76LD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
const facebookProvider = new FacebookAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider , facebookProvider , createUserWithEmailAndPassword,
  db,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
};
