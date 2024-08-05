import express from 'express';
import StockTransaction from '../Database Schema/StockTransaction.js';
import validateRequest from '../utils/validateRequest.js';

const stockTransactionRoute = express.Router();

// CRUD operations on /stock-transactions/:transactionId
stockTransactionRoute.route('/stock-transactions/:transactionId')
  // GET a stock transaction by ID
  .get(async (req, res) => {
    const transactionId = req.params.transactionId;
    console.log('in /stock-transactions/:transactionId Route (GET) stock transaction with ID: ' + JSON.stringify(transactionId));
    try {
      let transaction = await StockTransaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).send(`No stock transaction with ID: ${transactionId} exists in the database.`);
      }
      return res.status(200).json(transaction);
    } catch (err) {
      return res.status(501).send(`Unexpected error occurred when looking for stock transaction with ID: ${transactionId} in database: ${err}`);
    }
  })

  // PUT: update a stock transaction with a given ID
  .put(validateRequest(StockTransaction.schema), async (req, res) => {
    const { stockSymbol, type, quantity, price, userId } = req.body;
    const transactionId = req.params.transactionId;

    if (!stockSymbol || !type || quantity === undefined || price === undefined || !userId) {
      return res.status(400).send("Stock symbol, type, quantity, price, and userId are required");
    }

    console.log('in /stock-transactions/:transactionId Route (PUT) stock transaction with ID: ' + transactionId);

    try {
      const updatedTransaction = await StockTransaction.findByIdAndUpdate(
        transactionId,
        { stockSymbol, type, quantity, price, userId },
        { new: true }
      );

      if (!updatedTransaction) {
        return res.status(404).send(`Cannot find stock transaction with ID: ${transactionId}`);
      }

      console.log("Stock transaction updated: ", updatedTransaction);
      return res.status(200).json({ message: 'Stock transaction updated successfully', updatedTransaction });
    } catch (error) {
      return res.status(501).send(`Unexpected error occurred when updating stock transaction with ID: ${transactionId} in database: ${error}`);
    }
  })

  // DELETE a stock transaction by ID
  .delete(async (req, res) => {
    const transactionId = req.params.transactionId;
    console.log('In /stock-transactions/:transactionId Route (DELETE) stock transaction with ID: ' + transactionId);

    try {
      const transaction = await StockTransaction.findByIdAndDelete(transactionId);
      if (!transaction) {
        return res.status(404).send(`No stock transaction with ID: ${transactionId} exists in the database.`);
      }

      console.log('Stock transaction deleted: ', transaction);
      return res.status(204).send('Stock transaction deleted successfully');
    } catch (error) {
      return res.status(501).send(`Unexpected error occurred when deleting stock transaction with ID: ${transactionId} in database: ${error}`);
    }
  });

// CRUD operations on /stock-transactions, all stock transactions in database
stockTransactionRoute.route('/stock-transactions')
  // GET all stock transactions
  .get(async (req, res) => {
    console.log("in /stock-transactions route (GET) all stock transactions");
    try {
      const transactions = await StockTransaction.find();
      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(500).send("Internal server error: " + error);
    }
  })

  // POST a new stock transaction
  .post(validateRequest(StockTransaction.schema), async (req, res) => {
    console.log('in /stock-transactions Route (POST) new stock transaction to database')
    const { stockSymbol, type, quantity, price, userId } = req.body;
    console.log(req.body);

    if (!stockSymbol || !type || quantity === undefined || price === undefined || !userId) {
      return res.status(400).send("Stock symbol, type, quantity, price, and userId are required");
    }

    const transaction = new StockTransaction({
      stockSymbol,
      type,
      quantity,
      price,
      userId
    });

    try {
      const savedTransaction = await transaction.save();
      console.log("Stock transaction saved: ", savedTransaction);
      return res.status(201).json(savedTransaction);
    } catch (error) {
      return res.status(500).send("Unexpected error occurred when saving stock transaction to database: " + error);
    }
  })

// CRUD operations on /stock-transactions/u/:userId, separated user's data
stockTransactionRoute.route('/stock-transactions/u/:userId')
  // GET all stock transactions for a specific userId
  .get(async (req, res) => {
    const userId = req.params.userId;
    console.log('in /stock-transactions/u/:userId Route (GET) stock transactions with userId:' + JSON.stringify(userId));
    try {
      let transactions = await StockTransaction.find({ "userId": userId });
      if (!transactions.length) {
        return res.status(404).send(`No stock transactions with userId: ${userId} existed in database`);
      }
      return res.status(200).json(transactions);
    } catch (err) {
      return res.status(501).send(`Unexpected error occurred when looking for stock transactions with userId: ${userId} in database: ${err}`);
    }
  })

  // DELETE all stock transactions for a specific userId
  .delete(async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).send("Missing userId in request parameters");
    }
    console.log('In /stock-transactions/u/:userId Route (DELETE) for stock transactions with userId: ' + userId);
    try {
      let transactions = await StockTransaction.deleteMany({ "userId": userId });
      if (!transactions.deletedCount) {
        return res.status(404).send(`No stock transactions with userId: ${userId} existed in database`);
      }
      return res.status(200).send(`All stock transactions with userId: ${userId} deleted successfully`);
    } catch (err) {
      return res.status(501).send(`Unexpected error occurred when deleting stock transactions with userId: ${userId} from database: ${err}`);
    }
  });

export default stockTransactionRoute;
