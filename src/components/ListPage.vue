<template>
    <div class="container">
        <b-table show-empty small stacked="sm" :items="items" :fields="fields">
            <template v-slot:cell(uploadDate)="date">
                {{ date.item.uploadDate | moment('DD/MM/YYYY hh:mm:ss') }}
            </template>
            <template v-slot:cell(options)="data">
            <b-button
                size="sm"
                @click="downloadItem(data.item.hashId, data.item.fileName)"
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
import store from "@/store";

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
        
        const config = {
          headers: { Authorization: `Bearer ${store.getters.userToken}` }
        };

        axios
            .get(process.env.VUE_APP_NODE_SERVER + "getList", config)
            .then(response => {
                this.items = response.data;
                console.log(this.items);
            })
            .catch(error => {
            this.response = error.message;
            console.log(error.message);
            });
      },
      downloadItem(hashid, filename) {


      console.log("hashid: ", hashid)
      var metadata = {
        fileHashId: hashid,
      };

      function str2ab(str) {
        var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=str.length; i < strLen; i++) {
          bufView[i] = str.charCodeAt(i);
        }
        return bufView;
      }

      const config = {
        headers: { Authorization: `Bearer ${store.getters.userToken}` }
      };

      axios
          .post(process.env.VUE_APP_NODE_SERVER + "getFile", metadata, config)
          .then(response => {
              let abuffer = str2ab(response.data)
              let blob = new Blob([abuffer]);
              const url = window.URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.setAttribute('download', filename) //or any other extension
              document.body.appendChild(link)
              link.click()
          })
          .catch(error => {
          this.response = error.message;
          console.log(error.message);
          });
      }
  }
};
</script>
