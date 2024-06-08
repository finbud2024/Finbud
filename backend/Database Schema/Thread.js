import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
    prompt:[String],
    response:[String],
    createdDate: Date,
    userID:{
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
})

const Thread = mongoose.model('Thread', ThreadSchema);
export {ThreadSchema,Thread};