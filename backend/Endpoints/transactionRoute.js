import express from 'express';
import Transaction from '../Database Schema/Transaction.js';

const transactionRoute = express.Router();

// GET all transactions
transactionRoute.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new transaction
transactionRoute.post('/transactions', async (req, res) => {
  const { description, amount, balance } = req.body;

  if (!description || amount === undefined || balance === undefined) {
    return res.status(400).json({ message: 'Description, amount, and balance are required' });
  }

  const transactionType = amount > 0 ? 'receiving' : 'spending';

  const transaction = new Transaction({
    description,
    amount,
    balance,
    transaction: transactionType
  });

  try {
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT (to update) a transaction
transactionRoute.put('/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount, balance } = req.body;
  if (!description || amount === undefined || balance === undefined) {
    return res.status(400).json({ message: 'Description, amount, and balance are required' });
  }

  const transactionType = amount > 0 ? 'receiving' : 'spending';

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id, 
      { description, amount, balance, transaction: transactionType }, 
      { new: true }
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE all transactions
transactionRoute.delete('/transactions/reset', async (req, res) => {
  try {
    await Transaction.deleteMany({});
    res.status(204).json({ message: 'All transactions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a transaction
transactionRoute.delete('/transactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Transaction.findByIdAndDelete(id);
    res.status(204).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default transactionRoute;
