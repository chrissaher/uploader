<template>
    <div class="container">
        <b-table show-empty small stacked="sm" :items="items" :fields="fields">
            <template v-slot:cell(uploadDate)="date">
                {{ date.item.uploadDate | moment('DD/MM/YYYY hh:mm:ss') }}
            </template>
            <template v-slot:cell(options)="data">
            <b-button
                size="sm"
                @click="downloadItem(data, data.id, $event.target)"
                class="mr-1"
            >
                <b-icon-download></b-icon-download>
            </b-button>
            </template>
        </b-table>
    </div>
</template>
<script>
import axios from "axios";

export default {
    name: "ListPage",
    data() {
    return {
      fields: [
        {
          key: "fileName",
          label: "File Name",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "uploadDate",
          label: "Upload Date",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "options", label: "Options" }
      ],
      items: []
    };
  },
  created() {
      this.getList();
  },
  methods: {
      getList() {
        console.log("sending request: getList");
        axios
            .get(process.env.VUE_APP_NODE_SERVER + "getList")
            .then(response => {
                this.items = response.data;
            console.log(this.items);
            })
            .catch(error => {
            this.response = error.message;
            console.log(error.message);
            });
      },
      downloadItem() {

      }
  }     
};
</script>