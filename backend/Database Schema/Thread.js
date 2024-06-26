import mongoose from "mongoose";

//define Thread Schema
const ThreadSchema = new mongoose.Schema({
    creationDate : {
        type: Date,
        default: Date.now,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    }
})

const Thread = mongoose.model('thread', ThreadSchema);
export default Thread;