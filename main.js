document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('bookForm');
  const searchForm = document.getElementById('searchBook');
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  let books = JSON.parse(localStorage.getItem('books')) || [];

  function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
  }

  function renderBooks() {
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  function createBookElement(book) {
    const bookContainer = document.createElement('div');
    bookContainer.setAttribute('data-bookid', book.id);
    bookContainer.setAttribute('data-testid', 'bookItem');

    bookContainer.innerHTML = `
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
          <p data-testid="bookItemYear">Tahun: ${book.year}</p>
          <div>
              <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
              <button data-testid="bookItemDeleteButton">Hapus Buku</button>
              <button data-testid="bookItemEditButton">Edit Buku</button>
          </div>
      `;

    bookContainer.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener('click', () => toggleBookStatus(book.id));
    bookContainer.querySelector("[data-testid='bookItemDeleteButton']").addEventListener('click', () => deleteBook(book.id));
    bookContainer.querySelector("[data-testid='bookItemEditButton']").addEventListener('click', () => editBook(book.id));

    return bookContainer;
  }

  function addBook(title, author, year, isComplete) {
    const newBook = {
      id: +new Date(),
      title,
      author,
      year: parseInt(year),
      isComplete,
    };
    books.push(newBook);
    saveBooks();
    renderBooks();
  }

  function toggleBookStatus(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks();
    }
  }

  function deleteBook(bookId) {
    books = books.filter((b) => b.id !== bookId);
    saveBooks();
    renderBooks();
  }

  function editBook(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      const newTitle = prompt('Edit Judul', book.title);
      const newAuthor = prompt('Edit Penulis', book.author);
      const newYear = parseInt(prompt('Edit Tahun', book.year));
      if (newTitle && newAuthor && newYear) {
        book.title = newTitle;
        book.author = newAuthor;
        book.year = newYear;
        saveBooks();
        renderBooks();
      }
    }
  }

  function searchBook(title) {
    return books.filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));
  }

  bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    addBook(title, author, year, isComplete);
    bookForm.reset();
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTitle = document.getElementById('searchBookTitle').value;
    const filteredBooks = searchBook(searchTitle);
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  });

  renderBooks();
});
