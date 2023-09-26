<template>
    <div>
      <div class="content">
        
        <!-- 选择视频流 -->
        <el-card shadow="hover" style="margin: 20px;">
          <div slot="header" style="font-size: 20px;font-weight: bold;">选择视频流</div>
          <!-- <el-input v-model="input1" placeholder="请输入内容"></el-input>
          <el-button @click="nextStep(0)">下一步</el-button> -->
          <!-- <div v-for="(value, node_addr) in info" :node_addr="node_addr"> -->
            <!-- todo:点击后填充post请求 -->

            <!-- <div
              class="available-node"
              v-for="(v, video_id) in value"
              v-on:click="selectItem({ key: node_addr + '-' + video_id })"
            > -->
            <!-- 显示视频流 -->

            <!-- <div v-for="(value, node_addr) in info" style="display: inline-block; margin-right: 10px;">
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

            <el-carousel :autoplay="false" arrow="always" trigger="click">
              <el-carousel-item v-for="(value, node_addr, index) in info" :key="index">
                <div class="carousel-item-content">
                  <div class="horizontal-scroll-container">
                    <div v-for="(v, video_id) in value" class="available-node"
                    v-on:click="selectItem({ key: node_addr + '-' + video_id })"
                    v-bind:class="{ 'selected': selected === node_addr + '-' + video_id }"
                    >
                      <div class="centered-item">
                        <ul style="list-style-type: none;"
                        >
                          <li class="subli">IP地址: {{ node_addr }}</li>
                          <li class="subli">摄像头ID: {{ video_id }}</li>
                          <li class="subli">描述: {{ v.type }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          
        </el-card>

        
        <el-card shadow="hover" style="margin: 20px;">
          <div slot="header" style="font-size: 20px;font-weight: bold;">当前配置情况</div>
          <!-- {{ ipVideoFlowInfo }} -->
          <el-table :data="ipVideoFlowInfo" style="width: 100%">
              <el-table-column label="IP地址" width="300">
              <template #default="scope">
                  <div style="display: flex; align-items: center">
                  <!-- <el-icon><timer /></el-icon> -->
                  <span style="margin-left: 10px">{{ scope.row.selectedIp }}</span>
                  </div>
              </template>
              </el-table-column>
              <el-table-column label="摄像头ID" width="200">
              <template #default="scope">
                  <div>{{ scope.row.selectedVideoId }}</div>
              </template>
              </el-table-column>
              <el-table-column label="当前配置套餐" width="500">
              <template #default="scope">
                  <div>{{ scope.row.selectedFlow['dag_name'] }}</div>
              </template>
              </el-table-column>
              
          </el-table>

        </el-card>
        

        <!-- 设置任务约束 -->
        <el-card shadow="hover" style="margin: 20px;">
          <div slot="header" style="font-size: 20px;font-weight: bold;">设置任务约束</div>
          <el-row>
            <el-col :span="12">
            

              <table style="margin-top: 30px;">
                <tr>
                  <td><span class="param">选择处理流水线</span></td>
                  <td>
                    <div class="custom-select" style="margin-left: 50px;">
                    <!-- <select v-model="selectedFlow">
                      <option value="" disabled selected>选择处理流水线</option>
                      <option 
                        v-for="item in flows"
                        :key="item['dag_name']"
                        :value="item['dag']"
                      >
                        {{ item['dag_name'] }}
                      </option>
                    </select> -->
                    <select v-model="selectedFlow">
                      <option value="" disabled selected>选择处理流水线</option>
                      <option 
                        v-for="item in flows"
                        :key="item['dag_name']"
                        :value="{ 'dag': item['dag'], 'dag_name': item['dag_name'] }"
                      >
                        {{ item['dag_name'] }}
                      </option>
                    </select>

                    
                    <span class="custom-arrow">&#9662;</span>
                  </div>
                  </td>
                </tr>

                <tr style="margin-top: 30px;">
                  <td><span class="param">选择优化模式</span></td>

                  <td>
                    <div class="custom-select" style="margin-left: 50px;">
                    <select v-model="selectedMode">
                      <option value="" disabled selected>选择优化模式</option>
                      <option 
                        v-for="item in options"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </option>
                    </select>
                    <span class="custom-arrow">&#9662;</span>
                  </div>
                  </td>
                </tr>
              </table>
              
            
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
          <el-button type="primary" plain @click="submitText">提交任务</el-button>
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
        activeStep: 0, // 当前激活的步骤索引
        selectedMode:"", // 时延优先vs精度优先
        options:[
            {
                value:'latency',
                label:'时延优先',
            },
            {
                value:'accuracy',
                label:'精度优先',
            }
        ],
        delay_constraint:null,
        acc_constraint:null,

        // 视频流信息
        info: "",
        // 已装载服务
        servicesList: ['face_alignment','face_detection','car_detection'],
        // 已选择的流水线
        selectedServices:[],

        // 点击已装载的服务按钮后改变按钮样式 info->primary plain->no plain
        buttonTypes: [],
        isPlain: [], // 初始化按钮是否 plain 的数组
        
        // 已选择的视频流相关
        selected:null,
        inputText: null,
        sendUrl:"",

        selectedIp:null,
        selectedVideoId: null,

        // 任务相关
        submit_jobs: [],
        job_info_dict:{},

        // 分页控件
        itemsPerPage: 3, // 每页显示的数量
        currentPage: 1, // 当前页数

        // flow list(套餐)
        flows:[],
        // 选择的flow
        selectedFlow:"",
        get_dag_url:null,

        // 每个摄像头的套餐配置情况
        ipVideoFlowInfo:[],
        };
    },
    methods: {
        changeButtonType(id,serv) {
          if (this.buttonTypes[id] === "info") {
            // 如果按钮类型是 "info"，将其改为 "primary" 并添加到 selectedServices 中
            this.buttonTypes[id] = "primary";
            this.selectedServices.push(serv);
            this.isPlain[id] = false;
          } else {
            // 如果按钮类型是 "primary"，将其改回 "info" 并从 selectedServices 中删除
            this.buttonTypes[id] = "info";
            this.isPlain[id] = true;
            const index = this.selectedServices.indexOf(serv);
            if (index !== -1) {
              this.selectedServices.splice(index, 1);
            }
          }
          // console.log(this.isPlain[id]);
        },

        // 出错处理
        errHandler(err) {
          console.error(error);
          sessionStorage.clear();
          // 清空已有任务
          this.submit_jobs = [];
          // 更新sessionStorage
          sessionStorage.setItem("submit_jobs", JSON.stringify(this.submit_jobs));
          // ?
          // sessionStorage.setItem("delayCons", JSON.stringify(this.delayCons));
          // sessionStorage.setItem("accCons", JSON.stringify(this.accCons));
        },

        // 获取视频流信息
        getInfo() {
          // console.log("getInfo!!");
          fetch("/dag/node/get_video_info")
            .then((response) => response.json())
            .then((data) => {
              // console.log(data);
              this.info = data;
            })
            .catch((error) => {
              errHandler(error);
            });

          // 获取计算服务信息
          fetch("/serv/get_service_list")
            .then((resp) => resp.json())
            .then((data) => {
              this.servicesList = data;
              // console.log(this.servicesList)
              this.buttonTypes = new Array(this.servicesList.length).fill("info");
              this.isPlain = new Array(this.servicesList.length).fill(true);
            })
            .catch((err) => {
              errHandler(err);
            });
        },

        // 获取已有的dag套餐
        getDags(){
          fetch('/serv/get-dag-workflows-api')
          .then(response => response.json())
          .then(data => {
            // console.log(data);
            this.flows = data;
            // console.log(this.flows)
          })
          .catch(error =>{
            errHandler(err);
          });
        },

        // 选择视频流
        selectItem(item){
          console.log(item);
          this.selected = item.key;
          const ip = item.key.split("-")[0];
          const videoId = item.key.split("-")[1];

          this.selectedIp = ip;
          this.selectedVideoId = videoId;

          this.inputText = `{
        "node_addr": "${ip}",
        "video_id": ${videoId},
        "pipeline": ["face_detection", "face_alignment"],
        "user_constraint": {
          "delay": 0.3,
          "accuracy": 0.9
        }
    }`;

          this.sendUrl = "/dag/query/submit_query";

          // console.log(this.sendUrl)
        },

        // 提交任务
        submitText() {
          this.inputText = {
          node_addr: this.selectedIp,
          video_id: parseInt(this.selectedVideoId),
          // pipeline: this.selectedServices,
          pipeline: this.selectedFlow['dag'],
          user_constraint: {
              delay: parseFloat(this.delay_constraint),
              accuracy: parseFloat(this.acc_constraint),
            },
          };
          // console.log(this.inputText);
          console.log(this.selectedFlow['dag']);

          // let text = this.inputText.replace(/[\r\n\s]/g, ""); // remove all newlines and spaces
          let text = JSON.stringify(this.inputText);

          // console.log(JSON.stringify(text))
          console.log(text);

          fetch(this.sendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: text,
          })
            .then((response) => response.json())
            .then((data) => {
              // console.log(data.query_id);
              // 后端系统重启，需要清空前端存储信息
              if (data.query_id === "GLOBAL_ID_1") {
                sessionStorage.clear();

                this.submit_jobs = [];
                sessionStorage.setItem(
                  "submit_jobs",
                  JSON.stringify(this.submit_jobs)
                );
                this.job_info_dict = {};
                sessionStorage.setItem(
                  "job_info_dict",
                  JSON.stringify(this.job_info_dict)
                );
                // sessionStorage.setItem("delayCons", JSON.stringify(this.delayCons));
                // sessionStorage.setItem("accCons", JSON.stringify(this.accCons));
              }

              // 将 submit_jobs 存储在 sessionStorage 中
              this.submit_jobs.push(data.query_id);
              console.log(this.submit_jobs);
              sessionStorage.setItem(
                "submit_jobs",
                JSON.stringify(this.submit_jobs)
              );

              let job_info = {
                job_id: data.query_id, // 任务序号
                selectedIp:this.selectedIp, // IP
                selectedVideoId: this.selectedVideoId, // 摄像头ID
                type: this.info[this.selectedIp][this.selectedVideoId]["type"],
                mode: this.selectedMode, // 优化模式
                delay_constraint: this.delay_constraint,
                acc_constraint:this.acc_constraint,
              }

              this.job_info_dict[data.query_id] = job_info;
              // console.log(this.job_info_dict);
              sessionStorage.setItem(
                "job_info_dict",
                JSON.stringify(this.job_info_dict)
              )
              // 设置套餐信息
              const serviceInfo = {
                selectedIp:this.selectedIp, // IP
                selectedVideoId: this.selectedVideoId, // 摄像头ID
                selectedFlow:this.selectedFlow, // 已配置套餐
              }

              this.ipVideoFlowInfo.push(serviceInfo);
              sessionStorage.setItem(
                "ipVideoFlowInfo",
                JSON.stringify(this.ipVideoFlowInfo)
              )

              console.log(this.job_info_dict);

              // sessionStorage.setItem("delayCons", JSON.stringify(this.delayCons));
              // sessionStorage.setItem("accCons", JSON.stringify(this.accCons));

              // 设置交互信息
              this.uploadSuccess = true;
              this.isSubmit = true;
              ElMessage({
                message: "上传成功",
                showClose: true,
                type: "success",
                duration: 3000,
              });
            })
            .catch((error) => {
              console.error(error);
              ElMessage.error("上传失败");
            });
          // console.log(this.inputText)
          // console.log(JSON.stringify(text) )
        },
  },
    // created() {
    //   // 根据 selectedServices 的长度初始化 buttonTypes 和 isPlain 数组
    //   this.buttonTypes = new Array(this.servicesList.length).fill("info");
    //   this.isPlain = new Array(this.servicesList.length).fill(true);
    // },
    mounted(){
      // console.log("mounted!");
      // this.flows = {
      //   "face_estimation":["face_detection","face_alignment"],
      //   "car_detecion":['car_detection'],
      // };
      const submitJobs = sessionStorage.getItem("submit_jobs");
      if (submitJobs) {
        this.submit_jobs = JSON.parse(submitJobs);
      }

      const storedJobInfo = sessionStorage.getItem("job_info_dict");

      if (storedJobInfo) {
        // 如果 sessionStorage 中存在保存的任务信息，则将其解析为对象并赋值给 this.job_info_dict
        this.job_info_dict = JSON.parse(storedJobInfo);
      }

      const storedService = sessionStorage.getItem("ipVideoFlowInfo");
      if(storedService){
        this.ipVideoFlowInfo = JSON.parse(storedService);
      }
      
      this.getInfo();
      this.getDags();
      // 静态填充
        this.info = 
            {
                "192.168.56.102:7000": {
                    "0": {
                        "type": "traffic flow"
                    },
                    "1": {
                        "type": "people indoor"
                    },
                    "3":{
                      "type":"会议室开会"
                    },
                },
                "192.168.56.102:8000": {
                    "0": {
                        "type": "traffic flow"
                    },
                    "1": {
                        "type": "people indoor"
                    }
                },
                "192.168.56.102:9000": {
                    "0": {
                        "type": "traffic flow"
                    },
                    "1": {
                        "type": "people indoor"
                    }
                },
            };

      // this.ipVideoFlowInfo = [
      //       {
      //         selectedIp:"192.168.11.1",
      //         selectedVideoId:1,
      //         selectedFlow:{ 'dag': ["face_detection","face_alignment"], 'dag_name': "face_estimation" },
      //       }
      // ];
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
.carousel-item-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%; /* 设置高度以确保内容垂直居中 */
}

