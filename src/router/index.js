import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresAuth: false
    }
  }
];

const router = new VueRouter({
  routes
});

/**
 * Check before changing each view if the user is authenticated, if not it will return to the login view
 */
router.beforeEach(async (to, from, next) => {
  let loggedIn = store.getters.isUserLogged;
  
  if (to.meta.requiresAuth != false) {
    if (!loggedIn) {
      next("/login");
      return;
    }
  }
  
  if (to.path.toLowerCase() === "/login" && loggedIn) {
    next("/");
    return;
  }
  
  next();  
});
export default router;
