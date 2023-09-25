<template>
      <!-- <el-card class="box-card"> -->
      <form @submit.prevent="uploadFiles">
        <div>
          <div>
            <h3>选择服务配置文件</h3>
          </div>
          <div>
            <input
              ref="jsonInput"
              type="file"
              accept=".json"
              class="input-font"
            />
          </div>
        </div>
        <br>
        <div>
          <h3>选择服务代码</h3>
        </div>
        <div>
          <el-button type="info" round @click="addFileInput">+</el-button>
          <el-button type="info" round @click="removeFileInput">-</el-button>
        </div>
        <br>
        <div v-for="(fileInput, index) in fileInputs" :key="index">
          <div>
            <input
              type="text"
              placeholder="请输入阶段名"
              v-model="fileInputs[index].name"
            />
          </div>
          <div>
            <input
              ref="codeInput"
              type="file"
              accept=".zip"
              @change="
                [
                  (fileInputs[index].file = $event.target.files[0]),
                  updateFileName($event, index),
                ]
              "
            />
          </div>
          <!-- <div>
            <input
              ref="codeCtx"
              type="file"
              accept=".json"
              @change=""
            />
          </div> -->
        </div>
  
        <!-- <el-button type="primary" plain native-type="submit">Submit</el-button> -->
        <div>
          <el-button type="primary" round native-type="submit" :loading="loading"
            >安装服务</el-button>
        </div>
      </form>
  </template>
  
  <script>
  import { ElButton } from "element-plus";
  import { ElMessage } from "element-plus";
  export default {
    components: {
      ElButton,
    },
    data() {
      return {
        fileInputs: [],
        loading: false,
      };
    },
    methods: {
      updateFileName(event, index) {
        const fileName = event.target.files[0].name;
        const fileNameWithoutExtension = fileName
          .split(".")
          .slice(0, -1)
          .join(".");
        this.fileInputs[index].name = fileNameWithoutExtension;
      },
      addFileInput() {
        this.fileInputs.push({ name: "", file: null });
      },
      removeFileInput() {
        this.fileInputs.pop();
      },
      uploadFiles() {
        this.loading = true;
        const jsonFile = this.$refs.jsonInput.files[0];
        const formData = new FormData();
        formData.append("task_json", jsonFile);
        for (let i = 0; i < this.fileInputs.length; i++) {
          const codeFile = this.fileInputs[i].file;
          formData.append(this.fileInputs[i].name, codeFile);
        }
        console.log(formData);
  
        const controller = new AbortController();
        const signal = controller.signal;
  
        const timeout = setTimeout(() => {
          controller.abort();
          this.loading = false;
          alert("上传超时，提交失败！");
        }, 30000);
        fetch("/serv/upload-json-and-codefiles-api", {
          method: "POST",
          body: formData,
          signal: signal,
        })
          .then((response) => {
            clearTimeout(timeout); // 清除超时定时器
            if (!response.ok) {
              alert("提交失败！");
              throw new Error("Network response was not ok");
            }
            alert("提交成功！");
            return response.text();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  };
  </script>
  
  <style scoped>
  body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  form {
    max-width: 600px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); */
  }

  h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }

  input[type="text"],
  input[type="file"] {
    width: calc(100% - 20px);
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  input[type="file"] {
    cursor: pointer;
  }

  .el-button {
    font-size: 16px;
    margin-right: 10px;
  }

  .el-button:first-child {
    margin-left: 0;
     
  }
</style>

  
  
  