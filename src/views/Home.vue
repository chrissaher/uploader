<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <FrontPage />
  </div>
</template>

<script>
// @ is an alias to /src
import FrontPage from "@/components/FrontPage.vue";

export default {
  name: "Home",
  components: {
    FrontPage
  }
};
</script>
