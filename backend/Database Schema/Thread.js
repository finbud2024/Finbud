import mongoose from "mongoose";

//define Thread Schema
const ThreadSchema = new mongoose.Schema({
    prompt:[String],
    response:[String],
    createdDate: Date,
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        require: true
    }
})

const Thread = mongoose.model('Thread', ThreadSchema);
export {ThreadSchema,Thread};