import mongoose from 'mongoose';


const transactionSchema = new mongoose.Schema({
 description: { type: String, required: true },
 amount: { type: Number, required: true },
 date: { type: Date, default: Date.now }
});


const Transaction = mongoose.model('Transaction', transactionSchema);


export default Transaction;


// import mongoose from 'mongoose';
// import moment from 'moment-timezone';

// const transactionSchema = new mongoose.Schema({
//   description: { type: String, required: true },
//   amount: { type: Number, required: true },
//   date: { 
//     type: Date, 
//     default: () => moment().tz('America/New_York').toDate() // Washington, D.C. is in the 'America/New_York' timezone
//   }
// });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// export default Transaction;


