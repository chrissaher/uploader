<template>
  <div class="container">
    <b-card title="File Uploader" sub-title="Maximum file size: 5MB">
      <b-form-file
        id="uploadFile"
        v-model="file"
        :state="Boolean(file)"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
      <div class="mt-3">Selected file: {{ file ? file.name : "" }}</div>

      <b-button @click="processFiles" class="mr-2">Upload</b-button>
    </b-card>
  </div>
</template>

<script>
import { EventEmitter } from "events";
import axios from "axios";
import md5 from "js-md5";

export default {
  name: "FrontPage",
  props: {},
  data() {
    let types = {
      TEXT: "Text",
      ARRAY_BUFFER: "ArrayBuffer"
    };

    return {
      file: null,
      fileHashId: null,
      chunks: [],
      eventEmiter: new EventEmitter(),
      options: {
        type: types.ARRAY_BUFFER,
        chunkSize: 1024 * 1024 //1MB
      }
    };
  },
  methods: {
    onCreateFile() {
      let _this = this;
      this.fileHashId = md5(this.ab2str(_this.file));

      var metadata = {
        fileHashId: this.fileHashId,
        fileName: this.file.name,
        additionalMetadata: {
          dateCreated: new Date(),
          fileSize: this.roundBytesToKB(this.file.size) + "KB"
        }
      };

      axios
        .post(process.env.VUE_APP_NODE_SERVER + "createFile", {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json"
          },
          data: JSON.stringify(metadata)
        })
        .then(function() {
          _this.splitFile(_this.file, _this.options, _this.eventEmiter);
        })
        .catch(function() {
          console.log("Error!!");
        });
    },
    onSaveChunks(data) {
      let _this = this;

      var metadata = {
        fileHashId: this.fileHashId,
        chunk: this.arrayBytesToString(data),
        position: this.chunks.length
      };
      axios
        .post(process.env.VUE_APP_NODE_SERVER + "saveChunk", {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json"
          },
          data: JSON.stringify(metadata)
        })
        .then(function() {
          console.log("Chunk uploaded on pos: " + _this.chunks.length - 1);
        })
        .catch(function() {
          console.log("Chunk error on position: " + _this.chunks.length - 1);
        });
    },
    processFiles() {
      let _this = this;

      this.eventEmiter = new EventEmitter();

      this.eventEmiter.on("data", function(data) {
        _this.chunks.push(data);
        console.log(
          "chunk[" +
            _this.chunks.length +
            "]: " +
            _this.roundBytesToKB(data.byteLength) +
            "KB"
        );
        _this.onSaveChunks(data);
      });

      this.eventEmiter.on("end", function() {
        //send request;
        console.log(
          "file size: " + _this.roundBytesToKB(_this.file.size) + " KB"
        );
        console.log("chunks number: " + _this.chunks.length);
      });

      this.eventEmiter.on("error", function(error) {
        console.log("errorsiño: " + error);
      });

      this.onCreateFile();
    },

    splitFile(file, options, emitter) {
      if (options === undefined) options = {};
      if (options.type === undefined) options.type = "Text";
      if (options.chunkSize === undefined) options.chunkSize = 64000;

      var offset = 0,
        method = "readAs" + options.type;

      var onLoadHandler = function(evt) {
        if (evt.target.error !== null) {
          emitter.emit("error", evt.target.error);
          return;
        }

        var data = evt.target.result;

        offset += options.chunkSize;
        emitter.emit("data", data);
        if (offset >= file.size) {
          emitter.emit("end");
        } else {
          readChunk(offset, options.chunkSize, file);
        }
      };

      var readChunk = function(_offset, length, _file) {
        var r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = onLoadHandler;
        r[method](blob);
      };

      readChunk(offset, options.chunkSize, file);

      return emitter;
    },
    roundBytesToKB(number) {
      return Math.round((number / 1024 + Number.EPSILON) * 100) / 100;
    },
    ab2str(buf) {
      return String.fromCharCode.apply(null, new Uint16Array(buf));
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
