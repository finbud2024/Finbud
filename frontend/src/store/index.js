import { createStore } from 'vuex';
import threads from './modules/threads';

// Create store
export default createStore({
    modules: {
        threads
    }
});