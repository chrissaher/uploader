import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isUserLogged: sessionStorage.getItem('usertoken') ? true : false,
    userToken: sessionStorage.getItem('usertoken')
  },
  mutations: {
    ADD_TOKEN(state, token) {
      state.userToken = token;
      sessionStorage.setItem('usertoken', token);
      state.isUserLogged = true;
    },
    REMOVE_TOKEN(state) {
      state.userToken = null;
      sessionStorage.removeItem('usertoken');
      state.isUserLogged = false;
    }

  },
  actions: {},
  modules: {},
  getters: {
    userToken(state) {
      if (!state.userToken) {
        state.userToken = sessionStorage.getItem('usertoken');
      }
      return state.userToken;
    },
    isUserLogged(state) {
      console.log(state.isUserLogged)
      return state.isUserLogged;
    }
  }
});
