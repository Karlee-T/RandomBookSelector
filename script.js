//store all the books
const books = [];

//DOM elements
const form = document.getElementById('bookForm');
const randomBtn = document.getElementById('random-btn');
const selectedSection = document.getElementById('selected-book');
const selectedDetails = document.getElementById('selected-details');
const historyList = document.getElementById('history');

//add a book
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElemementById('title').value.trim();
  const author = document.getElemementById('author').value.trim();
  const genre = document.getElemementById('genre').value;

  const book = {title, author, genre};
  books.push(book);

  form.reset();
});

//pick a random book
randomBtn.addEventListener('click', function() {
  if (books.length === 0) {
    alert('add at least one book,fool.');
    return;
  }

  const randomIndex = Math.floor(Math.random() * books.length);
  const book = books[randomIndex];

  displaySelectedBook(book);
  addToHistory(book);
});

//display selected book
function displaySelectedBook(book) {
  selectedSection.className = ' ';
  selectedSection.classList.add(`genre-${book-genre}`);

  selectedDetails.textContent =
    `${book.title} by ${book.author}, (${book.genre})`;

  selectedSection.classList.remove('hidden');
}

//add to history
function addToHistory(book) {
  const date = new Date().toLocaleDateString('en-GB');

  const li = document.createElement('li');
  li.textContent =
    `${date} - ${book.title} by ${book.author}, (${book.genre})`;

  historyList.prepend(li);
}
