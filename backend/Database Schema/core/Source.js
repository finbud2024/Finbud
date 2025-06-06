import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SourceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  lastScraped: {
    type: Date,
    default: Date.now
  }
});

const Source = mongoose.model('Source', SourceSchema);
export default Source;