import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import User from "../model/User";
import jwt from "jsonwebtoken";
import RefreshToken from "../model/RefreshToken";
import Post from "../model/Post";
export const login: RequestHandler = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.body.id });
    if (!user) {
      return res.status(500).json({ message: "아이디를 확인해주세요" });
    }
    const ok = bcrypt.compareSync(req.body.password, user.password);
    if (!ok) {
      return res.status(500).json({ message: "비밀번호를 확인해주세요" });
    }

    const payload = {
      id: user._id,
      userName: user.userName,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    await RefreshToken.create({
      token: refreshToken,
    });

    return res.status(200).json({ payload, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
  }
};
