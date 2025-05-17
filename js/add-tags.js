import { auth, db } from './firebase-config.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      const tagsRef = ref(db, 'tags/' + user.uid);

      // Tambahkan tag uji coba
      push(tagsRef, "Personal");
      push(tagsRef, "Work");
      push(tagsRef, "Ideas");

      alert("Dummy tags 'Personal', 'Work', dan 'Ideas' telah ditambahkan!");
    } else {
      alert("Kamu belum login. Silakan login terlebih dahulu.");
      window.location.href = "login.html";
    }
  });
});
