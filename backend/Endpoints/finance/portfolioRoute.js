import express from 'express';
import Portfolio from '../../Database_Schema/finance/Portfolio.js';
import UserHolding from '../../Database_Schema/finance/UserHolding.js';
import StockPrice from '../../Database_Schema/market-data/Stock.js';
import User from '../../Database_Schema/auth/User.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const validateRequest = require('../../utils/validation/validateRequest.cjs');
import { isAuthenticated, isAdmin, isOwnerOrAdmin } from '../../middleware/auth.js';

const portfolioRoute = express.Router();

//test route to see if it works
portfolioRoute.route('/portfolios')
    .get((req, res) => {
        res.send('Portfolio Route is working');
    })
    
portfolioRoute.route('/portfolios/:userId')
    // .get(isAuthenticated, async (req, res) => { 
    .get(async (req, res) => {
        const userId = req.params.userId;
        console.log('in /portfolios/:userId Route (GET) portfolio with userId: ' + JSON.stringify(userId));
        try {
            let portfolio = await Portfolio.findOne({ userId: userId });
            if (!portfolio) {
                return res.status(404).send(`No portfolio with userId: ${userId} exists in the database.`);
            }
            const portfolioObj = portfolio.toObject();
     
            const removeIdFields = (obj) => {
                if (obj && typeof obj === 'object') {
                    if ('_id' in obj && !obj._id.equals(portfolioObj._id)) {
                        delete obj._id;
                    }
                    if (Array.isArray(obj)) {
                        obj.forEach(item => removeIdFields(item));
                    } else {
               
                        for (const key in obj) {
                            if (obj[key] && typeof obj[key] === 'object') {
                                removeIdFields(obj[key]);
                            }
                        }
                    }
                }
            };
            removeIdFields(portfolioObj);
        
            // for (const key in portfolioObj) {
            //     if (portfolioObj[key] instanceof Date) {
            //         portfolioObj[key] = portfolioObj[key].toISOString().split('T')[0];
            //     }
                
            //     if (Array.isArray(portfolioObj[key])) {
            //         portfolioObj[key].forEach(item => {
            //             if (typeof item === 'object' && item !== null) {
            //                 for (const itemKey in item) {
            //                     if (item[itemKey] instanceof Date) {
            //                         item[itemKey] = item[itemKey].toISOString().split('T')[0];
            //                     }
            //                 }
            //             }
            //         });
            //     }
                
            //     if (typeof portfolioObj[key] === 'object' && portfolioObj[key] !== null && !(portfolioObj[key] instanceof Date) && !Array.isArray(portfolioObj[key])) {
            //         for (const nestedKey in portfolioObj[key]) {
            //             if (portfolioObj[key][nestedKey] instanceof Date) {
            //                 portfolioObj[key][nestedKey] = portfolioObj[key][nestedKey].toISOString().split('T')[0];
            //             }
            //         }
            //     }
            // }

            return res.status(200).json(portfolioObj);
        } catch (err) {
            return res.status(501).send(`Unexpected error occurred when looking for portfolio with userId: ${userId} in database: ${err}`);
        }
    })


portfolioRoute.route('/holdings/:userId')
    // .get(isAuthenticated, async (req, res) => { 
    .get(async (req, res) => {
        const userId = req.params.userId;
        console.log('in /holdings/:userId Route (GET) holdings with userId: ' + JSON.stringify(userId));
        try {
            const userHolding = await UserHolding.findOne({userId: userId});
            if (!userHolding) {
                return res.status(404).send(`No holdings with userId: ${userId} exists in the database.`);
            }

        //remove _id from objects
        const userHoldingObj = userHolding.toObject();
        const removeIdFields = (obj) => {
            if (obj && typeof obj === 'object') {
                if ('_id' in obj && !obj._id.equals(userHoldingObj._id)) {
                    delete obj._id;
                }
                if (Array.isArray(obj)) {
                    obj.forEach(item => removeIdFields(item));
                } else {
                    for (const key in obj) {
                        if (obj[key] && typeof obj[key] === 'object') {
                            removeIdFields(obj[key]);
                        }
                    }
                }
            }
        };
        removeIdFields(userHoldingObj);
        console.log(process.env.VUE_APP_STOCK_API_KEY_FINNHUB)
        return res.status(200).json(userHoldingObj);

        } catch (err) {
            return res.status(501).send(`Unexpected error occurred when looking for holdings with userId: ${userId} in database: ${err}`);
        }
    })

        

export default portfolioRoute;