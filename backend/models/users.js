import mongoose from "mongoose";

const emotionHistorySchema = new mongoose.Schema({
  emotion: String,             
  imageUrl: String,            
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  emotionHistory: [emotionHistorySchema] 
});

const User = mongoose.model("User", userSchema);

export default User;