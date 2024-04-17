import axios from "axios";

const registerUserApi = async (user) => {
  console.log("registerUserApi");

  try {
    const auth = await axios.post(
      "http://localhost:8000/api/auth/register",
      user
    );

    console.log(auth);
    const accessToken = auth.data.accessToken;
    const refreshToken = auth.data.refreshToken;

    localStorage.setItem("access-token", accessToken);
    localStorage.setItem("refresh-token", refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    // trying to insert a new User with a duplicate email value -> MongoError: E11000 duplicate key error collection
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      console.error('Duplicate email:', error.keyValue.email);
      // Provide feedback to the user
      // TODO_COM a faire apres que le server 500 error -> "message": "secretOrPrivateKey must have a value".  issue with the JWT (JSON Web Token) configuration
      throw new Error('Email address is already in use.');
    } else {
      console.log(error);
    throw error;
    }
  }
};

export { registerUserApi };

// import axios from "axios";

// const url = "/notes";

// const getNotesApi = (email) => axios.get(`${url}/${email}`);
// const createNoteApi = (newNote) => axios.post(url, newNote);
// const updateNoteApi = (id, updatedNote) =>
//   axios.patch(`${url}/${id}`, updatedNote);
// const deleteNoteApi = (id) => axios.delete(`${url}/${id}`);
// const updateNotePositionsApi = (notes) => axios.patch(url, notes);

// export {
//   getNotesApi,
//   createNoteApi,
//   updateNoteApi,
//   deleteNoteApi,
//   updateNotePositionsApi,
// };
