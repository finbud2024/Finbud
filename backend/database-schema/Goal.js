import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    targetAmount: {
        type: Number,
        required: true
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isAchieved: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true
    }
});

const Goal = mongoose.model('Goal', GoalSchema);
export default Goal;
