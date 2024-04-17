// apiService.js
import axios from "axios";

const getCoordinatesApi = async (address) => {
  console.log("getCoordinatesApi");

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`
    );

    const lat = response.data[0].lat;
    const lng = response.data[0].lon;

    return { latitude: lat, longitude: lng };
  } catch (error) {
    throw new Error("Failed to fetch coordinates from address.");
  }
};


const getCoordinatesFromPostalCodeApi = async (postalCode) => {
  console.log("getCoordinatesFromPostalCodeApi with postal code = ", postalCode);

  try {
    const response = await axios.get('/api/validatePostalCode', { postalCode });
    const coordinates = response.data;
    return coordinates;
  } catch (error) {
    throw new Error("Failed to fetch coordinates from postal code.");
  }
};

export { getCoordinatesApi, getCoordinatesFromPostalCodeApi };
