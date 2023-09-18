<template>
    <div class="content">
        <!-- 视频任务配置new  -->
        <el-card shadow="hover" style="margin-left: 20px;margin-right: 20px;">
            <div slot="header" style="font-size: 20px; font-weight: bold; margin-bottom: 20px;">视频任务配置</div>
            <!-- TODO: 分页显示 -->
            <!-- <div>{{ job_info_dict}}</div> -->
            <!-- <div v-for="(values, job_id, index) in job_info_dict" class="available-node"
            v-on:click="selectItem(job_id)"
            v-bind:class="{ 'selected': selected === job_id }"
            >
                <div class="centered-div">
                    <ul style="list-style-type: none;">
                        <li style="font-size: 16px; font-weight: bold;">{{values.selectedIp}}</li>
                        <li>摄像头ID: {{ values.selectedVideoId }}</li>
                        <li>描述: {{ values.type }}</li>
                        <li>优化模式: {{ values.mode }}</li>
                        <li>
                            {{ values.mode === 'latency' ? '时延约束' : '精度约束' }}: {{ values.mode === 'latency' ? values.delay_constraint : values.acc_constraint }}
                        </li>
                    </ul>
                </div>
            </div> -->


            <!-- 显示当前页的内容 -->
            <div style="display: flex; flex-direction: column; align-items: center;">
              <!-- 上面的 div 包含 v-for 循环的内容 -->
              <div>
                <div v-for="(values, job_id, index) in currentPageItems" class="available-node-result"
                  v-on:click="selectItem(job_id)"
                  v-bind:class="{ 'selected': selected === job_id }"
                >
                  <div class="centered-div">
                    <ul style="list-style-type: none;">
                        <li style="font-size: 16px; font-weight: bold;">{{values.selectedIp}}</li>
                        <li class="subli">摄像头ID: {{ values.selectedVideoId }}</li>
                        <li class="subli">描述: {{ values.type }}</li>
                        <li class="subli">优化模式: {{ values.mode == 'latency'? '时延优先':'精度优先' }}</li>
                        <li class="subli">
                            {{ values.mode === 'latency' ? '时延约束' : '精度约束' }}: {{ values.mode === 'latency' ? values.delay_constraint : values.acc_constraint }}
                        </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 下面的 div 包含分页控件 -->
              <div class="pagination">
                <el-button @click="prevPage" :disabled="currentPage === 1">上一页</el-button>
                <el-button @click="nextPage" :disabled="currentPage === pageCount">下一页</el-button>
              </div>
            </div>

        </el-card>


        <!-- 视频任务结果 -->
        <el-row>
            <el-col :span="10">
                <el-card shadow="hover" style="margin: 20px; height: 350px;">
                    <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">原始视频流</div>
                    <!-- 原始视频流 -->
                    <div style="width: 80%; height: calc(100% - 40px);"> <!-- 40px是header的高度 -->
                        <!-- TODO: img大小设置 -->
                        <img :src="videoUrl + selected" style="width: 100%; height: 80%;" />
                    </div>
                </el-card>
            </el-col>

            <el-col :span="14">
                <el-card shadow="hover" style="margin: 20px; height: 350px; margin-left: 0;">
                    <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">执行结果</div>
                    <!-- 结果绘图 -->
                    <div id="result" style="width: 600px;height:250px;"></div>
                    
                </el-card>   
            </el-col>
        </el-row>



    </div>
