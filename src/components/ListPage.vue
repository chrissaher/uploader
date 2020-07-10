<template>
    <div class="container">
        <b-table show-empty small stacked="sm" :items="items" :fields="fields">
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
          sortDirection: "desc",
          formatter: "formatISOString"

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

      },
      formatISOString(isoString) {
      var result;
      var date = new Date(isoString);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var dt = date.getDate();
      var hour = date.getHours();
      var min = date.getMinutes();
      var sec = date.getSeconds();

      if (dt < 10) {
        dt = "0" + dt;
      }
      if (month < 10) {
        month = "0" + month;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      result =
        dt + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
      return result;
    }
  }
        
};
</script>