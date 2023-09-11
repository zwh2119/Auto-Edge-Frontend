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
                v-for="(v, video_id) in value" >
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
                        <ul style="list-style-type: none; text-align: center;"
                        >
                          <li class="subli">Addr: {{ node_addr }}</li>
                          <li class="subli">VideoID: {{ video_id }}</li>
                          <li class="subli">Description: {{ v.type }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          
        </el-card>

        <!-- 选择视频流处理步骤 -->
        <el-card shadow="hover" style="margin: 20px; height: 250px;">
          <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">选择视频流处理步骤</div>
          <div>
            <div v-for="(serv, id) in servicesList" :key="id" style="display: inline-block; margin-right: 20px;">
              <el-button :type="buttonTypes[id]" :plain="isPlain[id]" @click="changeButtonType(id,serv)">{{ serv }}</el-button>
            </div>
          </div>
          <!-- 已选择流水线 -->
          <div slot="header" style="font-size: 18px;margin-top: 30px; margin-bottom: 20px;">已选择流水线</div>
          <div>
            <div v-for="(serv,id) in selectedServices" style="display: inline-block;">
              <el-button type="primary" text bg>{{ serv }}</el-button>
              <!-- 显示箭头 -->
              <span v-if="id < selectedServices.length - 1" class="arrow">➡</span>
          </div>

          </div>

        </el-card>
        

        <!-- 设置任务约束 -->
        <el-card shadow="hover" style="margin: 20px;">
          <div slot="header" style="font-size: 20px;font-weight: bold;">设置任务约束</div>
          <div style="display: flex; align-items: center; margin-top: 20px;">
            <!-- 优化模式 -->
            <div style="flex: 1;">
                <span class="param" style="margin-right: 20px;">优化模式</span>
                <el-select v-model="selectedMode" placeholder="Select">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
            </div>

            <!-- 优化参数 -->
            <div style="flex: 1;">
              <div>
                <span class="param" style="margin-right: 20px;">时延约束</span>
                <el-input v-model="delay_constraint" placeholder="输入时延约束" style="width: 100%; max-width: 200px;" />
              </div>
              <div style="margin-top: 10px;">
                
                <span class="param" style="margin-right: 20px;">精度约束</span>
                <el-input v-model="acc_constraint" placeholder="输入精度约束" style="width: 100%; max-width: 200px;" />
              </div>
            </div>

            <div style="flex: 1;">
              <el-button type="primary" plain @click="submitText">提交任务</el-button>
            </div>
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

        // 选择视频流
        selectItem(item){
          // console.log(item);
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
      // 根据变量构造请求
      // this.inputText = `{
      //   "node_addr": "${this.selectedIp}",
      //   "video_id": ${this.selectedVideoId},
      //   "pipeline": ${this.pipeline},
      //   "user_constraint": {
      //     "delay": ${this.delayCons},
      //     "accuracy": ${this.accCons}
      //   }
      // }`;
      // console.log(this.selectedMode);
      // console.log(this.delay_constraint);
      // console.log(this.acc_constraint);
      this.inputText = {
      node_addr: this.selectedIp,
      video_id: parseInt(this.selectedVideoId),
      pipeline: this.selectedServices,
      user_constraint: {
          delay: parseFloat(this.delay_constraint),
          accuracy: parseFloat(this.acc_constraint),
        },
      };
      // console.log(this.inputText)

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
            sessionStorage.setItem("delayCons", JSON.stringify(this.delayCons));
            sessionStorage.setItem("accCons", JSON.stringify(this.accCons));
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
            acc_constraint:this.delay_constraint
          }

          this.job_info_dict[data.query_id] = job_info;
          console.log(this.job_info_dict);
          sessionStorage.setItem(
            "job_info_dict",
            JSON.stringify(this.job_info_dict)
          )

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
      const submitJobs = sessionStorage.getItem("submit_jobs");
      if (submitJobs) {
        this.submit_jobs = JSON.parse(submitJobs);
      }
      this.getInfo();
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
            }
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
  background-color: rgb(208, 193, 179);
}

/* 修改激活页码的颜色 */
.el-carousel__button.is-active {
  background-color: darksalmon;
}

/* 修改悬停时的颜色 */
.el-carousel__button:hover {
  background-color: paleturquoise;
}
.ipcontent-button{
  height: 90px;
  width: 230px;
}
.centered-item{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.selected{
  background-color: rgb(96, 158, 254);
  color:white;
}
</style>