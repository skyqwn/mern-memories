import mongoose from "mongoose";

interface IUser {
  id: string;
  password: string;
  userName: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  id: String,
  userName: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

export default User;
