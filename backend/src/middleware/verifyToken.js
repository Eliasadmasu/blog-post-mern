import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const userId = decoded.userId;

    req.userId = userId;
    next();
  });
};

export { verifyToken };
