let books = JSON.parse(localStorage.getItem("books")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

const genreClassMap = {
    horror: "genre-horror",
    romance: "genre-romance",
    romantasy: "genre-romantasy",
    thriller: "genre-thriller",
    nonfiction: "genre-nonfiction",
    femlit: "genre-femlit",
    other: "genre-other"
};

function saveData() {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("history", JSON.stringify(history));
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
            <button onclick="deleteBook(${index})">Delete</button>
        `;

        list.appendChild(div);
    });
}

function pickRandom() {
    if (books.length === 0) return;

    const items = document.querySelectorAll(".book-item");
    let index = 0;
    let steps = Math.floor(Math.random() * 6) + 5; // 5–10 steps
    let delay = 120;

    items.forEach(item => item.classList.remove("active"));

    const interval = setInterval(() => {
        items.forEach(item => item.classList.remove("active"));

        items[index].classList.add("active");

        index = (index + 1) % items.length;
        steps--;

        delay += 35;

        if (steps <= 0) {
            clearInterval(interval);

            const chosenIndex = (index - 1 + items.length) % items.length;
            const chosen = books[chosenIndex];

            document.getElementById("result").textContent =
                `📖 Selected: "${chosen.title}" by ${chosen.author} (${chosen.genre})`;

            history.unshift(chosen);
            history = history.slice(0, 10);
            saveData();
            renderHistory();
        }
    }, delay);
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

// Initial load
renderBookList();
renderHistory();
