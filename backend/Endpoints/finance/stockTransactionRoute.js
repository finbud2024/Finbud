import express from 'express';
import StockTransaction from '../../Database_Schema/trading/StockTransaction.js';
import UserHolding from '../../Database_Schema/finance/UserHolding.js';
import User from '../../Database_Schema/core/User.js';
import validateRequest from '../../utils/validation/validateRequest.js';
import { isAuthenticated, isAdmin, isOwnerOrAdmin } from '../../middleware/auth.js';

const stockTransactionRoute = express.Router();

// CRUD operations on /stock-transactions/:transactionId
stockTransactionRoute.route('/stock-transactions/:transactionId')
  // GET a stock transaction by ID
  .get(isAuthenticated, async (req, res) => {
    const transactionId = req.params.transactionId;
    console.log('in /stock-transactions/:transactionId Route (GET) stock transaction with ID: ' + JSON.stringify(transactionId));
    try {
      let transaction = await StockTransaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).send(`No stock transaction with ID: ${transactionId} exists in the database.`);
      }
      
      // Check if user is authorized to access this transaction
      if (req.user.accountData.priviledge !== 'admin' && transaction.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only access your own transactions' });
      }
      
      return res.status(200).json(transaction);
    } catch (err) {
      return res.status(501).send(`Unexpected error occurred when looking for stock transaction with ID: ${transactionId} in database: ${err}`);
    }
  })

  // PUT: update a stock transaction with a given ID
  .put(isAuthenticated, validateRequest(StockTransaction.schema), async (req, res) => {
    const { stockSymbol, type, quantity, price, userId } = req.body;
    const transactionId = req.params.transactionId;

    if (!stockSymbol || !type || quantity === undefined || price === undefined || !userId) {
      return res.status(400).send("Stock symbol, type, quantity, price, and userId are required");
    }
    
    // Check if user is authorized to update this transaction
    if (req.user.accountData.priviledge !== 'admin' && userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own transactions' });
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
  .delete(isAuthenticated, async (req, res) => {
    const transactionId = req.params.transactionId;
    console.log('In /stock-transactions/:transactionId Route (DELETE) stock transaction with ID: ' + transactionId);

    try {
      // First check if the transaction exists and belongs to the user
      const transaction = await StockTransaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).send(`No stock transaction with ID: ${transactionId} exists in the database.`);
      }
      
      // Check if user is authorized to delete this transaction
      if (req.user.accountData.priviledge !== 'admin' && transaction.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own transactions' });
      }
      
      await StockTransaction.findByIdAndDelete(transactionId);
      console.log('Stock transaction deleted: ', transaction);
      return res.status(204).send('Stock transaction deleted successfully');
    } catch (error) {
      return res.status(501).send(`Unexpected error occurred when deleting stock transaction with ID: ${transactionId} in database: ${error}`);
    }
  });

// CRUD operations on /stock-transactions, all stock transactions in database
stockTransactionRoute.route('/stock-transactions')
  // GET all stock transactions
  .get(isAdmin, async (req, res) => {
    console.log("in /stock-transactions route (GET) all stock transactions");
    try {
      const transactions = await StockTransaction.find();
      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(500).send("Internal server error: " + error);
    }
  })

  // POST a new stock transaction
  .post(isAuthenticated, validateRequest(StockTransaction.schema), async (req, res) => {
    console.log('in /stock-transactions Route (POST) new stock transaction to database')
    const { stockSymbol, type, quantity, price, userId } = req.body;
    console.log(req.body);

    if (!stockSymbol || !type || quantity === undefined || price === undefined || !userId) {
      return res.status(400).send("Stock symbol, type, quantity, price, and userId are required");
    }
    
    // Check if user is authorized to create a transaction for this userId
    if (req.user.accountData.priviledge !== 'admin' && userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only create transactions for yourself' });
    }

    try {
      const user = await User.findById(userId);
      const holding = await UserHolding.findOne({userId : userId});
      if (!user || !holding) {
        return res.status(404).send("User not found");
      }

      const totalCost = quantity * price;

      if (type === "buy") {
        if (user.bankingAccountData.cash < totalCost) {
          return res.status(400).send("Insufficient cash to buy stocks");
        }
        user.bankingAccountData.cash = parseFloat(
          (user.bankingAccountData.cash - totalCost).toFixed(2)
        );
        user.bankingAccountData.stockValue = parseFloat(
          (user.bankingAccountData.stockValue + totalCost).toFixed(2)
        );
        let stock = holding.stocks.find(stock => stock.stockSymbol === stockSymbol);
        if (stock) {
          stock.quantity += quantity;
          stock.purchasePrice = parseFloat(
            (stock.purchasePrice + totalCost).toFixed(2)
          );
        }
        else {
          holding.stocks.push({ stockSymbol, quantity, purchasePrice: totalCost });
        }
      }
      else if (type === "sell") {
        let stock = holding.stocks.find(stock => stock.stockSymbol === stockSymbol);
        if (!stock || stock.quantity < quantity) {
          return res.status(400).send("Not enough stock value to sell");
        }
        user.bankingAccountData.cash = parseFloat(
          (user.bankingAccountData.cash + totalCost).toFixed(2)
        );
        user.bankingAccountData.stockValue = parseFloat(
          (user.bankingAccountData.stockValue - totalCost).toFixed(2)
        );
        stock.quantity -= quantity;
        stock.purchasePrice = parseFloat(
          (stock.purchasePrice - totalCost).toFixed(2)
        );

        if (stock.quantity === 0) {
          holding.stocks = holding.stocks.filter(stock => stock.stockSymbol !== stockSymbol);
        }
        
      }
      else {
        return res.status(400).send("Invalid transaction type");
      }

      await user.save();
      await holding.save();

      const transaction = new StockTransaction({
        stockSymbol,
        type,
        quantity,
        price,
        userId
      });

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
  .get(isOwnerOrAdmin, async (req, res) => {
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
  .delete(isOwnerOrAdmin, async (req, res) => {
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
