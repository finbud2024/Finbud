// // deleteTransactions.js
// import dotenv from 'dotenv';

// import mongoose from 'mongoose';
// import Transaction from './Database_Schema/Transaction.js'; 

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error('❌ MONGO_URI not found in .env file.');
//   process.exit(1);
// }

// async function deleteTransactions() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     const result = await Transaction.deleteMany({ userId: '67d8f8f4d99e44814a2a64fe' });
//     console.log(`✅ Deleted ${result.deletedCount} transactions.`);
//   } catch (err) {
//     console.error('❌ Error deleting transactions:', err);
//   } finally {
//     await mongoose.disconnect();
//   }
// }

// deleteTransactions();
