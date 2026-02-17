let books = JSON.parse(localStorage.getItem("books")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let stats = JSON.parse(localStorage.getItem("stats")) || {};

const genreClassMap = {
    horror: "genre-horror",
    romance: "genre-romance",
    romantasy: "genre-romantasy",
    thriller: "genre-thriller",
    nonfiction: "genre-nonfiction",
    femlit: "genre-femlit",
    other: "genre-other"
};

document.getElementById("addBtn").addEventListener("click", addBook);
document.getElementById("pickBtn").addEventListener("click", pickRandom);
document.getElementById("saveBtn").addEventListener("click", saveBooks);
document.getElementById("clearBtn").addEventListener("click", clearAll);

function saveData() {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("stats", JSON.stringify(stats));
}

function saveBooks() {
    saveData();
    alert("✨ The spell has been preserved.");
}

function clearAll() {
    if (!confirm("Your tomes will be released into the ether. Proceed?")) return;

    books = [];
    history = [];
    stats = {};
    saveData();

    renderBookList();
    renderHistory();
    renderStats();
    document.getElementById("result").textContent = "";
}

function addBook() {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.getElementById("genre").value;

    if (!title || !author || !genre) return;

    books.push({ title, author, genre });
    saveData();
    renderBookList();

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").value = "";
}

function deleteBook(index) {
    books.splice(index, 1);
    saveData();
    renderBookList();
}

function renderBookList() {
    const list = document.getElementById("bookList");
    list.innerHTML = "";

    books.forEach((book, index) => {
        const div = document.createElement("div");
        div.className = `book-item ${genreClassMap[book.genre]}`;

        div.innerHTML = `
            <span><strong>${book.title}</strong> – ${book.author}</span>
            <button onclick="deleteBook(${index})">🗑</button>
        `;

        list.appendChild(div);
    });
}

function pickRandom() {
    if (books.length === 0) return;

    const items = document.querySelectorAll(".book-item");
    let index = 0;
    let steps = Math.floor(Math.random() * 6) + 15;

    items.forEach(i => i.classList.remove("active"));

    function step() {
        items.forEach(i => i.classList.remove("active"));
        items[index].classList.add("active");

        index = (index + 1) % items.length;
        steps--;

        if (steps > 0) {
            setTimeout(step, 140 + (5 - steps) * 60);
        } else {
            const chosenIndex = (index - 1 + items.length) % items.length;
            const chosen = books[chosenIndex];

            document.getElementById("result").textContent =
                `✨ The oracle reveals: "${chosen.title}" by ${chosen.author}`;

            history.unshift(chosen);
            history = history.slice(0, 10);

            stats[chosen.genre] = (stats[chosen.genre] || 0) + 1;

            saveData();
            renderHistory();
            renderStats();
        }
    }

    step();
}

function renderHistory() {
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    history.forEach(book => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.textContent =
            `"${book.title}" by ${book.author} (${book.genre})`;
        list.appendChild(div);
    });
}

function renderStats() {
    const list = document.getElementById("statsList");
    list.innerHTML = "";

    Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .forEach(([genre, count]) => {
            const div = document.createElement("div");
            div.className = "stats-item";
            div.textContent = `${genre} — ${count} summonings`;
            list.appendChild(div);
        });
}

// Initial render
renderBookList();
renderHistory();
renderStats();
