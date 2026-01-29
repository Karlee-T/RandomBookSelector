let books = JSON.parse(localStorage.getItem("books")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let rotation = 0;

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
    drawWheel();
    renderBookList();

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").value = "";
}

function deleteBook(index) {
    books.splice(index, 1);
    saveData();
    drawWheel();
    renderBookList();
}

function drawWheel() {
    const wheel = document.getElementById("wheel-container");
    wheel.innerHTML = "";

    if (books.length === 0) return;

    const sliceAngle = 360 / books.length;

    books.forEach((book, index) => {
        const segment = document.createElement("div");
        segment.className = `segment ${genreClassMap[book.genre]}`;

        const angle = sliceAngle * index;
        segment.style.transform =
            `rotate(${angle}deg) skewY(${90 - sliceAngle}deg)`;

        segment.innerHTML = `
            <div style="transform: skewY(-${90 - sliceAngle}deg) rotate(${sliceAngle / 2}deg);">
                <strong>${book.title}</strong><br>
                <small>${book.author}</small>
            </div>
        `;

        wheel.appendChild(segment);
    });
}

function spinWheel() {
    if (books.length === 0) return;

    const randomIndex = Math.floor(Math.random() * books.length);
    const sliceAngle = 360 / books.length;

    rotation += 360 * 5 + (360 - randomIndex * sliceAngle);
    document.getElementById("wheel-container").style.transform =
        `rotate(${rotation}deg)`;

    const chosen = books[randomIndex];
    document.getElementById("result").textContent =
        `📖 Selected: "${chosen.title}" by ${chosen.author} (${chosen.genre})`;

    history.unshift(chosen);
    history = history.slice(0, 10);
    saveData();
    renderHistory();
}

function renderBookList() {
    const list = document.getElementById("bookList");
    list.innerHTML = "";

    books.forEach((book, index) => {
        const div = document.createElement("div");
        div.className = "book-item";
        div.style.borderLeftColor =
            getComputedStyle(document.documentElement)
            .getPropertyValue(`--${book.genre}`);

        div.classList.add(genreClassMap[book.genre]);

        div.innerHTML = `
            <span><strong>${book.title}</strong> – ${book.author}</span>
            <button onclick="deleteBook(${index})">Delete</button>
        `;

        list.appendChild(div);
    });
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
drawWheel();
renderBookList();
renderHistory();
