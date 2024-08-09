import axios from 'axios';

export async function handleReturnCryptoTable() {
  let coinData = [];
  try {
    const res = await axios.get("https://api.coinranking.com/v2/coins?timePeriod=7d", {
      headers: { 'x-access-token': process.env.VUE_APP_COINRANKING_KEY }
    });
    coinData = res.data.data.coins;
  } catch (error) {
    console.error('Failed to fetch crypto quotes:', error);
  }
  let tableTemplate = `
  <div style="font-weight: 900; font-size: 30px"> Top 5 Ranking Coins </div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Rank</th>
        <th>Tier</th>
        <th>Price</th>
        <th>Symbol</th>
        <th>Change</th>
      </tr>
    </thead>
    <tbody id="tableBody" class="table-body">`;
  coinData.slice(0, 5).map((item) => {
    tableTemplate += `
      <tr>
        <td><img style="width: 50px; aspect-ratio: 1;" src=${item.iconUrl} alt=${item.name}>${item.name}</td>
        <td>${item.rank}</td>
        <td>${item.tier}</td>
        <td>${parseFloat(item.price).toFixed(2)}$</td>
        <td>${item.symbol}</td>
        <td>${item.change}</td>
      </tr>
    `;
  });
  tableTemplate += `</tbody></table>`;
  return tableTemplate;
}
