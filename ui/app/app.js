import { appInit } from "./app-init.js";
import { appRoutes } from "./app.routes.js";
import { notify } from "../utils/notify.js";

(async () => {
  try {
    await appInit();
  } catch (e) {
    console.error('App init failed');
    console.error(e);
  }

  Vue.use(VueRouter);
  Vue.use(Buefy.default, { defaultIconPack: 'fa' });
  Vue.use(VuejsDialog.main.default);
  Vue.use(AWN.default);
  Vue.use(VueTabs);

  Vue.use({
    install: function(Vue, options) {
      Object.defineProperty(Vue.prototype, "componentId", {
        get: function componentId() {
          return this._uid;
        }
      });
    }
  });

  const router = new VueRouter({ routes: appRoutes });
  const appComp = new Vue({
    router,
    mounted() {
      setTimeout(() => {
        notify('info', 'App started');
      });
    }
  })
  .$mount('#app');

  Vue.$awn = appComp.$awn;
})();
