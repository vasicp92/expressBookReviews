const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// =======================
// Task 6: Register a new user
// =======================
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// =======================
// Task 1: Get the book list available in the shop
// =======================
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// =======================
// Task 2: Get book details based on ISBN
// =======================
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// =======================
// Task 3: Get book details based on author
// =======================
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// =======================
// Task 4: Get book details based on title
// =======================
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// =======================
// Task 5: Get book reviews based on ISBN
// =======================
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// =======================
// Task 10: Get book list using Promise callbacks
// =======================
public_users.get('/async/books', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books available");
    }
  })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

// =======================
// Task 11: Get book details by ISBN using Promise callbacks
// =======================
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// =======================
// Task 12: Get book details by Author using Promise callbacks
// =======================
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    let result = [];
    let keys = Object.keys(books);

    keys.forEach((key) => {
      if (books[key].author === author) {
        result.push(books[key]);
      }
    });

    if (result.length > 0) {
      resolve(result);
    } else {
      reject("No books found for this author");
    }
  })
    .then((booksByAuthor) => {
      return res.status(200).json(booksByAuthor);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// =======================
// Task 13: Get book details by Title using Promise callbacks
// =======================
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    let result = [];
    let keys = Object.keys(books);

    keys.forEach((key) => {
      if (books[key].title === title) {
        result.push(books[key]);
      }
    });

    if (result.length > 0) {
      resolve(result);
    } else {
      reject("No books found with this title");
    }
  })
    .then((booksByTitle) => {
      return res.status(200).json(booksByTitle);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

module.exports.general = public_users;
