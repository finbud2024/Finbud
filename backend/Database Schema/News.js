import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
    source: {
        id: { type: String },
        name: { type: String, required: true }
    },
    author: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    urlToImage: { type: String },
    publishedAt: { type: Date, required: true },
    content: { type: String }
}, { timestamps: true });

const News = mongoose.model('News', NewsSchema);
export default News;