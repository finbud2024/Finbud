const mongoose = require('mongoose');

const scrapedUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
});

const ScrapedUser = mongoose.models.ScrapedUser || mongoose.model('ScrapedUser', scrapedUserSchema);
module.exports = ScrapedUser;
