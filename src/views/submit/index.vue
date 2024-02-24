<template>
    <div>
      <div class="content">
        
        <!-- 选择视频流 -->
        <el-card shadow="hover" style="margin: 20px;">
          <div slot="header" style="font-size: 20px;font-weight: bold;">选择视频流</div>
            <!-- todo:点击后填充post请求 -->

           <!-- 显示视频流 -->
<!-- 
            <div v-for="(value, node_addr) in info" style="display: inline-block; margin-right: 10px;">
                <div class="available-node"
                  v-for="(v, video_id) in value" 
                  v-on:click="selectItem({ key: node_addr + '-' + video_id })"
                  v-bind:class="{ 'selected': selected === node_addr + '-' + video_id }"
                  >
                  <ul style="list-style-type: none;">
                    <li class="subli">Addr: {{ node_addr }}</li>
                    <li class="subli">VideoID: {{ video_id }}</li>
                    <li class="subli">Description: {{ v.type }}</li>
                  </ul>
                </div>
              </div> -->
              <div style="display: flex;height: 300px;overflow-y: scroll;">
                <div v-for="item in info" style="display: inline-block; margin-right: 10px;">
                  <div class="available-node"
                    v-on:click="selectItem({ key:item })"
                    v-bind:class="{ 'selected': selected_label === item.source_label }"
                  >     
                  <ul style="list-style-type: none;font-size: 16px;" class="info-ui">
                    <li class="info-li">数据流类型: {{ item.source_type }}</li>
                    <li class="info-li">数据流名称: {{ item.source_name }}</li>
                    <li class="info-li">数据流列表: </li>
                    <div class="info-li" v-for="camera in item.camera_list" style="display: flex;">
                      <p style="visibility: hidden;">数据流列表:</p>
                      <!-- <div>{{ camera.name }}</div> -->
                      <el-tooltip
                          class="box-item"
                          effect="dark"
                          placement="right"
                          hide-after="10"
                          popper-class="tooltip-width"
                        >
                        <template #content>
                          推流地址:{{ camera.url }}<br/>
                          简要描述:{{ camera.describe }}<br/>
                          分辨率:{{ camera.resolution }}<br/>
                          帧率:{{ camera.fps }}<br/>
                        </template>
                          <el-button
                            type=""
                            text
                            >{{ camera.name }}</el-button
                          >
                        </el-tooltip>
                    </div>
                    <!-- <li v-for="camera in item.camera_list" style="margin-top: 10px;">
                        <el-tooltip
                          class="box-item"
                          effect="dark"
                          placement="right"
                          hide-after="10"
                          popper-class="tooltip-width"
                        >
                        <template #content>
                          推流地址:{{ camera.url }}<br/>
                          简要描述:{{ camera.describe }}<br/>
                          分辨率:{{ camera.resolution }}<br/>
                          帧率:{{ camera.fps }}<br/>
                        </template>
                          <el-button
                            type=""
                            text
                            >{{ camera.name }}</el-button
                          >
                        </el-tooltip>
                    </li> -->
                  </ul>
                </div>
                </div>
              </div>
              
          
        </el-card>

        <!-- 设置任务约束 -->
        <el-card shadow="hover" style="margin: 20px;">
          <div slot="header" style="font-size: 20px;font-weight: bold;">设置任务约束</div>
          <el-row>
            <el-col :span="12">
            
              <div style="flex: 1;margin-top: 30px;">
                <div>
                  <span class="param" style="margin-right: 20px;">紧急程度(0-1)</span>
                  <el-input v-model="urgency" placeholder="输入紧急程度" style="width: 100%; max-width: 200px;" />
                </div>
                <div style="margin-top: 10px;">
                  
                  <span class="param" style="margin-right: 20px;">重要程度(0-1)</span>
                  <el-input v-model="importance" placeholder="输入重要程度" style="width: 100%; max-width: 200px;" />
                </div>
              </div>
              
              
            
            </el-col>
            <el-col :span="12">
              <div style="flex: 1;margin-top: 30px;">
                <div>
                  <span class="param" style="margin-right: 20px;">时延约束(s)</span>
                  <el-input v-model="delay_constraint" placeholder="输入时延约束" style="width: 100%; max-width: 200px;margin-left: 63px;" />
                </div>
                <div style="margin-top: 10px;">
                  
                  <span class="param" style="margin-right: 20px;">精度约束(F1 Score)</span>
                  <el-input v-model="acc_constraint" placeholder="输入精度约束" style="width: 100%; max-width: 200px;" />
                </div>
              </div>
            </el-col>
          </el-row>
          
          <!-- 提交任务 -->
        <div style="display: flex; justify-content: center;margin-top: 20px;">
          <el-button type="primary" plain @click="submitTask" :loading="loading" :disabled="state!==open">开启数据流</el-button>
          <el-button type="danger" @click="stop_query" :disabled="state===open" :loading="kill_loading">关闭数据流</el-button>
        </div>
        

        </el-card>
      </div>
    </div>
  </template>
  
