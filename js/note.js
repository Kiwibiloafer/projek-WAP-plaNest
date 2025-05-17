import { auth, db } from './firebase-config.js';
import {
  ref,
  push,
  set,
  onValue,
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("note-title");
  const contentInput = document.getElementById("note-content");
  const form = document.getElementById("note-form");
  const tagContainer = document.getElementById("tag-checkboxes");

  let currentUserId = null;
  let isEditing = false;
  let editingNoteId = null;

  const existingNote = localStorage.getItem("selectedNote");
  let selectedNote = null;

  if (existingNote) {
    try {
      selectedNote = JSON.parse(existingNote);
      isEditing = true;
      editingNoteId = selectedNote.id;
    } catch (e) {
      console.error("Invalid note data in localStorage");
    }
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      currentUserId = user.uid;
      loadTags();

      if (isEditing && selectedNote) {
        titleInput.value = selectedNote.title || "";
        contentInput.value = selectedNote.notes || "";
      }
    } else {
      window.location.href = "login.html";
    }
  });

  // Load tags sebagai checkbox
  function loadTags() {
    const tagsRef = ref(db, 'tags/' + currentUserId);
    onValue(tagsRef, snapshot => {
      tagContainer.innerHTML = "";

      const tags = snapshot.val();
      if (tags) {
        Object.keys(tags).forEach(tagName => {
          const checkbox = document.createElement("div");
          checkbox.className = "form-check";

          const isChecked = selectedNote?.tags?.includes(tagName);

          checkbox.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${tagName}" id="tag-${tagName}" ${isChecked ? "checked" : ""}>
            <label class="form-check-label" for="tag-${tagName}">
              ${tagName}
            </label>
          `;
          tagContainer.appendChild(checkbox);
        });
      }
    });
  }

  // Simpan atau update note
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const notes = contentInput.value.trim();
    const checkedTags = document.querySelectorAll("#tag-checkboxes input[type=checkbox]:checked");
    const selectedTags = Array.from(checkedTags).map(cb => cb.value);
    const now = new Date();

    const noteData = {
      title,
      notes,
      tags: selectedTags,
      last_modified: now.toLocaleString(),
      user_id: currentUserId
    };

    try {
      if (isEditing && editingNoteId) {
        const noteRef = ref(db, `notes/${editingNoteId}`);
        await set(noteRef, noteData);
        alert("Note updated!");
      } else {
        const notesRef = ref(db, "notes");
        await push(notesRef, noteData);
        alert("Note saved!");
      }

      localStorage.removeItem("selectedNote");
      window.location.href = "dashboard.html";

    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
    }
  });
});
