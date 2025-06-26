import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from './models/users.js';
import faqRoutes from "../routes/faqRoutes.js";
import adminRoutes from '../routes/adminRoutes.js';

const app = express();
// const PORT = 5000;

// Middleware
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
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json("Email and password are required");

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json("Incorrect password");

    res.status(200).json("Login successful!");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});


app.use("/api/faqs", faqRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(5000, () => {
    console.log("Server started at http://localhost:5000");
});
