export default {
    namespaced: true,
    state: {
        userID: localStorage.getItem('token') || null,
    },
    mutations: {
        login(state, userID){
            console.log('login:', userID);
            localStorage.setItem('token', userID);
            state.userID = userID;
        },
        logout(state){
            console.log('logout');
            localStorage.clear();
            state.userID = null;
        },
    },
    actions: {
        login({commit}, userID){
            commit('login', userID);
        },
        logout({commit, dispatch}){
            commit('logout');
            dispatch("threads/updateThreadID", null, {root: true});
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.userID !== null;
        },
    },
};
