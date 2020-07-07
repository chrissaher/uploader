<template>
  <div class="container">
    <b-card title="File Uploader" sub-title="Maximum file size: 1MB">
      <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
      <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "FrontPage",
  props: {
  },
  data() {
      return {
        file: null,
        }
    }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
