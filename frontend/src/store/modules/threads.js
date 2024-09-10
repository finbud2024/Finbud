export default {
    namespaced: true,
    state: {
        threadID: null,
    },
    mutations: {
        SET_THREAD_ID(state, threadID) {
            state.threadID = threadID;
        },
    },
    actions: {
        updateThreadID({ commit }, threadID) {
            commit('SET_THREAD_ID', threadID);
        },
    },
    getters: {
        getThreadID(state) {
            return state.threadID;
        },
    },
};
