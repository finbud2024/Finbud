import express from 'express';
import Chat from '../Database Schema/Chat.js';

const chatRoute = express.Router();

    //GET: Retrieve all chats
    chatRoute.get("/chats",async(req, res)=>{
        console.log('in /chats Route (GET) all chats');
        try{
            const chats = await Chat.find();
            return res.status(200).send(chats);
        }catch(err){
            return res.status(501).send("Internal error: " + err);
        }
    });

    //DELETE: delete all chats
    chatRoute.delete("/chats",async(req, res) => {
        console.log('in /chats Route (DELETE) all chats');
        try{
            await Chat.deleteMany();
            return res.status(200).send("All chats deleted successfully");
        }catch(err){
            return res.status(501).send("Internal error: " + err);
        }
    });

    //POST: create a new chat
    chatRoute.post("/chats",async(req, res) => {
        console.log(req.body);
        if(!req.body.prompt || !req.body.response || !req.body.threadId){
            return res.status(400).send("Prompt, response and threadId are required");
        }
        console.log('in /chats Route (POST) new chat to database');
        try{
            const chat = {};
            if(req.body){
                for(const key in req.body){
                    chat[key] = req.body[key];
                }
            }
            const newChat = await new Chat({
                prompt: chat.prompt,
                response: chat.response,
                threadId: chat.threadId
            });
            console.log(newChat);
            await newChat.save();
            return res.status(200).send(newChat);
        }catch(err){
            return res.status(502).send("Internal error e" + err);
        }
    });

    //PUT: update chat with given chat id
    chatRoute.put("/chats/:chatId",async(req, res) => {
        const chatId = req.params.chatId;
        console.log('in /chats/:chatId Route (PUT) chat with ID:' + chatId);
        try{
            const filter = {"_id": chatId};
            const updatedChat = {};
            
            if(req.body){
                for(const key in req.body){
                    updatedChat[key] = req.body[key];
                }
            }

            const chat = await Chat.updateOne(filter, updatedChat, {
                new: true
            }) 

            if(!chat.modifiedCount){
                return res.status(404).send(`Cannot find chat with chat ID : ${chatId} in database`);
            }

            return res.status(200).send({message: `Chat updated successfully`, updatedChat: chat});
        }catch(err){
            return res.status(501).send("Internal error e" + err);
        }
    });

    //DELETE: delete a chat with given chat id
    chatRoute.delete("/chats/:chatId",async(req, res) => {
        const chatId = req.params.chatId;
        console.log('In /chats/:chatId Route (DELETE) for chat with ID: ' + chatId);
        try{
            const chat = await Chat.findOneAndDelete({_id: chatId});
            if(!chat){
                return res.status(404).send(`Cannot find chat in db with chat ID is: ${chatId}`);
            }
            return res.status(200).send('Chat deleted successfully');
        }catch(err){
            return res.status(500).send("Internal sever error"+ err);
        }
    });

    //GET: retrieve chats with given thread id
    chatRoute.get("/chats/t/:threadId",async(req, res)=>{
        const threadId = req.params.threadId;
        console.log('in /chats/:threadId Route (GET) chat with thread ID:' + JSON.stringify(threadId));
        try{
            const chats = await Chat.find({threadId: threadId});
            if(!chats){
                return res.status(404).send(`Cannot find chat in db with thread ID is: ${threadId}`);
            }
            return res.status(200).send(chats);
        }catch(err){
            return res.status(501).send("Internal error e" + err);
        }
    });

    //DELETE: delete all chats with given thread id
    chatRoute.delete("/chats/t/:threadId",async(req, res) => {
        const threadId = req.params.threadId;
        console.log('In /chats/t/:threadId Route (DELETE) for chat with thread ID: ' + threadId);
        try{
            await Chat.deleteMany({threadId: threadId});
            return res.status(200).send("All chats with thread ID: "+ threadId + " deleted successfully");
        }catch(err){
            return res.status(501).send("Internal error: " + err);
        }
    });

export default chatRoute;
