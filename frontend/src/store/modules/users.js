import axios from "axios";

export default {
  namespaced: true,
  state: {
    userID: null,
    userData: null,
    isLoading: true,
    error: null,
    _promise: null,
    authChecked: false, 
  },
  mutations: {
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setError(state, error) {
      state.error = error;
    },
    setUserData(state, userData) {
      state.userData = userData;
      state.userID = userData ? userData._id : null;
    },
    clearUserData(state) {
      state.userData = null;
      state.userID = null;
    },
    setAuthChecked(state, val) {          
      state.authChecked = val;
    },
  },
  actions: {
    async fetchCurrentUser ({ state, commit }) {
      /* 1️⃣ already checked during this page-life? */
      if (state.authChecked) return state.userData;
  
      /* 2️⃣ another call already in flight?  → just await it here */
      if (state._promise) {
        try {
          await state._promise;          // swallow its own error handling
        } catch (_) { /* nothing – original promise handler already did the work */ }
        return state.userData;           // never expose the raw promise
      }
  
      /* 3️⃣ first call today */
      commit('setLoading', true);
      commit('setError', null);
  
      state._promise = axios.get(
        `${process.env.VUE_APP_DEPLOY_URL}/auth/current-user`,
        { withCredentials: true }
      );
  
      try {
        const { data } = await state._promise;
  
        if (data.isAuthenticated && data.user) {
          commit('setUserData', data.user);
        } else {
          commit('clearUserData');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          commit('clearUserData');
          // router.push('/login')  // optional
        } else {
          commit('setError', err.message || 'Failed to fetch user data');
        }
      } finally {
        commit('setLoading', false);
        commit('setAuthChecked', true);  // mark that we tried once
        state._promise = null;           // reset so a manual refresh is possible
      }
  
      return state.userData;     
      // try {
      //   const response = await axios.get(
      //     `${process.env.VUE_APP_DEPLOY_URL}/auth/current-user`,
      //     {
      //       withCredentials: true,
      //     }
      //   );

      //   if (response.data.isAuthenticated && response.data.user) {
      //     commit("setUserData", response.data.user);
      //   } else {
      //     commit("clearUserData");
      //   }
      // } catch (error) {
      //   console.error("Error fetching current user:", error);
      //   commit("setError", error.message || "Failed to fetch user data");
      //   commit("clearUserData");
      // } finally {
      //   commit("setLoading", false);
      // }
    },
    async login({ commit, dispatch }, userData) {
      commit("setUserData", userData);

      // Check if the user is new (this information might be in the userData)
      if (userData && userData.isNewUser) {
        console.log(
          "New user detected in login action, setting localStorage flag"
        );
        localStorage.setItem("isNewUser", "true");
      }

      // After login, fetch the complete user data
      await dispatch("fetchCurrentUser");
    },
    async logout({ commit }) {
      commit("clearUserData");
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.userID !== null;
    },
    isAuthLoading(state) {
      return state.isLoading;
    },
    currentUser(state) {
      return state.userData;
    },
    userId(state) {
      return state.userID;
    },
    userProfileImage(state) {
      return state.userData && state.userData.identityData
        ? state.userData.identityData.profilePicture
        : null;
    },
    userDisplayName(state) {
      return state.userData && state.userData.identityData
        ? state.userData.identityData.displayName
        : "User";
    },
  },
};
