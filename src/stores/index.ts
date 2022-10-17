import { createPinia } from "pinia";
import PersistedState from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(PersistedState);

export { pinia };
