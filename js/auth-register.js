import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (!email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      alert("Account created successfully!");
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      console.error("Registration error:", error);
      alert(error.message);
    });
});

// Login dengan Google
document.getElementById("google-login").addEventListener("click", function () {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      console.log("Google login successful", result.user);
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert("Google login failed: " + error.message);
    });
});
