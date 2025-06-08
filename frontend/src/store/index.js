import { createStore } from "vuex";
import threads from "./modules/threads";
import users from "./modules/users";
import finCoin from "./modules/fincoin";

export default createStore({
  modules: {
    threads,
    users,
    finCoin,
  },
});
