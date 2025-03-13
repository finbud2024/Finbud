import { createStore } from 'vuex';
import threads from './modules/threads';
import users from './modules/users';
import forum from "./modules/forum";

export default createStore({
    modules: {
        threads,
        users,
        forum 
    }
});