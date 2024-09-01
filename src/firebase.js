import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFFfdTAUcMBqHmpzonGlCktiuK8JBbDQk",
  authDomain: "todo-app-be22c.firebaseapp.com",
  projectId: "todo-app-be22c",
  storageBucket: "todo-app-be22c.appspot.com",
  messagingSenderId: "587797810377",
  appId: "1:587797810377:web:2a1bda08f5be75926a1118",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
