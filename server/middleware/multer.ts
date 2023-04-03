import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";

interface IS3 {
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  region: string;
}

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS as string,
    secretAccessKey: process.env.AWS_S3_SCERET as string,
  },
  region: process.env.AWS_S3_REGION as string,
});

export const s3PostUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET as string,
    acl: "public-read",
    key: function (req, file, cb) {
      // const ogName = (file.originalname = Buffer.from(
      //   file.originalname,
      //   "latin1"
      // ).toString("utf8"));
      const today = new Date();
      cb(null, `post/${today}_${file.originalname}`);
    },
  }),
});

// export const boardUpload = multer({ dest: "uploads/boardImg" });
