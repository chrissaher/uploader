<template>
  <div id="app">
    <div id="nav" v-show="true">
      <div v-if="isUserLogged">
        <router-link to="/">Upload</router-link>|
        <router-link to="/about">List</router-link>|
        <router-link @click.native="logout" to="/login">Logout</router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
import store from "@/store";

export default {
  mounted() {
    var checkExist = setInterval(function() {
      if (window.gapi) {
        clearInterval(checkExist);
      }
    }, 100); // check every 100ms
  },
  computed: {
    isUserLogged() {
      return store.getters.isUserLogged;
    }
  },
  methods: {
    logout() {
      var auth2 = window.gapi.auth2.getAuthInstance();
      var $router = this.$router;
      auth2.signOut().then(function() {
        store.commit("REMOVE_TOKEN");
        $router.push("/login");
      });
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
