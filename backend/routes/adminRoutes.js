import express from "express";
import FAQs from "../models/faqModels.js";
import User from "../models/users.js";

const router = express.Router();

//Db ma bhayeko sabai users lai retrieve garne:
router.get("/users", async (req, res)=>{
    const users = await User.find({}, "-password") //password lai naline for security reasons
    res.json(users);
});

//delete by username
router.delete("/users/:username", async(req,res)=>{
    const result= await User.findOneAndDelete({name: req.params.username});
    if (result){
        res.status(200).json("User Deleted");
    } else{
        returnstatus(404).json("User not found");
    }
});