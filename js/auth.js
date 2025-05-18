import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { app } from './firebase-config.js';

const auth = getAuth(app);

document.getElementById("back-button").addEventListener("click", () => {
  window.history.back(); // atau window.location.href = "dashboard.html";
});


// Login dengan Email & Password
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log("Login successful", userCredential.user);
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert("Login failed: " + error.message);
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