.horizontal-scroll-container {

  display: flex;
  overflow-x: auto;
  white-space: nowrap;

  max-width: 80%; /* 设置最大宽度为80% */
  margin: 0 auto; /* 水平居中 */
}

.available-node{
  display: inline-block;
  margin: 20px;
  /* background-color: cadetblue; */
  width: 320px;
  border: 1px solid #5c5858;
  border-radius: 10px;
  height: 120px;
}
.arrow {
    margin: 0 10px; /* 调整箭头与按钮之间的间距 */
    font-size: 24px;
  }
.subli {
  font-size: 18px;
  margin-top: 10px;
  padding: 0px;
}

/* 走马灯指示条 */
/* 修改页码指示器的颜色 */
.el-carousel__indicator {
  background-color: rgb(238, 230, 221);
}

/* 修改激活页码的颜色 */
/* .el-carousel__button.is-active {
  background-color: darksalmon;
} */

/* 修改悬停时的颜色 */
/* .el-carousel__button:hover {
  background-color: paleturquoise;
} */
.ipcontent-button{
  height: 90px;
  width: 230px;
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
.custom-select {
  position: relative;
  display: inline-block;
  width: 150px; /* 自定义宽度 */
  background-color: #f5f5f5; /* 自定义背景颜色 */
  border: 1px solid #ccc; /* 自定义边框样式 */
  border-radius: 4px; /* 自定义圆角 */
  overflow: hidden; /* 隐藏溢出内容 */
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
.custom-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-size: 16px; /* 自定义箭头图标大小 */
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

.new-dag-font-style{
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: bold;
}

.svc-container {
    display: flex;
    flex-wrap: wrap;
    padding: 5px; /* 可根据需要调整 */
    list-style-type: none;
}

.svc-item {
    margin: 2px; /* 可根据需要调整 */
    padding: 2px; /* 可根据需要调整 */
    border-radius: 10px; /* 圆角矩形 */
}

.el-button {
    font-size: 16px;
    margin-right: 10px;
}

.el-button:first-child {
  margin-left: 0;
    
}
</style>