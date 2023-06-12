import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import dotenv from "dotenv";

const BookSearch = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    const GOOGLE_BOOKS_API = process.env.REACT_APP_GOOGLE_BOOKS_API;
    event.preventDefault();
    setLoading(true);

    // Search endpoint
    // const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`

    // Volumes endpoint
    // const bookId = 'wkKvDwAAQBAJ';
    // const url = `https://www.googleapis.com/books/v1/volumes/${bookId}`;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${GOOGLE_BOOKS_API}`;

    console.log(url);

    axios
      .get(url)
      .then((response) => {
        const bookData = response.data.items;
        console.log(bookData.length);
        console.log(bookData);
        const bookList = bookData.map((book) => ({
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors
            ? book.volumeInfo.authors.join(", ")
            : "Unknown Author",
          publisher: book.volumeInfo.publisher
            ? book.volumeInfo.publisher
            : "Unknown Publisher",
          description: book.volumeInfo.description
            ? book.volumeInfo.description
            : "No description available",
        }));
        setBooks(bookList);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        setBooks([]);
        console.error(error);
      });
  };

  // console.log(books);

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {books.map((book) => (
        <div key={book.id}>
          <Link to={`/book/${book.id}`} state={{ value: book }}>
            <h1>{book.title}</h1>
            <h2>{book.author}</h2>
            <p>{book.publisher}</p>
            <p>{book.description}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BookSearch;