</template>
<script>
import { ElLoading, ElMessage } from "element-plus";
import * as echarts from "echarts";
export default{
    data(){
        return{
            // url
            resultUrl: "/dag/query/get_agg_info/",
            resourceUrl: "/serv/get_cluster_info",
            videoUrl: "video/user/video/",

            cluster_info:null,
            selectedIp:null,
            // 资源
            resource_display:[],
            // 可查询任务
            submit_jobs:[],
            // 选取的查询任务
            submit_job:null,
            // 查询结果
            result:null,
            appended_result:null,
            runtime:null,
            plan:null,

            // 结果细节
            delay: null,
            obj_n: null,
            obj_size: null,
            obj_stable: null,

            // 选择的查询任务
            selected: null,

            node_type_list: [],
            // 前端获取已经提交的任务
            job_info_dict:{},

            // 绘制结果折线图
            chart:null,

            // 定时器
            timer:null,

            // 分页控件
            itemsPerPage: 3, // 每页显示的数量
            currentPage: 1, // 当前页数

            
        };
    },
    methods: {
        // 绘制饼图
        // drawTest(){
        //   var chart = echarts.init(document.getElementById("chart2"));
        //   const appended_result = this.appended_result;

        //   const data = this.appended_result[this.appended_result.length - 1];
        //   var keyList = Object.keys(data["count_result"]);
        //   var valueList = Object.values(data["count_result"]);

        //   var seriesData = [];
        //   for(var i = 0;i < keyList.length;i ++){
        //     seriesData.push({
        //       value: valueList[i],
        //       name: keyList[i],
        //     });
        //   }
        //   var option = {
        //     series: [
        //       {
        //         type: 'pie',
        //         data: seriesData,
        //       }
        //     ]
        //   };
        //   chart.setOption(option);
        // },
        // 绘制结果折线图
        drawResult(){
          if(!this.chart){
            var chart = echarts.init(document.getElementById('result'));
            this.chart = chart;
          }
          const yKey = Object.keys(this.appended_result[0])[0]; // 获取第一个键名作为纵坐标的键名

          const data = this.appended_result.map((item) => ({
            x: item.n_loop,
            y: item[yKey], // 使用纵坐标的键名来获取对应的值
          }));

          const appended_data = this.appended_result;

          // 获取追加结果中key非n_loop的数据
          var xAsixName = "n_loop";
          var seriesData = {};
          var resKeyList = [];
          // console.log("appended_data length: " + appended_data.length);
          for (var i = 0; i < appended_data.length; i++) {
            var keyList = Object.keys(appended_data[i]["count_result"]);
            for (var j = 0; j < keyList.length; j++) {
              // 以抬头检测为例,将up total这些key都加入到resKeyList中
              if (resKeyList.indexOf(keyList[j]) == -1) {
                resKeyList.push(keyList[j]);
              }
            }
            // resKeyList = resKeyList.concat(keyList);
          }
          // resKeyList = [new Set(resKeyList)]
          console.log("resKeyList: " + resKeyList);
          // var resKeyList = Object.keys(appended_data[0])
          for (var i = 0; i < resKeyList.length; i++) {
            var key = resKeyList[i];
            if (key !== xAsixName) {
              seriesData[key] = [];
            }
          }
          // console.log("init seriesData keys: " + Object.keys(seriesData));
          // 生成各key的数据序列
          for (var i = 0; i < appended_data.length; i++) {
            var frameInfo = appended_data[i]["count_result"];
            for (var j in frameInfo) {
              var key = j;
              var value = frameInfo[j];
              if (key !== xAsixName) {
                seriesData[key].push(value);
              }
            }
          }
          // 生成series列表和与其对应的legend列表
          var seriesList = [];
          var legendList = [];
          // console.log("seriesData entries: " + Object.entries(seriesData));
          for (var ent of Object.entries(seriesData)) {
            // console.log("ent[0]=" + ent[0]);
            // console.log("ent[1]=" + ent[1]);
            legendList.push(ent[0]);
            seriesList.push({
              name: ent[0],
              type: "line",
              // type: "bar",
              // stack: "stack",
              label: {
                show: true,
                position: "top",
                color: "black",
                fontSize: 12,
                formatter: function (d) {
                  return d.data;
                },
              },
              data: ent[1],
            });
          }

          const option = {
            grid: {
              bottom: "10%",
              right: "15%",
              top: "30%",
              left: "15%",
            },
            xAxis: {
              type: "category",
              data: data.map((item) => item.x), // 使用映射后的横坐标数据
              name: "帧数",
            },
            yAxis: {
              type: "value",
              name: "检测到的数量",
            },
            legend: {
              data: legendList,
            },
            series: seriesList,
            // series: [
            //   {
            //     type: "line",
            //     data: data.map((item) => item.y), // 使用映射后的纵坐标数据
            //   },
            // ],
          };
          this.chart.setOption(option,true);

        },
        // 绘制圆环
        drawCircle(canvas,content_filled,percentage,color) {
            // const canvas = this.$refs.circleCanvas;
            const context = canvas.getContext('2d');

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) - 20;
            const lineWidth = 10;
            // const bandwidth = "50 Mbps"; // 网络带宽文本

            context.clearRect(0, 0, canvas.width, canvas.height);

            // 绘制圆环的背景
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, Math.PI * 2);
            context.lineWidth = lineWidth;
            context.strokeStyle = '#ccc'; // 圆环的颜色
            context.stroke();

            // 绘制网络带宽文本
            context.font = '20px Arial';
            context.fillStyle = '#333'; // 文本颜色
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(content_filled, centerX, centerY);

            // 绘制圆环的前景
            // const percentage = 1; // 设置圆环的百分比
            const endAngle = (Math.PI * 2 * percentage) - (Math.PI / 2);
            context.beginPath();
            context.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
            context.lineWidth = lineWidth;
            context.strokeStyle = color; // 前景颜色
            context.stroke();
        },
        prevPage() {
          if (this.currentPage > 1) {
            this.currentPage--;
          }
        },
        nextPage() {
          if (this.currentPage < this.pageCount) {
            this.currentPage++;
          }
        },
        
        // 点击选择查询任务
        selectItem(job_id){
        //   console.log(job_id);
          this.selected = job_id;
          this.submit_job = job_id;
          this.updateResultUrl();
        },

        // 查询结果
        updateResultUrl() {
          console.log(this.submit_job);
          const url = this.resultUrl + this.submit_job;
          // console.log(url);
          const loading = ElLoading.service({
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              loading.close();
              // console.log(data);
              this.result = data;
              this.appended_result = this.result["appended_result"];
              this.runtime = this.result["latest_result"]["runtime"];
              this.plan = this.result["latest_result"]["plan"];         
              console.log(this.runtime);
              // 应用情境
              if (this.runtime && this.runtime["delay"]) {
                this.delay = this.runtime["delay"].toFixed(2);
              }

              if (this.runtime && this.runtime["obj_n"]) {
                this.obj_n = Math.floor(this.runtime["obj_n"]);
              } 

              if (this.runtime && this.runtime["obj_size"]) {
                this.obj_size = this.runtime["obj_size"].toFixed(2);
              }

              if (this.runtime && this.runtime["obj_stable"]) {
                this.obj_stable = this.runtime["obj_stable"];
              }

              this.drawResult();
                
            })
            .catch((error) => {
              console.log(error);
              loading.close();
              ElMessage({
                showClose: true,
                message: "结果尚未生成,请稍后",
                type: "error",
                duration: 1500,
              });
              this.result = null;
            });
        },

        // 更新系统资源状态
        updateResourceUrl() {
          const url = this.resourceUrl;
          fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
              // console.log(data);
              this.cluster_info = data;
            })
            .catch((err) => {
              console.log(err);
            });
        },
        
    },
    computed: {
        pageCount() {
          return Math.ceil(Object.keys(this.job_info_dict).length / this.itemsPerPage);
        },
        currentPageItems() {
          const start = (this.currentPage - 1) * this.itemsPerPage;
          const end = start + this.itemsPerPage;
          return Object.keys(this.job_info_dict).slice(start, end).reduce((obj, key) => {
            obj[key] = this.job_info_dict[key];
            return obj;
          }, {});
        },
        modifiedRuntime() {
            if (!this.runtime) {
                return null;
            }
            return Object.fromEntries(
                Object.entries(this.runtime).map(([key, value]) => {
                if (key === "delay") {
                    return ["时延", value.toFixed(2)];
                } else if (key === "obj_n") {
                    return ["目标数量", value];
                } else if (key === "obj_size") {
                    return ["目标大小", value.toFixed(2)];
                } else if (key === "obj_stable") {
                    return ["场景稳定性", value];
                } else {
                    return [key, value];
                }
                })
            );
        },
        // 改写中文
        modifiedInfo() {
            if (!this.job_info_dict) {
                return null;
            }
            let modified_info = Object.fromEntries(
                Object.entries(this.job_info_dict).map(([key, value]) => {
                let mode = value.mode === "latency" ? "时延优先" : "精度优先";
                return [
                    key,
                    {
                    job_id: value.job_id,
                    selectedIp:value.selectedIp,
                    摄像头ID: value.selectedVideoId,
                    描述: value.type,
                    优化模式: mode,
                    时延约束: value.delay_constraint,
                    精度约束: value.acc_constraint
                    }
                ];
                })
            );
            return modified_info;
        },
        modifiedPlan() {
            if (!this.plan) {
                return null;
            }
            return Object.fromEntries(
                Object.entries(this.plan).map(([key, value]) => {
                if (key === "flow_mapping") {
                    return ["云边协同配置", value];
                } else if (key === "video_conf") {
                    return ["视频配置", value];
                } else {
                    return [key, value];
                }
                })
            );
        },
    },
    mounted(){
        
        // 获取可查询的任务相关信息 存储在submit_jobs和job_info_dict中
        const submitJobs = sessionStorage.getItem("submit_jobs");
        if (submitJobs) {
            this.submit_jobs = JSON.parse(submitJobs);
            // console.log(this.submit_jobs);
        }
        const job_info = sessionStorage.getItem("job_info_dict");
        if(job_info){
            this.job_info_dict = JSON.parse(job_info);
            // console.log(this.job_info_dict);
        }
        this.resource_display = ["cpu_ratio","mem_ratio","gpu_ratio","net_ratio(MBps)"];
        
        // this.drawTest();
        // this.initChart();
        // this.timer = setInterval(() => {
        //   this.updateResultUrl();
        //   this.updateResourceUrl();
        // }, 8000);
    },
}
</script>
<style>
.content {
    margin-top: 20px;
}
.card-container {
  display: flex;
  margin: 20px;
}
.image-container{
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.card {
  height: 600px;
  margin-right: 10px; /* 添加适当的间距 */
}
.info-header {
  text-align: center;
  color: #2f74ff;
  font-weight: 1000;
  line-height: 40px;
  border: 2px solid rgb(77, 77, 77);
  margin: 5px;
  border-radius: 5px;
}
.info-box {
  /* height: 80px; */
  /* border: 2px dashed grey; */
  margin: 20px;
  display: flex;
  /* border-radius: 10px; */
}

.info-h1 {
  width: min-content;
  white-space: nowrap;
  text-align: center;
  color: #2f74ff;
  font-weight: 750;
  line-height: 20px;
  border: 2px dashed rgb(77, 77, 77);
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
}
.info-h1-flex-text {
  display: flex;
  align-items: center;
}
.info-h2 {
  width: min-content;
  height: min-content;
  white-space: nowrap;
  text-align: center;
  color: #2f74ff;
  background-color: rgb(220, 220, 220);
  /* line-height: 20px; */
  /* border: 2px dashed rgb(77, 77, 77); */
  /* margin: 5px; */
  /* padding: 5px; */
  font-weight: 500;
  border-left: 5px solid rgb(77, 77, 77);
  border-radius: 5px;
  margin: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 40px;
  margin-right: 5px;
}
.info-h2-flex-text {
  display: flex;
  align-items: center;
  margin: 5px;
}
.info-h2-flex-text-items {
  margin-right: 10px;
  border-bottom: 2px dashed #2f74ff;
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

.available-node-result{
  display: inline-block;
  margin: 20px;
  /* background-color: cadetblue; */
  width: 320px;
  border: 1px solid #5c5858;
  border-radius: 10px;
  height: 180px;
}
.centered-div {
  margin-top: 10px;
  display: flex;
  justify-content: center; /* 在水平方向上居中对齐 */
  
}
.selected{
  background-color: rgb(96, 158, 254);
  color:white;
}
.canvas-container {
    display: flex;
    justify-content: space-between;
}

.inner-div {
    display: flex;
    flex-direction: column;
    align-items: center;
}

canvas {
    margin-top: 10px; /* 为了将span内容留出一些空间 */
}
.custom-select {
  position: relative;
  display: inline-block;
  width: 200px; /* 自定义宽度 */
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
.subli {
  font-size: 18px;
  margin-top: 10px;
  padding: 0px;
}
</style>

<style lang="scss" scoped>
:deep(.user-radio) {
  // ::v-deep .user-radio {
  .el-radio-button__inner {
    color: #ffffff;
    border: 1px solid #ffffff;
    // border-radius: 4px;
    background: #dcdcdc;
  }

  .el-radio-button__original-radio:disabled:checked + .el-radio-button__inner {
    background-color: #2f74ff;
  }
}
</style>