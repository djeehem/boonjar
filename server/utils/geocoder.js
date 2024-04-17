import nodeGeocoder from "node-geocoder";

// geocoding (converting addresses to coordinates) 
// reversing geocoding (converting coordinates to addresses).

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
  };
  
  const geocoder = nodeGeocoder(options);
  
 export default geocoder;