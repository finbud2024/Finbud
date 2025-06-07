import express from "express";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const validateRequest = require('../../utils/validation/validateRequest.cjs');
import Transaction from "../../Database_Schema/finance/Transaction.js";

const transactionRoute = express.Router();

// CRUD operations on /transactions/:transactionId
transactionRoute
  .route("/transactions/:transactionId")
  // GET a transaction by ID
  .get(async (req, res) => {
    const transactionId = req.params.transactionId;
    console.log(
      "in /transactions/:transactionId Route (GET) transaction with ID: " +
        JSON.stringify(transactionId)
    );
    try {
      let transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res
          .status(404)
          .send(
            `No transaction with ID: ${transactionId} exists in the database.`
          );
      }
      return res.status(200).json(transaction);
    } catch (err) {
      return res
        .status(501)
        .send(
          `Unexpected error occurred when looking for transaction with ID: ${transactionId} in database: ${err}`
        );
    }
  })

  // PUT: update a transaction with a given ID
  .put(validateRequest(Transaction.schema), async (req, res) => {
    const { description, amount, userId, category } = req.body;
    const transactionId = req.params.transactionId;

    if (!description || amount === undefined || !userId) {
      return res
        .status(400)
        .send("Description, amount, and userId are required");
    }

    console.log(
      "in /transactions/:transactionId Route (PUT) transaction with ID: " +
        transactionId
    );

    const transactionType = amount > 0 ? "Income" : "Expense";

    try {
      const oldTransaction = await Transaction.findById(transactionId);
      if (!oldTransaction) {
        return res
          .status(404)
          .send(`Cannot find transaction with ID: ${transactionId}`);
      }

      const updatedTransaction = await Transaction.findByIdAndUpdate(
        transactionId,
        { userId, description, amount, type: transactionType, category },
        { new: true }
      );

      if (!updatedTransaction) {
        return res
          .status(404)
          .send(`Cannot find transaction with ID: ${transactionId}`);
      }

      console.log("Transaction updated: ", updatedTransaction);
      return res
        .status(200)
        .json({
          message: "Transaction updated successfully",
          updatedTransaction,
          transactions,
        });
    } catch (error) {
      return res
        .status(501)
        .send(
          `Unexpected error occurred when looking for transaction with ID: ${transactionId} in database: ${err}`
        );
    }
  })

  // DELETE a transaction by ID
  .delete(async (req, res) => {
    const transactionId = req.params.transactionId;
    console.log(
      "In /transactions/:transactionId Route (DELETE) transaction with ID: " +
        transactionId
    );

    try {
      const transaction = await Transaction.findByIdAndDelete(transactionId);
      if (!transaction) {
        return res
          .status(404)
          .send(
            `No transaction with ID: ${transactionId} exists in the database.`
          );
      }

      console.log("Transaction deleted: ", transaction);
      return res.status(204).send("Transaction deleted successfully");
    } catch (error) {
      return res
        .status(501)
        .send(
          `Unexpected error occurred when looking for transaction with ID: ${transactionId} in database: ${err}`
        );
    }
  });

// CRUD operations on /transactions, all transactions in database
transactionRoute
  .route("/transactions")
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
    console.log("Incoming POST body:", req.body);
    console.log("in /transactions Route (POST) new transaction to database");
    const { description, amount, userId, date, type, category, balance } = req.body;
    
    if (
      !description ||
      amount === undefined ||
      !userId ||
      !date ||
      !type
    ) {
      return res.status(400).send(
        "Unable to save. Description, amount, date, and userId are required"
      );
    }

    const transaction = new Transaction({
      userId,
      description,
      amount,
      balance,
      type,
      date,
      category, 
    });

    try {
      const savedTransaction = await transaction.save();
      console.log("Transaction saved: ", savedTransaction);
      return res.status(201).json(savedTransaction);
    } catch (error) {
      return res
        .status(500)
        .send(
          "Unexpected error occurred when saving transaction to database: " +
            error
        );
    }
  })

  // DELETE all transactions
  .delete(async (req, res) => {
    console.log("in /transactions/reset route (DELETE) all transactions");
    try {
      await Transaction.deleteMany({});
      return res.status(204).send("All transactions deleted successfully");
    } catch (error) {
      return res.status(500).send("Error deleting all transactions: " + error);
    }
  });

// CRUD operations on /transactions/u/:userId, separated user's data
transactionRoute
  .route("/transactions/u/:userId")
  // GET all transactions for a specific userId, GET transaction of a specific data according to userId
  .get(async (req, res) => {
    const userId = req.params.userId;
    console.log(
      "in /transactions/u/:userId Route (GET) transactions with userId:" +
        JSON.stringify(userId)
    );
    try {
      let transactions = await Transaction.find({ userId: userId });
      // Instead of returning a 404, return an empty array with 200 OK
      if (!transactions.length) {
        return res.status(200).json([]); // No transactions, but not an error
      }
      return res.status(200).json(transactions);
    } catch (err) {
      return res
        .status(501)
        .send(
          `Unexpected error occurred when looking for transactions with userId: ${userId} in database: ${err}`
        );
    }
  })

  // DELETE all transactions for a specific userId, RESET account balance of specific user
  .delete(async (req, res) => {
    const userId = req.params.userId;
    const source = req.body.source
    if (!userId) {
      return res.status(400).send("Missing userId in request parameters");
    }
    console.log(
      "In /transactions/u/:userId Route (DELETE) for transactions with userId: " +
        userId
    );
    try {
      let transactions = [];
      if (!source) {
        transactions = await Transaction.deleteMany({ "userId": userId });
      }
      else {
        transactions = await Transaction.deleteMany({ "userId": userId, "source": source });
      }
      // if (!transactions.deletedCount) {
      //   return res.status(404).send(`No transactions with userId: ${userId} existed in database`);
      // }
      return res.status(200).send(`All transactions with userId: ${userId} deleted successfully`);
    } catch (err) {
      return res
        .status(501)
        .send(
          `Unexpected error occurred when deleting transactions with userId: ${userId} from database: ${err}`
        );
    }
  });

export default transactionRoute;
