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
 const { description, amount } = req.body;


 if (!description || !amount) {
   return res.status(400).json({ message: 'Description and amount are required' });
 }


 const transaction = new Transaction({
   description,
   amount
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
   const { description, amount } = req.body;
    if (!description || !amount) {
     return res.status(400).json({ message: 'Description and amount are required' });
   }
    try {
     const updatedTransaction = await Transaction.findByIdAndUpdate(id, { description, amount }, { new: true });
     res.status(200).json(updatedTransaction);
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
});


// Delete a transaction in the list
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


