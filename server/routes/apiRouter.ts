import express, { RequestHandler } from "express";
import {
  boardGet,
  boardPost,
  detail,
  join,
  login,
  logout,
  refresh,
  remove,
  update,
  updatePost,
} from "../controllers/apiController";
import { verifyJWT } from "../authMiddleware";
import { s3PostUpload } from "../middleware/multer";
const router = express.Router();

router.post("/auth/join", join);

router.post("/auth/login", login);

router.get("/auth/logout", logout);

router.get("/auth/test", verifyJWT, (req, res, next) => {
  console.log("middleware next");
});

router.post("/board", s3PostUpload.array("files", 10), boardPost);

router.get("/board", boardGet);

router.get("/board/:postId", detail);

router.get("/board/:postId/remove", remove);

router.get("/board/:postId/update", update);

router.post(
  "board/:postId/update",
  s3PostUpload.array("files", 10),
  updatePost
);

router.post("/refresh-token", refresh);

export default router;
