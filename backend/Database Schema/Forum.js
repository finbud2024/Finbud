const mongoose = require("mongoose");

const ForumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, 
  description: String,
});

module.exports = mongoose.model("Forum", ForumSchema);
