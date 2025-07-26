import mongoose from "mongoose";

const yogaPoseSchema = new mongoose.Schema({
  pose_name: { type: String, required: true },
  type: { type: String, enum: ['yoga', 'facialexpression'], required: true },
  emotion: { type: String, enum: ['happy', 'sad', 'angry', 'neutral', 'fear', 'surprise'], required: true },
  description: { type: String, required: true },
  pose_picture: { type: String, required: true },
  youtube_link: { type: String },
  locked: { type: Boolean, default: false }
});

const YogaPose = mongoose.model("YogaPose", yogaPoseSchema);
export default YogaPose;