const addBtn = document.querySelector("#AddBtn");
const saveFileBtn = document.querySelector("#SaveFile");
const openFileBtn = document.querySelector("#OpenFile");
const fileInput = document.querySelector("#fileInput");
const container = document.querySelector("#Container");

// Possible note colors
const colors = ["yellow", "green", "pink", "blue"];
let colorIndex = 0;

// Save notes to localStorage
const saveNotes = () => {
    const notes = document.querySelectorAll(".note");
    const data = [];

    notes.forEach(note => {
        const title = note.querySelector(".title").value;
        const content = note.querySelector(".content").value;
        const color = [...note.classList].find(c => colors.includes(c));
        if (title.trim() || content.trim()) {
            data.push({ title, content, color });
        }
    });

    localStorage.setItem("notesData", JSON.stringify(data));
};

// Add note
const addNote = (text = "", title = "", color = "") => {
    const note = document.createElement("div");
    note.classList.add("note");

    // Assign color (cycle if not given)
    if (!color) {
        note.classList.add(colors[colorIndex % colors.length]);
        colorIndex++;
    } else {
        note.classList.add(color);
    }

    note.innerHTML = `
        <div class="icons">
            <i class="save fas fa-save" style="color:#00b894" title="Save"></i>
            <i class="trash fas fa-trash" style="color:#d63031" title="Delete"></i>
        </div>
        <div class="title-div">
            <textarea class="title" placeholder="Write title...">${title}</textarea>
        </div>
        <textarea class="content" placeholder="Write your note...">${text}</textarea>
    `;

    // Buttons
    note.querySelector(".trash").addEventListener("click", () => {
        note.remove();
        saveNotes();
    });
    note.querySelector(".save").addEventListener("click", () => {
        saveNotes();
    });

    container.appendChild(note);
    saveNotes();
};

// Load saved notes
function loadNotes() {
    const data = JSON.parse(localStorage.getItem("notesData")) || [];
    data.forEach(note => addNote(note.content, note.title, note.color));
}
loadNotes();

// Add new note
addBtn.addEventListener("click", () => addNote());

// Save notes to JSON file
saveFileBtn.addEventListener("click", () => {
    const data = localStorage.getItem("notesData") || "[]";
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes.json";
    link.click();
});

// Open notes from file
openFileBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            localStorage.setItem("notesData", JSON.stringify(data));
            container.innerHTML = ""; // clear
            data.forEach(note => addNote(note.content, note.title, note.color));
        } catch {
            alert("Invalid file format!");
        }
    };
    reader.readAsText(file);
});
