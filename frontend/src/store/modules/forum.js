export default {
    namespaced: true,
    state: {
      threads: {
        "p/general": [
          { id: 1, forum: "p/general", author: "John Doe", date: "2h ago", title: "Best investment strategies?", content: "Looking for solid investment strategies for 2025.", comments: 12, likes: 360 },
        ],
        "p/investing": [
          { id: 2, forum: "p/investing", author: "Jane Smith", date: "5h ago", title: "How to manage financial risks?", content: "Looking for ways to handle financial risks effectively.", comments: 10, likes: 150 },
        ],
        "p/crypto": [
          { id: 3, forum: "p/crypto", author: "Alice Johnson", date: "1h ago", title: "Latest crypto trends?", content: "What do you think about the latest trends in cryptocurrency?", comments: 8, likes: 220 },
        ],
      }
    },
    mutations: {
      ADD_THREAD(state, { forum, thread }) {
        if (!state.threads[forum]) {
          state.threads[forum] = [];
        }
        state.threads[forum].unshift(thread);
      }
    },
    actions: {
      addNewThread({ commit }, { forum, thread }) {
        commit("ADD_THREAD", { forum, thread });
      }
    },
    getters: {
      getForumThreads: (state) => (forum) => {
        return state.threads[forum] || [];
      }
    }
  };
  