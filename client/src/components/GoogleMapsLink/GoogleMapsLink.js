import React from "react";

const startingPoint = "h4c3c2";
const destination = "nyc";

const GoogleMapsLink = () => {
  const encodedStartingPoint = encodeURIComponent(startingPoint);
  const encodedDestination = encodeURIComponent(destination);

  const googleMapsURL = `https://www.google.com/maps/dir/?api=1&origin=${encodedStartingPoint}&destination=${encodedDestination}`;

  return (
    <a href={googleMapsURL} target="_blank" rel="noopener noreferrer">
      Open Google Maps
    </a>
  );
};

export default GoogleMapsLink;
