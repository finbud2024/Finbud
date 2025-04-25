// // seedTransactions.js

// import fs from 'fs';
// import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();

// // Ensure you update this if running via Netlify Dev
// const FILE_PATH = './transactions.json';
// const USER_ID = '67d8f8f4d99e44814a2a64fe';
// const API_URL = process.env.API_URL || 'http://localhost:8888/.netlify/functions/server/transactions';

// async function seedTransactions() {
//   if (!fs.existsSync(FILE_PATH)) {
//     console.error(`❌ File not found: ${FILE_PATH}`);
//     return;
//   }

//   const raw = fs.readFileSync(FILE_PATH);
//   const data = JSON.parse(raw);
//   let success = 0;

//   console.log(`🚀 Starting to seed ${data.length} transactions...`);

//   for (const tx of data) {
//     const signedAmount = tx['Transaction Type'] === 'Income'
//       ? -Math.abs(tx['Amount (USD)'])
//       : Math.abs(tx['Amount (USD)']);

//     const payload = {
//       userId: USER_ID,
//       description: tx.description,
//       amount: tx.type === "Income" ? -Math.abs(tx.amount) : Math.abs(tx.amount),
//       date: tx.date,
//       type: tx.type,
//       category: tx.category,
//     };  

//     try {
//       const res = await axios.post(API_URL, payload);
//       console.log(`✅ Posted: ${payload.description}`);
//       success++;
//     } catch (err) {
//       console.error(`❌ Failed: ${payload.description}`);
//       if (err.response) {
//         console.error("  ↳ Status:", err.response.status);
//         console.error("  ↳ Message:", err.response.data);
//       } else {
//         console.error("  ↳ Error:", err.message);
//       }
//     }
//   }

//   console.log(`🎉 Done: ${success}/${data.length} transactions seeded.`);
// }

// seedTransactions();
