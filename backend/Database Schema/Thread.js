import mongoose from "mongoose";

// serve for thread memory
const threadMemorySchema = new mongoose.Schema({
    history: {
        type: String,
        default: ""
      }
});

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
    },
    // thread memory that each chat will need to access
    memory: {
        type: threadMemorySchema,
        required: true,
        default: { history: "" }
    }
})

const Thread = mongoose.model('Thread', ThreadSchema);
export default Thread;