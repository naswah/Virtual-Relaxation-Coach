import express from "express";
import FAQs from "../models/faqModels.js";

const router = express.Router();

// GET all FAQs
router.get("/", async (req, res) => {
  const faqs = await FAQs.find();
  res.json(faqs);
});

// POST a new FAQ (Admin only)
router.post("/", async (req, res) => {
  const { question, answer } = req.body;
  const newFaq = new FAQs({ question, answer });
  await newFaq.save();
  res.status(201).json(newFaq);
});

// DELETE an FAQ by ID (Admin only)
router.delete("/:id", async (req, res) => {
  await FAQs.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;