import { createStore } from 'vuex';
import threads from './modules/threads';
import users from './modules/users';

// Create store
export default createStore({
    modules: {
        threads,
        users
    }
});