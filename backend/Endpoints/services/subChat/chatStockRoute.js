import express from "express"
import ChatSimulator from "../../../Database_Schema/trading/ChatStockSimulator.js";
const chatStockRoute = express.Router()

chatStockRoute.post("/update-response", async (req, res) => {
    const {userId, newMessage} = req.body;
    try {
        const start = new Date()
        start.setHours(0, 0, 0, 0)
        const end = new Date()
        end.setHours(23, 59, 59, 999)
        const updateResponse = await ChatSimulator.findOneAndUpdate(
            {userId, 
            createdAt: {$gte: start, $lte: end} },
            {response: newMessage}, 
            {upsert: true, new: true}
        )
        return res.status(200).json({updateResponse})
    } catch (error){
        return res.status(500).json({message: 'Error updating', error})
    }
})

chatStockRoute.get('/all-responses/:userId', async(req, res) => {
    const {userId} = req.params;
    try {
        const recentResponse = await ChatSimulator.find({userId})
        if (!recentResponse){
            return res.status(404).json({message: 'No response found'})
        }
        return res.json(recentResponse)
    } catch (error){
        return res.status(500).json({message: 'Error getting the most recent', error})
    }
})
export default chatStockRoute
