import mongoose from "mongoose";

interface IRefreshToken {
  token: string;
}

const RefreshTokenSchema = new mongoose.Schema<IRefreshToken>({
  token: String,
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
