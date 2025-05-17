// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyABHj-rZMKhy8NJrZYAg4ucY35S2KTqdTQ",
  authDomain: "planest-b8a65.firebaseapp.com",
  databaseURL: "https://planest-b8a65-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "planest-b8a65",
  storageBucket: "planest-b8a65.firebasestorage.app",
  messagingSenderId: "167720649129",
  appId: "1:167720649129:web:3856831cae1309a40ec4b8",
  measurementId: "G-HHPPJNHN9V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
