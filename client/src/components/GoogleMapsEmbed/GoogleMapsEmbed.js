import React from "react";
// import { Map, GoogleApiWrapper, Marker  } from 'google-maps-react';
// https://www.pluralsight.com/guides/how-to-use-geolocation-call-in-reactjs

const startingPoint = "h4c3c2";
const destination = "42 claude-champagne outremont";

const GoogleMapsEmbed = () => {
  console.log("GoogleMapsEmbed");

  const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const encodedStartingPoint = encodeURIComponent(startingPoint);
  const encodedDestination = encodeURIComponent(destination);

  const googleMapsURL = `https://www.google.com/maps/embed/v1/directions?key=${googleApiKey}&origin=${encodedStartingPoint}&destination=${encodedDestination}`;

  return (
    <iframe
      title="Google Maps"
      width="600"
      height="450"
      frameBorder="0"
      style={{ border: 0 }}
      src={googleMapsURL}
      allowFullScreen
    />
  );
};

export default GoogleMapsEmbed;
