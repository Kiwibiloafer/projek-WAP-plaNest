import { auth, db } from './firebase-config.js';
import {
  ref,
  onValue,
  remove,
  set,
  get,
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

const notesContainer = document.getElementById('notes-container');
const tagList = document.getElementById('tag-list');
let currentUserId = null;
let currentTag = null;
let cardNoteTemplate = "";

// Load template card-note.html saat awal
fetch("card-note.html")
  .then(res => res.text())
  .then(html => {
    cardNoteTemplate = html;
  });

// Cek apakah user login
auth.onAuthStateChanged(user => {
  if (user) {
    currentUserId = user.uid;
    console.log("test");
    console.log("Logged in as:", currentUserId);
    loadNotes();
  } else {
    window.location.href = "login.html";
  }
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
  auth.signOut();
});

// Load catatan dari Firebase
function loadNotes() {
  const notesRef = ref(db, 'notes');
  onValue(notesRef, snapshot => {
    notesContainer.innerHTML = "";

    if (!snapshot.exists()) {
      notesContainer.innerHTML = "<p class='text-muted'>No notes found.</p>";
      return;
    }

    const userNotes = [];
    snapshot.forEach(child => {
      const data = child.val();
      if (data.user_id === currentUserId) {
        userNotes.push({ id: child.key, ...data });
      }
    });

    loadTags();

    userNotes.forEach(note => {
      if (!currentTag || (note.tags && note.tags.includes(currentTag))) {
        const card = createNoteCard(note.id, note);
        notesContainer.appendChild(card);
      }
    });
  });
}

// Buat card dari template
function createNoteCard(id, data) {
  const card = document.createElement("div");
  card.className = "card p-3 mb-3 note-card";
  card.style.cursor = "pointer";

  const tagBadges = (data.tags || []).map(tag => `<span class="badge bg-info text-dark me-1">${tag}</span>`).join(" ");

  let html = cardNoteTemplate
    .replace("{{title}}", data.title)
    .replace("{{notes}}", data.notes)
    .replace("{{tags}}", tagBadges)
    .replace("{{last_modified}}", data.last_modified)
    .replaceAll("{{note_id}}", id);

  card.innerHTML = html;

  // Klik card (selain tombol delete)
  card.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    const noteToSave = { id, ...data };
    localStorage.setItem("selectedNote", JSON.stringify(noteToSave));
    window.location.href = "note.html";
  });

  return card;
}

// Hapus catatan
window.deleteNote = function(id) {
  if (confirm("Delete this note?")) {
    remove(ref(db, 'notes/' + id));
  }
};

// Load tag dari Firebase
function loadTags() {
  const tagSet = new Set();
  tagList.innerHTML = "";

  const userTagsRef = ref(db, `tags/${currentUserId}`);
  get(userTagsRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        Object.keys(snapshot.val()).forEach(tag => tagSet.add(tag));
      }

      const allBtn = document.createElement("button");
      allBtn.className = "btn btn-secondary btn-sm m-1";
      allBtn.innerText = "All Notes";
      allBtn.addEventListener("click", () => {
        currentTag = null;
        document.getElementById("filter-tag").innerText = "- All -";
        loadNotes();
      });
      tagList.appendChild(allBtn);

      tagSet.forEach(tag => {
        const tagBtn = document.createElement("button");
        tagBtn.className = "btn btn-outline-primary btn-sm m-1";
        tagBtn.innerText = tag;
        tagBtn.addEventListener("click", () => {
          currentTag = tag;
          document.getElementById("filter-tag").innerText = tag;
          loadNotes();
        });
        tagList.appendChild(tagBtn);
      });
    })
    .catch(error => {
      console.error("Gagal memuat tags:", error);
    });
}

// Navigasi ke halaman membuat note baru
document.getElementById("new-note").addEventListener("click", () => {
  localStorage.removeItem("selectedNote"); // pastikan tidak bawa data lama
  window.location.href = "note.html";
});

// Load dan tampilkan popup tag
document.getElementById("new-tag").addEventListener("click", async () => {
  const container = document.getElementById("tag-popup-container");
  try {
    const res = await fetch("tag-popup.html");
    const html = await res.text();
    container.innerHTML = html;
    console.log("Popup tag loaded");

    const tagInput = document.getElementById("tag-name");
    const cancelBtn = document.getElementById("cancel-tag");
    const saveBtn = document.getElementById("save-tag");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        container.innerHTML = "";
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        const tagName = tagInput.value.trim();
        if (!tagName) {
          alert("Please enter a tag name.");
          return;
        }

        if (!currentUserId) {
          console.error("User not logged in");
          return;
        }

        try {
          const tagRef = ref(db, `tags/${currentUserId}/${tagName}`);
          await set(tagRef, true);
          console.log("Tag saved:", tagName);
          container.innerHTML = "";
          loadNotes();
        } catch (error) {
          console.error("Gagal menyimpan tag:", error);
          alert("Failed to save tag.");
        }
      });
    }

  } catch (error) {
    console.error("Gagal memuat tag-popup.html", error);
  }
});
