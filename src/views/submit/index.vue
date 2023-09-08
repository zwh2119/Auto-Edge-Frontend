<template>
    <div>
      <el-steps :active="activeStep" align-center>
        <el-step title="选择视频流"></el-step>
        <el-step title="选择视频流处理步骤"></el-step>
        <el-step title="已选择处理流水线"></el-step>
        <el-step title="设置任务约束"></el-step>
      </el-steps>
  
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
                    <div v-for="(v, video_id) in value" class="available-node">
                      <div class="centered-item">
                        <ul style="list-style-type: none; text-align: center;">
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
        <el-card shadow="hover" style="margin: 20px; height: 150px;">
          <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">选择视频流处理步骤</div>
          <div>
            <div v-for="(serv, id) in servicesList" :key="id" style="display: inline-block; margin-right: 20px;">
              <el-button :type="buttonTypes[id]" :plain="isPlain[id]" @click="changeButtonType(id,serv)">{{ serv }}</el-button>
            </div>
          </div>
          <!-- <el-input v-model="input2" placeholder="请输入内容"></el-input>
          <el-button @click="nextStep(1)">下一步</el-button> -->

        </el-card>
        
        <!-- 已选择处理流水线 -->
        <el-card shadow="hover" style="margin: 20px; height: 150px;">
          <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">已选择处理流水线</div>

          <!-- <el-input v-model="input3" placeholder="请输入内容"></el-input>
          <el-button @click="nextStep(2)">下一步</el-button> -->

          <div v-for="(serv,id) in selectedServices" style="display: inline-block;">
              <el-button type="primary" text bg>{{ serv }}</el-button>
              <!-- 显示箭头 -->
              <span v-if="id < selectedServices.length - 1" class="arrow">➡</span>
          </div>
        </el-card>

        <!-- 设置任务约束 -->
        <el-card shadow="hover" style="margin: 20px;">
          <div slot="header" style="font-size: 20px;font-weight: bold;">设置任务约束</div>
          <div style="display: flex; align-items: center; margin-top: 20px;">
            <!-- 优化模式 -->
            <div style="flex: 1;">
                <span class="param" style="margin-right: 20px;">优化模式</span>
                <el-select v-model="mode" placeholder="Select">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :mode="item.value"
                />
                </el-select>
            </div>

            <!-- 优化参数 -->
            <div style="flex: 1;">
                <span class="param" style="margin-right: 20px;">优化参数</span>
                <el-input v-model="constraint" placeholder="输入约束" style="width: 100%; max-width: 200px;" />
            </div>
            </div>

        </el-card>
      </div>
    </div>
  </template>
  
<script> 

export default {
data() {
    return {
        activeStep: 0, // 当前激活的步骤索引
        mode:"", // 时延优先vs精度优先
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
        constraint:"",


        // 静态填充
        info: "",
        // 已装载服务
        servicesList: ["face_detection", "face_alignment","car_detection"],
        // 已选择的流水线
        selectedServices:[],

        // 点击已装载的服务按钮后改变按钮样式 info->primary plain->no plain
        buttonTypes: [],
        isPlain: [] // 初始化按钮是否 plain 的数组
        
        };
    },
    methods: {
        nextStep(step) {
          this.activeStep = step + 1;
        },
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
    },
    created() {
      // 根据 selectedServices 的长度初始化 buttonTypes 和 isPlain 数组
      this.buttonTypes = new Array(this.servicesList.length).fill("info");
      this.isPlain = new Array(this.servicesList.length).fill(true);
    },
    mounted(){
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
                    "4": {
                        "type": "traffic flow"
                    }
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
</style>