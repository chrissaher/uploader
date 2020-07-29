<template>
  <div id="app">
    <h1>Login</h1>
    <div class="text-center">
      <div id="google-signin-button" class="g-signin2"></div>
      <!-- <div id="my-signin2"></div> -->
    </div>
  </div>
</template>
<script>
import axios from "axios";
import store from "@/store";

export default {
  mounted() {
    // var $this = this;
    var config = {
      onsuccess: this.onSignIn
    };
    var checkExist = setInterval(function() {
      if (window.gapi) {
        clearInterval(checkExist);
        window.gapi.signin2.render("google-signin-button", config);
      }
    }, 100); // check every 100ms
  },
  methods: {
    onSignIn(googleUser) {
      let axiosConfig = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          Authorization: googleUser.wc.id_token
        }
      };
      axios
        .post(
          process.env.VUE_APP_NODE_SERVER + "users/GoogleSSO",
          {},
          axiosConfig
        )
        .then(r => {
          store.commit("ADD_TOKEN", r.data.token);
          this.$router.push("/");
        });
    }
  }
};
</script>

<style>
.g-signin2 {
  width: 100%;
}

.g-signin2 > div {
  margin: 0 auto;
}
</style>
