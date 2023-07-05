import React, { useState, useEffect } from "react";
import axios from "axios";

const ScanResult = (props) => {
  console.log("ScanResult");

  const [ISBNbook, setISBNBook] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ISBN = props.isbn;
  // console.log(props.isbn);

  // const url = `https://www.googleapis.com/books/v1/volumes?q=${ISBN}&key=${apiKey}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${ISBN}`;

  useEffect(() => {
    if (ISBN) {
      setLoading(true);
      axios
        .get(url)
        .then((response) => {
          const bookData = response.data.items[0];
          console.log(bookData);
          const foundBook = {
            id: bookData.id,
            title: bookData.volumeInfo.title,
            author: bookData.volumeInfo.authors
              ? bookData.volumeInfo.authors
              : "Unknown Author",
            publisher: bookData.volumeInfo.publisher
              ? bookData.volumeInfo.publisher
              : "Unknown Publisher",
            description: bookData.volumeInfo.description
              ? bookData.volumeInfo.description
              : "No description available",
          };
          setISBNBook(foundBook);
          setLoading(false);
          setError(null);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
          setISBNBook("");
          console.error(error);
        });
    }

    // return () => {
    //   setLoading(false);
    // };
  }, [ISBN, url]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div key={ISBNbook.id}>
        <h1>{ISBNbook.title}</h1>
        <h2>{ISBNbook.author}</h2>
        <p>{ISBNbook.publisher}</p>
        <p>{ISBNbook.description}</p>
      </div>
    </div>
  );
};

export default ScanResult;
