import { auth, db } from './firebase-config.js';
import {
  ref,
  set,
  get,
  child
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save-tag");
  const cancelBtn = document.getElementById("cancel-tag");
  const tagInput = document.getElementById("new-tag-input");

  saveBtn.addEventListener("click", async () => {
    const newTag = tagInput.value.trim();
    if (newTag === "") {
      alert("Tag tidak boleh kosong.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("User belum login.");
      return;
    }

    const userId = user.uid;
    const userTagsRef = ref(db, `tags/${userId}`);
    const tagRef = child(userTagsRef, newTag); // Simpan dengan nama tag sebagai key

    try {
      const snapshot = await get(tagRef);
      if (snapshot.exists()) {
        alert("Tag sudah ada.");
      } else {
        await set(tagRef, newTag); // key dan value sama: Work: "Work"
        alert("Tag berhasil ditambahkan.");
      }

      // Tutup popup
      document.getElementById("tag-popup-container").innerHTML = "";
    } catch (error) {
      console.error("Gagal menyimpan tag:", error);
      alert("Terjadi kesalahan saat menyimpan tag.");
    }
  });

  cancelBtn.addEventListener("click", () => {
    document.getElementById("tag-popup-container").innerHTML = "";
  });
});
