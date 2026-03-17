import mongoose from 'mongoose';

const scrapedUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  source: {
    type: String,
    default: 'voz'
  },
  lastScraped: {
    type: Date,
    default: Date.now
  }
});

const ScrapedUser = mongoose.models.ScrapedUser || mongoose.model('ScrapedUser', scrapedUserSchema);
export default ScrapedUser;

