import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import User from "../model/User";
import jwt from "jsonwebtoken";
import RefreshToken from "../model/RefreshToken";
import Post from "../model/Post";
import multer from "multer";

interface IFile extends Express.Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string | null;
  contentDisposition: string | null;
  contentEncoding: string;
  storageClass: string;
  serverSideEncryption: string | null;
  metadata: string | undefined;
  location: string;
  etag: string;
  versionId: string;
}

export const join: RequestHandler = async (req, res) => {
  try {
    const existUser = await User.exists({ id: req.body.id });
    if (existUser)
      return res.status(500).json({ message: "동일한 아이디가 있습니다" });
    if (req.body.password !== req.body.verifyPw)
      return res.status(500).json({ message: "비밀번호가 일치하지 않습니다" });

    const hashPw = bcrypt.hashSync(req.body.password, 10);

    const { password, ...info } = req.body;
    const data = { ...info, password: hashPw };
    const newUser = new User({ ...data });
    console.log(newUser);

    await newUser.save();
    return res.status(200).json({ message: "가입성공" });
  } catch (error) {
    console.log(error);
  }
};

export const login: RequestHandler = async (req, res) => {
  console.log(req.body);
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

export const refresh: RequestHandler = async (req, res) => {
  const {
    body: { refreshToken },
  } = req;
  try {
    const existsToken = await RefreshToken.exists({ token: refreshToken });
    if (!existsToken) res.status(401).json({ message: "리프레쉬만료" });
    const decode = jwt.decode(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as any
    );
    if (!decode) {
      return res.status(401).json({ message: "유효하지 않은 리프레쉬토큰" });
    }
    const accessToken = jwt.sign(decode, process.env.JWT_SECRET as any);
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json("Logout Success");
  } catch (error) {
    console.log(error);
  }
};

export const boardPost: RequestHandler = async (req, res) => {
  const { body } = req;

  const files = req.files as IFile[];
  // const myFirstfile = files[0];
  try {
    // const newPost = new Post({ ...req.body, files });
    const returnLocation = files?.map((file) => {
      return file.location;
    });
    const newPost = new Post({ ...body, photos: returnLocation });
    await newPost.save();
    return res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
  }
};

export const boardGet: RequestHandler = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};

export const detail: RequestHandler = async (req, res) => {
  const {
    params: { postId },
  } = req;

  try {
    const post = await Post.findById(postId);
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};

export const remove: RequestHandler = async (req, res) => {
  const {
    params: { postId },
  } = req;
  try {
    await Post.findByIdAndRemove(postId);
    return res.status(200).json();
  } catch (error) {
    console.log(error);
  }
};

export const update: RequestHandler = async (req, res) => {
  const {
    params: { postId },
  } = req;
  try {
  } catch (error) {}
};

export const updatePost: RequestHandler = async (req, res) => {
  const {
    params: { postId },
    body: { title, desc },
    files,
  } = req;
  try {
    const post = await Post.findById(postId);
    const updatePost = await Post.findByIdAndUpdate(postId, { title, desc });
  } catch (error) {}
};
