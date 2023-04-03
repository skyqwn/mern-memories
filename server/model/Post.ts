import mongoose from "mongoose";

interface IPost {
  title: string;
  desc: string;
  photos: string[];
}

const PostSchema = new mongoose.Schema<IPost>({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  photos: [String],
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
