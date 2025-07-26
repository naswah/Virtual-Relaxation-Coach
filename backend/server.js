import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from './models/users.js';
import FAQs from './models/faqModels.js';
import YogaPose from './models/yogaPoses.js';

const app = express();
// const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/VRC")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

//register bata aune kura
app.post("/register", async(req,res) =>{
    const { name, email, password, repassword, phone }= req.body;
    console.log("Received:", req.body);

    if (!name || !email ||!password || !repassword || !phone)
        return res.status(400).json("All feilds are required");

    if (password !== repassword){
        return res.status(400).json("Passwords do not match");
        return;
    }

     const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phone)) {
        return res.status(400).json("Phone must be of 10 digits");
        return;
  }

    const userExist= await User.findOne({email});
    if (userExist) 
        return res.status(409).json("User already exists!");

   // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    await newUser.save();
    res.status(200).json("User resgistered successfully!")
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    // If you're using bcrypt (recommended)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful", user });
     window.location.reload();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/faqs", async(req, res)=>{
  try{
    const faqs= await FAQs.find();
    res.status(200).json(faqs);
  }catch(err){
    console.err(err);
    res.statusMessage(500).json ("Error fetching FAQs");
  }
})

//add faq by admin
app.post("/faqs", async(req,res)=>{
  try{
    const {question, answer}= req.body;

    if(!question || !answer){
      return res.status(400).json("Question and answer required!");
    }

    const newFAQ= new FAQs({
      question,
      answer
    })

    await newFAQ.save();
    res.status(201).json("FAQ added successfully!");
  }catch(err){
    console.error(err);
    res.statusMessage(500).json("Error adding the FAQ");
  }
})

app.delete("/faqs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedFAQ = await FAQs.findByIdAndDelete(id);
    if (!deletedFAQ) {
      return res.status(404).json("FAQ not found");
    }

    res.status(200).json("FAQ deleted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json("Error deleting FAQ");
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching users");
  }
});

// Delete user (admin only)
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json("User not found");
    }

    res.status(200).json("User deleted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json("Error deleting user");
  }
});

app.post("/recommend", async (req, res) => {
  const { aiEmotion, answers } = req.body;

  if (!aiEmotion || !Array.isArray(answers) || answers.length !== 4)
    return res.status(400).json("aiEmotion + 4 answers required.");

  const scores = {};
  const bump = (emo) => (scores[emo] = (scores[emo] || 0) + 1);
  bump(aiEmotion);
  answers.forEach(bump);

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  const MAX_POSES = 5;
  const totalScore = sorted.reduce((s, [, v]) => s + v, 0);
  const recs = [];
  let remaining = Math.min(MAX_POSES, totalScore);

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  for (const [emotion, score] of sorted) {
    const ideal = Math.round((score / totalScore) * MAX_POSES);
    const quota = Math.max(1, Math.min(ideal, remaining));

    const yogaPoses = shuffle(
      await YogaPose.find({ emotion, type: "yoga" })
    ).slice(0, quota).map(p => ({
      name: p.pose_name,
      image: p.pose_picture,
      description: p.description,
      type: "yoga",
      youtube: p.youtube_link || null
    }));

    const facialPoses = shuffle(
      await YogaPose.find({ emotion, type: "facialexpression" })
    ).slice(0, 1).map(p => ({
      name: p.pose_name,
      image: p.pose_picture,
      description: p.description,
      type: "facialexpression",
      youtube: p.youtube_link || null
    }));

    const allPoses = [...yogaPoses, ...facialPoses];

    if (allPoses.length)
      recs.push({ emotion, poses: allPoses });

    remaining -= allPoses.length;
    if (remaining <= 0) break;
  }

  res.json({ recommendations: recs });
});


//To add yogaPose
app.post("/yoga/add", async (req, res) => {
  try {
    const { pose_name, type, emotion, description, pose_picture, youtube_link, locked } = req.body;

    const newPose = new YogaPose({
      pose_name,
      type,
      emotion,
      description,
      pose_picture,
      youtube_link,
      locked: Boolean(locked) 
    });

    await newPose.save();
    res.status(200).send("Pose added successfully");
    console.log("Received locked value:", locked, typeof locked);

  } catch (err) {
    console.error("Error while adding pose:", err);
    res.status(500).send("Failed to add pose");
  }
});

// Fetch all yoga poses
app.get("/yoga/all", async (req, res) => {
  try {
    const poses = await YogaPose.find();
    res.status(200).json(poses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch poses" });
  }
});


//to delete yoga poses
app.delete("/yoga/delete/:id", async (req, res) => {
  try {
    const pose = await YogaPose.findById(req.params.id);

    if (!pose) {
      return res.status(404).send("Pose not found");
    }

    if (pose.locked) {
      return res.status(403).send("Cannot delete locked pose");
    }

    await YogaPose.findByIdAndDelete(req.params.id);
    res.status(200).send("Pose deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});




app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
});