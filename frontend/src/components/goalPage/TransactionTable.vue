<template>
    <div class="transaction-list">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
            <th>Amount ({{ selectedCurrency }})</th>
            <th>Category</th>
            <th>Transaction Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="trans in transactions"
            :key="trans._id || trans.account_id"
            :class="{
              income:
                trans.type === 'Income' ||
                (trans.type === 'revenue' && trans.amount < 0),
              expense:
                trans.type === 'Expense' ||
                (trans.type === 'revenue' && trans.amount > 0),
            }"
          >
            <td>{{ trans.description || trans.name }}</td>
            <td>{{ formattedDate(trans.date) }}</td>
            <td>
              {{
                selectedCurrency === 'USD'
                  ? formatCurrency(Math.abs(trans.amount).toFixed(2))
                  : formatCurrency(convertToVND(Math.abs(trans.amount)).toFixed(2))
              }}
            </td>
            <td>{{ trans.category || '-' }}</td>
            <td>
              {{
                trans.type === 'Expense' ||
                (trans.type === 'revenue' && trans.amount > 0)
                  ? 'Expense'
                  : 'Income'
              }}
            </td>
            <td class="buttons">
              <button @click="$emit('edit', trans)" style="margin-right: 10px; padding: 6px 12px">
                Edit
              </button>
              <button @click="$emit('remove', trans._id || trans.account_id)" style="padding: 6px 12px">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "TransactionTable",
    props: {
      transactions: Array,
      selectedCurrency: String,
    },
    emits: ["edit", "remove"],
    methods: {
      convertToVND(amount) {
        return amount * 23000;
      },
      formatCurrency(amount) {
        const currency = this.selectedCurrency;
        let formattedAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);
        if (currency === "USD") {
          formattedAmount = formattedAmount.replace("USD", "").trim();
        } else if (currency === "VND") {
          formattedAmount = formattedAmount.replace("₫", "").trim() + "₫";
        }
        return formattedAmount;
      },
      formattedDate(dateString) {
        const datePart = dateString.split("T")[0];
        const [year, month, day] = datePart.split("-");
        return `${month}/${day}/${year}`;
      },
    },
  };
  </script>
  
  <style scoped>
  .transaction-list table {
    width: 100%;
    border-collapse: collapse;
    color: var(--text-primary);
  }
  .transaction-list th,
  .transaction-list td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  .income {
    background-color: rgba(76, 175, 80, 0.1);
  }
  .expense {
    background-color: rgba(244, 67, 54, 0.1);
  }
  </style>
  