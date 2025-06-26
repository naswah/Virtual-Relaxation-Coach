import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  }
}, { timestamps: true });  //automatically adds createdAt and updatedAt feilds

const FAQs = mongoose.model('Faq', faqSchema);
export default FAQs;