import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScrapedUser',
    required: true
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Source',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    trim: true
  },
  featuredImage: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }]
});

// Create indexes for better query performance
ArticleSchema.index({ title: 1, sourceId: 1 }, { unique: true });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ createdAt: -1 });

const Article = mongoose.model('Article', ArticleSchema);
export default Article;