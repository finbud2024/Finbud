import { createStore } from 'vuex';
import threads from './modules/threads';
import users from './modules/users';

export default createStore({
    modules: {
        threads,
        users
    }
});