import jwt from "jsonwebtoken";
import "dotenv/config";

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.SECRET, {
    expiresIn: "20m", // You can adjust the expiration time
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "1h",
  });
};

export { generateAccessToken, generateRefreshToken };
