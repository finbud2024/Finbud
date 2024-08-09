import axios from 'axios';

export async function handleAddTransaction(userMessage) {
  const match = userMessage.match(/#add\s+([\w\s]+)\s+(\d+)/i);
  if (match) {
    const description = match[1].trim();
    const amount = parseInt(match[2], 10);
    const balance = await calculateNewBalance(amount);
    await addTransaction(description, amount, balance);
    return [`Transaction added: ${description}, $${amount}. New balance: $${balance}.`];
  } else {
    return ['Please specify the description and amount you want to add.'];
  }
}

async function calculateNewBalance(amount) {
  try {
    const userId = localStorage.getItem('token');
    const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${userId}`);
    const transactions = response.data;
    const currentBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    return currentBalance + amount;
  } catch (error) {
    console.error('Error calculating new balance:', error);
    throw error;
  }
}

async function addTransaction(description, amount, balance) {
  try {
    const response = await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
      description,
      amount,
      balance,
      date: new Date().toISOString(),
      userId: localStorage.getItem('token')
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
  }
}
