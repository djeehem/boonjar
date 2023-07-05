import React from "react";
import { useLocation } from "react-router-dom";
import NotFound from "../NotFound/NotFound";
import GoogleMapsLink from "../../components/GoogleMapsLink/GoogleMapsLink";
import GoogleMapsEmbed from "../../components/GoogleMapsEmbed/GoogleMapsEmbed";

const Book = () => {
  console.log("Book");

  const location = useLocation();

  let book;
  // Retrieve book object from location state
  if (location.state) {
    book = location.state.value;
  }

  return (
    <>
      {book ? (
        <>
          <div>
            <p>{book.pathname}</p>
            <h1>{book.title}</h1>
            <h2>{book.author}</h2>
            <p>{book.publisher}</p>
            <p>{book.description}</p>
          </div>
          <GoogleMapsLink />
          <GoogleMapsEmbed />
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default Book;
