import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "../routes/apiRouter";
import path from "path";
import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const app = express();

const mongoUrl: any = process.env.DEV_MONGO_URL;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any);

const db = mongoose.connection;

const handleDBError = () => console.log("❌DB연결 실패");
const handleDBSuccess = () => console.log(`✅DB연결 성공`);

db.on("error", handleDBError);
db.once("open", handleDBSuccess);

let corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

mongoose.connect(mongoUrl);

app.set("views", path.join(__dirname, "/views"));
app.use("/static", express.static(__dirname + "/static"));

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/static", express.static("static"));
// app.use("/uploads", express.static("uploads"));
app.use("/api", router);

app.listen("5003", () => {
  console.log(`🛡️  Server listening on port: 5003🛡️`);
});
