import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  img: {
    type: String
  },
  category: {
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
  view: {
    type: String,
  }
});

// Create indexes for better query performance
CourseSchema.index({ title: 1, sourceId: 1 }, { unique: true });
CourseSchema.index({ category: 1 });
CourseSchema.index({ createdAt: -1 });

const Course = mongoose.model('Course', CourseSchema);
export default Course;