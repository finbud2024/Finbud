<template>
  <div class="transaction-wrapper">
    <div class="transaction-list">
      <table>
        <thead>
          <tr>
            <th>{{ $t('description') }}</th>
            <th>{{ $t('dateTime') }}</th>
            <th>{{ $t('amount') }} ({{ selectedCurrency }})</th>
            <th>{{ $t('category') }}</th>
            <th>{{ $t('transactionType') }}</th>
            <th>{{ $t('action') }}</th>
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
              {{ trans.type === 'Expense' || (trans.type === 'revenue' && trans.amount > 0)
                ? $t('expense')
                : $t('income') }}
            </td>
            <td class="buttons">
              <button @click="$emit('edit', trans)" style="margin-right: 10px; padding: 6px 12px">
                {{ $t('edit') }}
              </button>
              <button @click="$emit('remove', trans._id || trans.account_id)" style="padding: 6px 12px">
                {{ $t('remove') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
.transaction-wrapper {
  overflow-x: auto;
  width: 100%;
}

.transaction-list table {
  table-layout: fixed;
  min-width: 900px; /* this ensures there's enough space */
  width: 100%;
  border-collapse: collapse;
}
.transaction-list th:nth-child(1),
.transaction-list td:nth-child(1) {
  width: 24%; /* Description */
}

.transaction-list th:nth-child(2),
.transaction-list td:nth-child(2) {
  width: 12%;
}

.transaction-list th:nth-child(3),
.transaction-list td:nth-child(3) {
  width: 15%;
}

.transaction-list th:nth-child(4),
.transaction-list td:nth-child(4) {
  width: 18%;
}

.transaction-list th:nth-child(5),
.transaction-list td:nth-child(5) {
  width: 12%;
}

.transaction-list th:nth-child(6),
.transaction-list td:nth-child(6) {
  width: max-content;
  white-space: nowrap;
  padding-right: 4px;
}

.transaction-list .buttons {
  display: flex;
  gap: 2px;
}

.transaction-list button {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

  </style>
  