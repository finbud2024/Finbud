import express from 'express';
import Transaction from '../Database Schema/Transaction.js';
import validateRequest from '../middleware/validateRequest.js';

const transactionRoute = express.Router();

// CRUD operations on /transactions/:transactionId
transactionRoute.route('/transactions/:transactionId')
  // GET a transaction by ID
  .get(async (req, res) => {
    const transactionId = req.params.transactionId;
    console.log('in /transactions/:transactionId Route (GET) transaction with ID: ' + JSON.stringify(transactionId));
    try {
      let transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).send(`No transaction with ID: ${transactionId} exists in the database.`);
      }
      return res.status(200).json(transaction);
    } catch (err) {
      return res.status(501).send(`Unexpected error occurred when looking for transaction with ID: ${transactionId} in database: ${err}`);
    }
  })

  // PUT: update a transaction with a given ID
  .put(validateRequest(Transaction.schema), async (req, res) => {
    const { description, amount, userId } = req.body;
    const transactionId = req.params.transactionId;

    if (!description || amount === undefined || !userId) {
      return res.status(400).send("Description, amount, and userId are required");
    }

    console.log('in /transactions/:transactionId Route (PUT) transaction with ID: ' + transactionId);

    const transactionType = amount > 0 ? 'receiving' : 'spending';

    try {
      const oldTransaction = await Transaction.findById(transactionId);
      if (!oldTransaction) {
        return res.status(404).send(`Cannot find transaction with ID: ${transactionId}`);
      }

      const balanceDifference = amount - oldTransaction.amount;

      const updatedTransaction = await Transaction.findByIdAndUpdate(
        transactionId,
        { userId, description, amount, transaction: transactionType },
        { new: true }
      );

      if (!updatedTransaction) {
        return res.status(404).send(`Cannot find transaction with ID: ${transactionId}`);
      }

      // Recalculate balances
      const transactions = await Transaction.find({ userId }).sort({ date: 1 });
      let newBalance = 0;
      transactions.forEach(tx => {
        newBalance += tx.amount;
        tx.balance = newBalance;
        tx.save();
      });

      console.log("Transaction updated: ", updatedTransaction);
      return res.status(200).json({ message: 'Transaction updated successfully', updatedTransaction, transactions });
    } catch (error) {
      return res.status(501).send(`Unexpected error occurred when looking for transaction with ID: ${transactionId} in database: ${err}`);
    }
  })

  // DELETE a transaction by ID
  .delete(async (req, res) => {
    const transactionId = req.params.transactionId;
    console.log('In /transactions/:transactionId Route (DELETE) transaction with ID: ' + transactionId);

    try {
      const transaction = await Transaction.findByIdAndDelete(transactionId);
      if (!transaction) {
        return res.status(404).send(`No transaction with ID: ${transactionId} exists in the database.`);
      }

      // Recalculate balances
      const transactions = await Transaction.find({ userId: transaction.userId }).sort({ date: 1 });
      let newBalance = 0;
      transactions.forEach(tx => {
        newBalance += tx.amount;
        tx.balance = newBalance;
        tx.save();
      });

      console.log('Transaction deleted: ', transaction);
      return res.status(204).send('Transaction deleted successfully');
    } catch (error) {
      return res.status(501).send(`Unexpected error occurred when looking for transaction with ID: ${transactionId} in database: ${err}`);
    }
  });

// CRUD operations on /transactions, all transactions in database
transactionRoute.route('/transactions')
  // GET all transactions
  .get(async (req, res) => {
    console.log("in /transactions route (GET) all transactions");
    try {
      const transactions = await Transaction.find();
      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(500).send("Internal server error: " + error);
    }
  })

  // POST a new transaction
  .post(validateRequest(Transaction.schema), async (req, res) => {
    console.log('in /transactions Route (POST) new transaction to database');
    const { description, amount, balance, userId } = req.body;

    if (!description || amount === undefined || balance === undefined || !userId) {
      return res.status(400).send("Unable to save. Description, amount, balance, and userId are required");
    }

    const transactionType = amount > 0 ? 'receiving' : 'spending';

    const transaction = new Transaction({
      userId: userId,
      description: description,
      amount: amount,
      balance: balance,
      transaction: transactionType
    });

    try {
      const savedTransaction = await transaction.save();
      console.log("Transaction saved: ", savedTransaction);
      return res.status(201).json(savedTransaction);
    } catch (error) {
      return res.status(500).send("Unexpected error occurred when saving transaction to database: " + error);
    }
  })

  // DELETE all transactions
  .delete(async (req, res) => {
    console.log("in /transactions/reset route (DELETE) all transactions");
    try {
      await Transaction.deleteMany({});
      return res.status(204).send('All transactions deleted successfully');
    } catch (error) {
      return res.status(500).send("Error deleting all transactions: " + error);
    }
  });

// CRUD operations on /transactions/u/:userId, separated user's data
transactionRoute.route('/transactions/u/:userId')
  // GET all transactions for a specific userId, GET transaction of a specific data according to userId
  .get(async (req, res) => {
    const userId = req.params.userId;
    console.log('in /transactions/u/:userId Route (GET) transactions with userId:' + JSON.stringify(userId));
    try {
      let transactions = await Transaction.find({ "userId": userId });
      if (!transactions.length) {
        return res.status(404).send(`No transactions with userId: ${userId} existed in database`);
      }
      return res.status(200).json(transactions);
    } catch (err) {
      return res.status(501).send(`Unexpected error occurred when looking for transactions with userId: ${userId} in database: ${err}`);
    }
  })

  // DELETE all transactions for a specific userId, RESET account balance of specific user
  .delete(async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).send("Missing userId in request parameters");
    }
    console.log('In /transactions/u/:userId Route (DELETE) for transactions with userId: ' + userId);
    try {
      let transactions = await Transaction.deleteMany({ "userId": userId });
      if (!transactions.deletedCount) {
        return res.status(404).send(`No transactions with userId: ${userId} existed in database`);
      }
      return res.status(200).send(`All transactions with userId: ${userId} deleted successfully`);
    } catch (err) {
      return res.status(501).send(`Unexpected error occurred when deleting transactions with userId: ${userId} from database: ${err}`);
    }
  });

export default transactionRoute;
