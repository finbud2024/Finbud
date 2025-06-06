import mongoose from "mongoose";

const ChatSimulatorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        require: true
    },
    response: {
        type: String,
        default: ""
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const ChatSimulator = mongoose.model('ChatSimulator', ChatSimulatorSchema)
export default ChatSimulator