<script> 
import { ElMessage } from "element-plus";
export default {
data() {
    return {
        
        delay_constraint:null,
        acc_constraint:null,
        urgency:null,
        importance:null,

        loading:false,

        // 视频流信息
        info: "",
        
        // 已选择的视频流相关
        // selected:null,
        selected_label:null,

        state:null,
        source_label:null,

        kill_loading:false,

        };
    },
    methods: {

        // 获取视频流信息
        getInfo() {
          // console.log("getInfo!!");
          fetch("/api/node/get_video_info")
            .then((response) => response.json())
            .then((data) => {
              // console.log(data);
              this.info = data;
            })
            .catch((error) => {
              console.log("something error");
            });

        },

        // 选择视频流
        selectItem(item){
          console.log(item);
          this.selected_label = item.key.source_label;
          console.log(this.selected_label)
        },

        // 提交任务
        submitTask(){
          this.loading = true;
          const urgencyValue = parseFloat(this.urgency);
          const importanceValue = parseFloat(this.importance);
          if(urgencyValue + importanceValue !== 1){
            ElMessage.error('紧急程度+重要程度需要等于1')
            return;
          }
          fetch('/api/query/submit_query',{
            method: 'POST',
            body: {
              'source_label':this.selected_label,
              'delay_cons':this.delay_constraint,
              'acc_cons':this.acc_constraint,
              'urgency':this.urgency,
              'importance':this.importance
            }
          }).then((response)=> response.json())
          .then(data=>{
            const state = data.state;
            const msg = data.msg;
            this.loading = false;
            if(state === 'success'){
                ElMessage({
                  message: msg,
                  showClose: true,
                  type: "success",
                  duration: 3000,
                });
              }else{
                ElMessage({
                  message: msg,
                  showClose: true,
                  type: "error",
                  duration: 3000,
                });
              }
          }).catch(error =>{
            this.loading = false;
            // console.log('submit task fail');
            ElMessage.error("网络故障,上传失败");
          })
        },

        query_state(){
          fetch('/api/query_state').then((response) => response.json())
            .then(data =>{
              this.state = data.state;
              console.log(this.state);
              this.source_label = data.source_label;
            })
        },
        stop_query(){
          this.kill_loading = true;
          fetch('/api/stop_query',{
            method:'POST',
            body:{
              'source_label':this.source_label
            }
          }).then((response) => response.json())
            .then(data =>{
              const state = data.state;
              const msg = data.msg;
              if(state === 'success'){
                this.kill_loading = false;
                ElMessage({
                  message: msg,
                  showClose: true,
                  type: "success",
                  duration: 3000,
                });
              }else{
                this.kill_loading = false;
                ElMessage({
                  message: msg,
                  showClose: true,
                  type: "error",
                  duration: 3000,
                });
              }
            }).catch(error =>{
              this.kill_loading = false;
              // console.log('submit task fail');
              ElMessage.error("网络故障,上传失败");
            })
        }
  },
    mounted(){
      
      this.query_state();
      this.getInfo();
      // 静态填充
        this.info = [
        {
            "source_label": "car",
            "source_name": "交通监控摄像头",
            "source_type": "视频流",
            "camera_list":[
                {
                    "name": "摄像头1",
                    "url": "rtsp/114.212.81.11...",
                    "describe":"某十字路口",
                    "resolution": "1080p",
                    "fps":"25fps"
                },
                {
                    "name": "摄像头2",
                    "url": "rtsp/114.212.81.11...",
                    "describe":"某十字路口2",
                    "resolution": "1080p",
                    "fps":"15fps"
                }
            ]
        },
        {
            "source_label": "imu",
            "source_name": "交通监控摄像头",
            "source_type": "视频流",
            "camera_list":[
                {
                    "name": "摄像头1",
                    "url": "rtsp/114.212.81.11...",
                    "describe":"某十字路口",
                    "resolution": "1080p",
                    "fps":"25fps"

                },
                {
                    "name": "摄像头2",
                    "url": "rtsp/114.212.81.11...",
                    "describe":"某十字路口2",
                    "resolution": "1080p",
                    "fps":"15fps"
                }
            ]
        }

    ];
    console.log(this.info)
            
    },
};
</script>

<style>
.content {
margin-top: 20px;
}

.param{
    font-size: 18px;
}


.available-node{
  display: inline-block;
  margin: 20px;
  /* background-color: cadetblue; */
  width: 300px;
  border: 1px solid #5c5858;
  border-radius: 10px;
  height: 220px;
}
.info-li{
  margin-top: 10px;
  margin-left: 10px;
}



.centered-item{
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100%; */
}
.selected{
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

.outline{
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