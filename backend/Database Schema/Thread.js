import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
    prompt:[String],
    response:[String],
    createdDate: Date
})

const Thread = mongoose.model('Thread', ThreadSchema);
export {ThreadSchema,Thread};