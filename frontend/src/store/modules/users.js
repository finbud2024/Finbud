export default {
    namespaced: true,
    state: {
        userID: null,
    },
    mutations: {
        SET_USER_ID(state, userID) {
            state.userID = userID;
        },
    },
    actions: {
        updateUserID({ commit }, userID) {
            commit('SET_THREAD_ID', userID);
        },
    },
    getters: {
        getUserID(state) {
            return state.userID;
        },
    },
};
