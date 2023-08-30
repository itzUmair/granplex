import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const logger = async (req, res, next) => {
  const requestTime = new Date().toLocaleString();
  console.log(`${req.method} => ${req.url} @ ${requestTime}`);
  next();
};

export const authentication = (req, res, next) => {
  const authCookie = req.cookies._auth;

  if (req.url.endsWith("/signin") || req.url.endsWith("/signup")) {
    next();
    return;
  }

  if (!authCookie) {
    return res
      .status(401)
      .send({ message: "You are not authorized to access the API." });
  }

  try {
    jwt.verify(authCookie, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token." });
  }
};
