import mongoose from "mongoose";

//define Thread Schema
const ThreadSchema = new mongoose.Schema({
    creationDate : {
        type: Date,
        default: Date.now,
        required: true
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        require: true
    }
})

const Thread = mongoose.model('thread', ThreadSchema);
export default Thread;