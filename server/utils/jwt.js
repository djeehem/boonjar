import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessJwt = (user) => {
  const payload = { email: user.email, id: user._id };

  const options = { expiresIn: "10m" };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
};

const generateRefreshJwt = (user) => {
  const payload = { email: user.email, id: user._id };

  const options = { expiresIn: "1w" };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};

const verifyAccessJwt = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log("Token verified");
    console.log(decoded);
    return decoded;
  } catch (error) {
    console.log("Error verifying token:", error);
    throw new Error("Invalid or expired JWT");
  }
};

const verifyRefreshJwt = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    console.log("Refresh token verified");
    console.log(decoded);
    return decoded;
  } catch (error) {
    console.log("Error verifying refresh token:", error);
    throw new Error("Invalid or expired refresh token");
  }
};

const generatePasswordResetJwt = (user) => {
  const payload = { id: user._id };
  const options = {
    expiresIn: "10m",
    algorithm: "HS256", // Specify the algorithm used for signing the token
  };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
};

const verifyPasswordResetJwt = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    console.log("Error verifying password reset token:", error);
    return null;
  }
};

export {
  generateAccessJwt,
  generateRefreshJwt,
  verifyAccessJwt,
  verifyRefreshJwt,
  generatePasswordResetJwt,
  verifyPasswordResetJwt,
};
