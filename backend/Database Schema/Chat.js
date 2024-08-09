import mongoose from "mongoose";

// Define Source Schema
const SourceSchema = new mongoose.Schema({
    title: String,
    link: String,
    snippet: String,
    favicon: String,
    host: String,
    html: String // Include the main content if necessary
});

// Define Video Schema
const VideoSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    link: String
});

// Define Chat Schema
const ChatSchema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true
    },
    response: {
        type: [String],
        required: true
    },
    sources: [SourceSchema],
    videos: [VideoSchema],
    followUpQuestions: {
        type: [String]
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    threadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread',
        required: true
    }
});

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
