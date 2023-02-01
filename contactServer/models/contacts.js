const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.index({
  name: "text",
  designation: "text",
  email: "text",
  country: "text",
  company: "text",
  city: "text",
  phone: "text",
});
module.exports = mongoose.model("Contacts", contactSchema);
