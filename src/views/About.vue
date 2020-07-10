<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <ListPage />
  </div>
</template>

<script>
// @ is an alias to /src
import ListPage from "@/components/ListPage.vue";

export default {
  name: "About",
  components: {
    ListPage
  }
};
</script>