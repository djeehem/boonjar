import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  const payload = { email: user.email, id: user._id };
  const options = { expiresIn: "15m" };
  return jwt.sign(payload, JWT_SECRET, options);
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log("Error verifying token:", error);
    return null;
  }
};

const generatePasswordResetToken = (user) => {
  const payload = { id: user._id };
  const options = {
    expiresIn: "10m",
    algorithm: "HS256", // Specify the algorithm used for signing the token
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log("Error verifying password reset token:", error);
    return null;
  }
};

export {
  generateToken,
  verifyToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
};
