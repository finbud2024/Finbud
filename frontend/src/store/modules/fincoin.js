import axios from "axios";

const state = {
  balance: 0,
  transactions: [],
  isLoading: false,
};

const getters = {
  finCoinBalance: (state) => state.balance,
  finCoinTransactions: (state) => state.transactions,
  isFinCoinLoading: (state) => state.isLoading,
};

const actions = {
  async fetchFinCoinBalance({ commit }) {
    commit("SET_LOADING", true);
    try {
      const response = await axios.get(
        `http://localhost:3000/balance`,
        {
          withCredentials: true,
        }
      );
      commit("SET_BALANCE", response.data.balance);
    } catch (error) {
      console.error("Error fetching FinCoin balance:", error);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async fetchTransactions({ commit }) {
    commit("SET_LOADING", true);
    try {
      const response = await axios.get(
        `http://localhost:3000/transactions`,
        {
          withCredentials: true,
        }
      );
      commit("SET_TRANSACTIONS", response.data);
    } catch (error) {
      console.error("Error fetching FinCoin transactions:", error);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async earnFinCoins(
    { commit },
    { amount, source, sourceId = null, description = "" }
  ) {
    commit("SET_LOADING", true);
    try {
      const response = await axios.post(
        `http://localhost:3000/earn`,
        {
          amount,
          source,
          source_id: sourceId,
          description,
        },
        { withCredentials: true }
      );

      console.log("response", response);

      // Update the balance locally
      commit("SET_BALANCE", response.data.new_balance);

      // Return the transaction data in case the component needs it
      return response.data;
    } catch (error) {
      console.error("Error earning FinCoins:", error);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const mutations = {
  SET_BALANCE(state, balance) {
    state.balance = balance;
  },
  SET_TRANSACTIONS(state, transactions) {
    state.transactions = transactions;
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  // For real-time updates (could be triggered by WebSocket)
  UPDATE_BALANCE(state, newBalance) {
    state.balance = newBalance;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
