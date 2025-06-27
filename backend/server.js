import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from './models/users.js';
import FAQs from './models/faqModels.js';

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

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
});