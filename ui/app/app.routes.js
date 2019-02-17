import { HomePage } from "../pages/home/home.page.ctrl.js";

export const appRoutes = [
  { path: '/home', component: HomePage },
  { path: '*', redirect: '/home' }
];
