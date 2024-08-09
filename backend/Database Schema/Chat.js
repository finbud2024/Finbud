import { response } from "express";
import mongoose from "mongoose";

//define Chat Schema
const ChatSchema = new mongoose.Schema({
    prompt : String,
    response : [String],
    creationDate : {
        type: Date,
        default: Date.now,
        required: true
    },
    threadId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread',
        require: true
    }
});

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
