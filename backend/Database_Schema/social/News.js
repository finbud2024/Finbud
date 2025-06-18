import mongoose from 'mongoose';
const { Schema } = mongoose;

// Daily News data model
const NewSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'ScrapedUser',
      required: true,
    },
    sourceId: {
      type: Schema.Types.ObjectId,
      ref: 'Source',
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    featuredImage: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);


NewSchema.index({ title: 1, sourceId: 1 }, { unique: true });
NewSchema.index({ category: 1 });
NewSchema.index({ createdAt: -1 });

const New = mongoose.model('New', NewSchema);
export default New;