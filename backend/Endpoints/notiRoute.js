import express from 'express';
import Noti from "../Database Schema/Noti.js";
import validateRequest from '../utils/validateRequest.js';
import { isAuthenticated, isAdmin, isOwnerOrAdmin } from '../middleware/auth.js';

const notiRoute = express.Router(); 

notiRoute.route('/api/notis/:userId')
    // GET all notis for a user
    .get(async (req, res) => {
        const userId = req.params.userId;
        console.log('in /notis/:userId Route (GET) notis with userId: ' + JSON.stringify(userId));
        try {
            let notis = await Noti.find({ userId: userId });
            if (!notis) {
                return res.status(404).send(`No notis with userId: ${userId} exists in the database.`);
            }
            return res.status(200).json(notis);
        } catch (err) {
            return res.status(501).send(`Unexpected error occurred when looking for notis with userId: ${userId} in database: ${err}`);
        }
    })

    .post(async (req, res) => {
        const userId = req.params.userId;
        console.log('in /notis/:userId Route (POST) notis with userId: ' + JSON.stringify(userId));
        console.log('in /notis/:userId Route (POST) notis with body: ' + JSON.stringify(req.body));
        try {
            const { title, content } = req.body;
            const noti = new Noti({ userId, title, content });
            await noti.save();
            return res.status(201).json(noti);
        } catch (err) {
            return res.status(501).send(`Unexpected error occurred when creating notis with userId: ${userId} in database: ${err}`);
        }
    })



export default notiRoute;