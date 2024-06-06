const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    threadID: {
        type: Number
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true
    }, 
    prompt:{
        type: String
    },
    response:{
        type: String
    },

})

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;