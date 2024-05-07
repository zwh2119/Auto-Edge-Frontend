<template>
  <div>
    <div class="content">

      <!-- 选择视频流 -->
      <!-- <el-card shadow="hover" style="margin: 20px;display: flex;justify-content: center;"> -->
      <el-card shadow="hover" style="margin: 20px;">
        <div style="display: flex; align-items: center;">
          <h3>数据流</h3>
          <input type="file" ref="fileInput" style="width: 300px; margin-left: 20px;"/>
          <!-- <button @click="uploadFile">上传文件</button> -->
          <el-button plain @click="uploadFile" style="margin-left: 20px;">上传文件</el-button>
        </div>


        <!-- 显示视频流 -->
        <div style="display: flex;height: 300px;overflow-y: scroll;justify-content: center;">
          <div v-for="item in info" style="display: inline-block;">
            <div class="available-node"
                 v-on:click="selectItem({ key:item })"
                 v-bind:class="{ 'selected': selected_label === item.source_label }"
            >
              <ul style="list-style-type: none;font-size: 16px;" class="info-ui">
                <li class="info-li">数据流类型: {{ item.source_type }}</li>
                <li class="info-li">数据流名称: {{ item.source_name }}</li>
                <li class="info-li">数据流列表:</li>
                <div class="info-li" v-for="camera in item.camera_list" style="display: flex;justify-content: center;">
                  <div style="width: 100%; display: flex; align-items: center;">
                    <!-- <p style="visibility: hidden;">数据流列表:</p> -->
                    <div style="margin-right: 10px;">{{ camera.name }}</div>
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        placement="right"
                        :hide-after="10"
                        popper-class="tooltip-width"
                    >
                      <template #content>
                        推流地址:{{ camera.url }}<br/>
                        简要描述:{{ camera.describe }}<br/>
                        <div v-if="camera.resolution">分辨率:{{ camera.resolution }}</div>
                        <div v-if="camera.fps">帧率:{{ camera.fps }}</div>
                      </template>
                      <el-button
                          type=""
                          text
                      >查看详情
                      </el-button
                      >
                    </el-tooltip>
                  </div>
                </div>

              </ul>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: center;margin-top: 20px;">
          <el-button type="primary" :disabled="state==='open' || selected_label === null" :loading="loading"
                     @click="submitTask">开启数据流
          </el-button>
          <el-button type="danger" :disabled="state!=='open' || selected_label !== source_label" :loading="kill_loading"
                     @click="stop_query">关闭数据流
          </el-button>
        </div>


      </el-card>

    </div>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  data() {
    return {


      loading: false,

      // 视频流信息
      info: null,

      // 已选择的视频流相关
      selected_label: null,

      state: null,
      source_label: null,

      kill_loading: false,

    };
  },
  methods: {
    showMsg(state, msg) {
      if (state === 'success') {
        ElMessage({
          message: msg,
          showClose: true,
          type: "success",
          duration: 3000,
        });
      } else {
        ElMessage({
          message: msg,
          showClose: true,
          type: "error",
          duration: 3000,
        });
      }
    },
    handleError(error) {
      ElMessage.error("出错了,请联系管理员")
      console.log(error);
    },
    uploadFile() {
      // 获取文件输入框的引用
      const fileInput = this.$refs.fileInput;
      console.log(fileInput.files.length);

      if (fileInput.files.length > 0) {
        const formData = new FormData();
        // 将文件添加到FormData对象中
        formData.append('file', fileInput.files[0]);

        const url = '/api/datasource_config';

        // 发送POST请求
        fetch(url, {
          method: 'POST',
          body: formData
        })
            .then(response => response.json())
            .then(data => {
              const state = data['state']
              const msg = data['msg']
              this.showMsg(state, msg);
              this.getInfo();
            })
            .catch(error => {
              this.handleError(error)
            });
      } else {
        ElMessage.error("请选择文件")
      }
    },

    // 获取视频流信息
    getInfo() {
      fetch("/api/node/get_video_info")
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            this.info = data;
          })
          .catch((error) => {
            this.handleError(error)
          });

    },

    // 选择视频流
    selectItem(item) {
      this.selected_label = item.key.source_label;
      // console.log(this.selected_label)
      // console.log(this.source_label);
    },

    // 提交任务
    submitTask() {
      // 检查所有字段是否都已填写
      if (!this.selected_label || !this.delay_constraint || !this.acc_constraint || !this.urgency || !this.importance) {
        ElMessage.error('请选择数据流并且填写所有字段');
        return;
      }
      // 检查紧急程度和重要程度之和是否等于1
      const urgencyValue = parseFloat(this.urgency);
      const importanceValue = parseFloat(this.importance);
      if (isNaN(urgencyValue) || isNaN(importanceValue) || urgencyValue + importanceValue !== 1) {
        ElMessage.error('紧急程度 + 重要程度需要等于1');
        return;
      }

      this.loading = true;

      const content = {
        'source_label': this.selected_label,
        'delay_cons': this.delay_constraint,
        'acc_cons': this.acc_constraint,
        'urgency': this.urgency,
        'importance': this.importance
      }
      const task_info = JSON.stringify(content);
      fetch('/api/query/submit_query', {
        method: 'POST',
        body: task_info
      }).then((response) => response.json())
          .then(data => {
            const state = data.state;
            let msg = data.msg;
            this.loading = false;
            if (state === 'success') {
              this.state = 'open';
              msg += ',页面即将刷新'
              setTimeout(() => {
                location.reload();
              }, 3000);
            }
            localStorage.setItem('source_item', this.selected_label)
            this.showMsg(state, msg)
          }).catch(error => {
        this.loading = false;
        this.handleError(error)
      })
    },

    query_state() {
      fetch('/api/query_state').then((response) => response.json())
          .then(data => {
            this.state = data.state;
            console.log(this.state);
            this.source_label = data.source_label;
            // console.log("query:" + this.source_label);
            // console.log("query:" + this.selected_label)
          })
    },
    stop_query() {
      this.kill_loading = true;
      const content = {
        'source_label': this.source_label
      }
      const task_info = JSON.stringify(content)
      console.log(task_info)
      fetch('/api/stop_query', {
        method: 'POST',
        body: task_info
      }).then((response) => response.json())
          .then(data => {
            const state = data.state;
            const msg = data.msg;
            if (state === 'success') {
              this.kill_loading = false;
              this.state = 'close'
              this.selected_label = null;
              localStorage.removeItem('source_item');
            } else {
              this.kill_loading = false;
            }
            this.showMsg(state, msg);
          }).catch(error => {
        this.kill_loading = false;
        // console.log('submit task fail');
        this.handleError(error)
      })
    }
  },
  mounted() {

    this.query_state();
    this.getInfo();
    this.selected_label = localStorage.getItem('source_item')
    console.log('mount:', this.selected_label);
    // console.log(this.info)

  },
};
</script>

<style>
.content {
  margin-top: 20px;
}

.param {
  font-size: 18px;
}


.available-node {
  display: inline-block;
  margin: 20px;
  /* background-color: cadetblue; */
  width: max-content;
  border: 1px solid #5c5858;
  border-radius: 10px;
  height: 220px;
}

.info-li {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}


.centered-item {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100%; */
}

.selected {
  /* background-color: rgb(96, 158, 254);
  color:white; */
  background-color: #deebf7;;
}

select {
  width: 100%;
  padding: 10px; /* 自定义内边距 */
  background-color: transparent; /* 透明背景色 */
  border: none; /* 移除默认边框 */
  outline: none; /* 移除选中边框 */
  appearance: none; /* 隐藏默认下拉箭头 */
  cursor: pointer; /* 鼠标样式 */
}
</style>
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

.outline {
  /* max-width: 600px; */
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); */
}


.el-button {
  font-size: 16px;
  margin-right: 10px;
}

.el-button:first-child {
  margin-left: 0;

}

</style>