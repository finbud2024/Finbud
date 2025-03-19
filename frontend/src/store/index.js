import { createStore } from 'vuex';
import threads from './modules/threads';
import users from './modules/users';
import threadMemory from './modules/threadMemory';

// Create store
export default createStore({
    modules: {
        threads,
        users,
        threadMemory
    }
});