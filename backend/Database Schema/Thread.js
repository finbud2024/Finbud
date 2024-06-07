import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
    prompt:[String],
    answer:[String],
    createdDate: Date
})

const Thread = mongoose.model('Thread', threadSchema);
export default {ThreadSchema,Thread};