import jwt from "jsonwebtoken";
import User from "./model/User";
import dotenv from "dotenv";

import { RequestHandler } from "express";

export const verifyJWT: RequestHandler = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(403).json({ message: "토큰이 없음" });

  const userData = jwt.verify(token, process.env.JWT_SECRET as string);

  if (!userData)
    return res.status(403).json({
      message: "인증안된 토큰임",
    });

  console.log("토큰인증성공");
};
