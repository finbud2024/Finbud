import mongoose from "mongoose";

//define Thread Schema
const ThreadSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'New Chat'
    },
    creationDate : {
        type: Date,
        default: Date.now,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
})

const Thread = mongoose.model('Thread', ThreadSchema);
export default Thread;