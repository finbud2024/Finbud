import { threadService } from '@/services/threadService';

export default {
  namespaced: true,
  state: {
    memories: {}, // threadId -> memory mapping
    loading: false,
    error: null
  },
  mutations: {
    SET_MEMORY(state, { threadId, memory }) {
      state.memories = { ...state.memories, [threadId]: memory };
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchThreadMemory({ commit }, threadId) {
      commit('SET_LOADING', true);
      try {
        const memory = await threadService.getThreadMemory(threadId);
        commit('SET_MEMORY', { threadId, memory });
        return memory;
      } catch (error) {
        commit('SET_ERROR', error.message);
        return { history: "" };
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  getters: {
    getMemoryByThreadId: (state) => (threadId) => {
      return state.memories[threadId] || { history: "" };
    }
  }
}; 