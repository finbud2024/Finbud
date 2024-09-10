export default {
    namespaced: true,
    state: {
        currentThreadID: null,
    },
    mutations: {
        SET_THREAD_ID(state, threadID) {
            state.currentThreadID = threadID;
        },
    },
    actions: {
        updateThreadID({ commit }, threadID) {
            commit('SET_THREAD_ID', threadID);
        },
    },
    getters: {
        getThreadID(state) {
            return state.currentThreadID;
        },
    },
};
