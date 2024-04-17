import axios from 'axios';
import geocoder from "./geocoder.js";

const getCoordinatesFromPostalCodeApi = async (postalCode) => {
    
    // TODO_COM test:
    console.log("in getCoordinatesFromPostal SERVER SIDE with postal code = ", postalCode);

    try {
        const result = await geocoder.geocode({ postalcode: postalCode });
        if (result.length > 0) {
          return {
            latitude: result[0].latitude,
            longitude: result[0].longitude,
          };
        } else {
          throw new Error('No coordinates found for the given postal code');
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
      }
    
    // try {
    //   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
    //   const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&components=postal_code:${encodeURIComponent(postalCode)}`);
      
    //   if (response.data.results && response.data.results.length > 0) {
    //     const location = response.data.results[0].geometry.location;
    //     return { latitude: location.lat, longitude: location.lng };
    //   }
  
    //   return { latitude: 0, longitude: 0 };
    // } catch (error) {
    //   console.error('Error fetching coordinates from Google Geocoding API:', error);
    //   throw error;
    // }
  };

  export default getCoordinatesFromPostalCodeApi;