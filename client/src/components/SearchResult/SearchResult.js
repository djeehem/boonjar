import React, { useState } from "react";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    setLoading(true);

    // this is a test
    // api backup
    // const apiKey = "AIzaSyA6SaT23KNiiA6DnUfUQTvFeyAcQEkwnSU";
    const apiKey = "AIzaSyBiCXvlzIQEdAIsJv_7iMQKhk7mZkXpzOk";
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${apiKey}`;

    axios
      .get(url)
      .then((response) => {
        const bookData = response.data.items;
        console.log(bookData.length);
        const bookList = bookData.map((book) => ({
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors
            ? book.volumeInfo.authors
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
          <h1>{book.title}</h1>
          <h2>{book.author}</h2>
          <p>{book.publisher}</p>
          <p>{book.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BookList;
