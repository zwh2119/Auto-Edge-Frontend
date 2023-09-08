<template>
    <div class="content">
        <!-- 视频任务配置 -->
        <el-card shadow="hover" style="margin-left: 20px; height: 150px;">
          <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">视频任务配置</div>
          <div style="display: flex; align-items: center; margin-top: 20px;">
            <!-- 选择查询任务 -->
            <div style="flex: 1;">
                <span class="param" style="margin-right: 20px;">选择查询任务</span>
                <!-- todo:找到当前可查询的任务 -->
                <el-select v-model="submit_job" placeholder="选择要查询的任务" @change="updateResultUrl">
                    <el-option
                        v-for="(query_id, idx) in submit_jobs"
                        :key="query_id"
                        :label="query_id"
                        :value="query_id"
                    >
                    </el-option>
                </el-select>
            </div>

            <!-- 优化模式 -->
            <div style="flex: 1;">
                <span class="param" style="margin-right: 20px;">优化模式</span>
                
            </div>

            <div style="flex: 1;">
                <span class="param" style="margin-right: 20px;">优化模式参数</span>
            </div>

        </div>
          
        </el-card>

        <!-- 视频任务结果 -->
        <el-row>
            <el-col :span="8">
                <el-card shadow="hover" style="margin: 20px; height: 350px;">
                    <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">原始视频流</div>
                    <!-- 原始视频流 -->
                    <div style="width: 80%; height: calc(100% - 40px);"> <!-- 40px是header的高度 -->
                        <img :src="videoUrl + submit_job" style="width: 100%; height: 80%;" />
                    </div>
                </el-card>
            </el-col>

            <el-col :span="16">
                <el-card shadow="hover" style="margin: 20px; height: 350px;">
                    <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">执行结果</div>
                    <!-- 结果绘图 -->
                    <!-- todo:结果绘图 -->
                    
                </el-card>   
            </el-col>
        </el-row>

        <!-- <el-card shadow="hover" style="margin: 20px; height: 350px;">
          <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">视频任务结果</div>
          <div>
            <div>
                <div style="font-size: 18px; margin-bottom: 10px;">原始视频流:</div>
                <img :src="videoUrl + submit_job" width="280" height="200" />
            </div>

          </div>
          
        </el-card> -->

        <!-- 运行时情境 -->
        <div class="card-container">
            <!-- 应用情境 -->
            <el-card shadow="hover" class="card" style="flex: 1;">
                <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">应用情境</div>
                <div>111</div>
            </el-card>
            
            <!-- 资源情境 -->
            <el-card shadow="hover" class="card" style="flex: 1;">
                <div slot="header"  style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">资源情境</div>
                <!-- <div>{{ cluster_info }}</div> -->
                <el-select v-model="selectedIp" placeholder="请选择IP地址" @change="showSelectedInfo">
                    <el-option
                        v-for="(info, ip) in cluster_info"
                        :key="ip"
                        :label="ip"
                        :value="ip"
                    >
                    </el-option>
                </el-select>
                    
                    <div v-if="selectedIp">
                        <div v-for="(v,k) in resource_display">
                            <!-- cpu利用率 -->
                            <div v-if="v === 'cpu_ratio'">
                                <span>核数:{{ cluster_info[selectedIp][v].length }}</span><br/>
                                <span>利用率:{{ calculateAvgCpuRation(cluster_info[selectedIp][v]) }}</span><br/>
                            </div>

                            <!-- 内存利用率 -->
                            <div v-if="v === 'mem_ratio'">
                                <span>内存利用率{{ cluster_info[selectedIp][v] }}</span><br/>
                            </div>

                            <!-- GPU利用率 -->

                            <!-- 网络带宽 -->
                            <div v-if="v === 'net_ratio(MBps)'">
                                <span>网络带宽{{ cluster_info[selectedIp][v] }}MB/s</span><br/>
                            </div>
                        </div>

                    </div>
            </el-card>
        </div>

        <!-- 任务调度配置 -->
        <el-card shadow="hover" style="margin: 20px; height: 350px;">
          <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">任务调度配置</div>
          <div>
        <div class="info-box" >
          <!-- {{ plan }} -->
          <div v-for="(h1_value, h1_key) in modifiedPlan" style="flex: 1;">
            <div class="info-h1">{{ h1_key }}</div>
            <div>
              <div class="info-h1-flex-text" v-for="(h2_v, h2_k) in h1_value">
                <div class="info-h2">{{ h2_k }}</div>

                <!-- 以按钮方式显示特定配置 -->
                <!-- 云边协同配置 -->
                <!-- 1、flow_mapping: 本机、边缘、云端 -->
                <div v-if="h1_key === '云边协同配置'" class="info-h2-flex-text">
                  <el-radio-group
                    direction="row"
                    v-model="h1_value[h2_k]['node_role']"
                    :disabled="true"
                  >
                    <el-radio-button
                      class="user-radio"
                      v-for="item in node_type_list"
                      :label="item.key"
                      >{{ item.ui_value }}</el-radio-button
                    >
                  </el-radio-group>
                </div>
                <!-- 视频配置 -->
                <!-- 2、video_conf: 编解码 -->
                <div v-else-if="h2_k === 'encoder'" class="info-h2-flex-text">
                  <el-radio-group
                    direction="row"
                    v-model="h1_value[h2_k]"
                    :disabled="true"
                  >
                    <el-radio-button
                      class="user-radio"
                      v-for="item in encoder_type_list"
                      :label="item.key"
                      >{{ item.ui_value }}</el-radio-button
                    >
                  </el-radio-group>
                </div>
                <!-- 3、video_conf: 帧率 -->
                <div v-else-if="h2_k === 'fps'" class="info-h2-flex-text">
                  <el-radio-group
                    direction="row"
                    v-model="h1_value[h2_k]"
                    :disabled="true"
                  >
                    <el-radio-button
                      class="user-radio"
                      v-for="item in fps_type_list"
                      :label="item.key"
                      >{{ item.ui_value }}</el-radio-button
                    >
                  </el-radio-group>
                </div>
                <!-- 4、video_conf: 分辨率 -->
                <div
                  v-else-if="h2_k === 'resolution'"
                  class="info-h2-flex-text"
                >
                  <el-radio-group
                    direction="row"
                    v-model="h1_value[h2_k]"
                    :disabled="true"
                  >
                    <el-radio-button
                      class="user-radio"
                      v-for="item in resolution_type_list"
                      :label="item.key"
                      >{{ item.ui_value }}</el-radio-button
                    >
                  </el-radio-group>
                </div>

                <!-- 以文本方式显示其他h2内容 -->
                <div v-else class="info-h2-flex-text">{{ h2_v }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
          
        </el-card>

    </div>
</template>
<script>
import { ElLoading, ElMessage } from "element-plus";
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
            showChart:null,

            node_type_list: [],
        };
    },
    methods: {
        calculateAvgCpuRation(array){
            if (Array.isArray(array) && array.length > 0) {
                const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                return (sum / array.length).toFixed(2);
            } else {
                return 0; // 如果数组为空或不是数组，返回默认值
            }
        },
        // 选择后更新任务查询的url
        updateResultUrl() {
            console.log(this.submit_job);
            const url = this.resultUrl + this.submit_job;
            console.log(url);
            // console.log(url)
            const loading = ElLoading.service({
                lock: true,
                text: "Loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                loading.close();
                console.log(data);
                this.result = data;
                this.appended_result = this.result["appended_result"];
                this.runtime = this.result["latest_result"]["runtime"];
                this.plan = this.result["latest_result"]["plan"];
                this.showChart = true;
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
    },
    computed: {
        modifiedRuntime() {
        if (!this.runtime) {
            return null;
        }
        return Object.fromEntries(
            Object.entries(this.runtime).map(([key, value]) => {
            if (key === "delay") {
                return ["时延", value];
            } else if (key === "obj_n") {
                return ["目标数量", value];
            } else if (key === "obj_size") {
                return ["目标大小", value];
            } else if (key === "obj_stable") {
                return ["场景稳定性", value];
            } else {
                return [key, value];
            }
            })
        );
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
        //   sumValues() {
        //     // console.log(this.plan_result);
        //     // console.log(this.plan_result["delay"]);
        //     if (!this.plan_result) {
        //       return 0;
        //     }
        //     const delayObj = this.plan_result["delay"];
        //     if (delayObj) {
        //       const values = Object.values(delayObj);
        //       const sum = values.reduce((a, b) => a + b, 0);
        //       return sum;
        //     }
        //     return 0;
        //   },
  },
    mounted(){
        // 获取可查询的任务
        const submitJobs = sessionStorage.getItem("submit_jobs");
        if (submitJobs) {
            this.submit_jobs = JSON.parse(submitJobs);
            console.log(this.submit_jobs)
        }
        this.resource_display = ["cpu_ratio","mem_ratio","gpu_ratio","net_ratio(MBps)"],
        // TO_REMOVE: 静态填充
        this.cluster_info = {
            "114.212.81.11:5500": {  //以ip:port为key，标记一个节点
        "cpu_ratio": [0.2, 0.0, 0.2, 0.1, 0.3, 0.2, 0.0, 0.7, 0.9],  //节点各个cpu的占用百分比列表
        "mem_ratio": 5.4,  //节点的内存占用百分比
        "net_ratio(MBps)": 0.31806,  //节点的带宽
        "swap_ratio": 0.0, //节点交换内存使用情况
        "gpu_mem":  {  //节点各个GPU的显存占用百分比字典
            "0": 0.012761433919270834, // 第0张显卡
            "1": 0.012761433919270834, // 第1张显卡
            "2": 0.012761433919270834, 
            "3": 0.012761433919270834
        },
        "gpu_utilization": {  //节点各个GPU的计算能力利用率百分比字典
            "0": 7, // 第0张显卡；nano或tx2没有显卡，因此只有"0"这一个键；服务器有多张显卡
            "1": 8, // 第1张显卡
            "2": 9, 
            "3": 10
        },
        "car_detection": {  //以服务名为key，表示节点上某类服务的情况
            "1194975": {  //以进程pid为key，表示节点上某类服务某个工作进程的情况
                "cpu_ratio": 0.0,  //某个进程的cpu使用率
                "mem_ratio": 0.20176213870657234,  //某个进程的内存占用率
                "task_to_do": 0  //某个进程待做的任务数量
            }
        },
        "face_alignment": {
            "1196516": {
                "cpu_ratio": 0.0,
                "mem_ratio": 0.14147854986806502,
                "task_to_do": 0
            }
        },
        "face_detection": {
            "1196515": {
                "cpu_ratio": 0.0,
                "mem_ratio": 0.11392224417874179,
                "task_to_do": 0
            }
        }
    },
    "172.27.142.109:5501": {
        "car_detection": {
            "784": {
                "cpu_ratio": 0.0,
                "mem_ratio": 1.7194944849511828,
                "task_to_do": 0
            }
        },
        "cpu_ratio": [2.7, 0.7, 2.0, 1.3, 1.8, 0.7, 1.4],
        "face_alignment": {
            "1896": {
                "cpu_ratio": 0.0,
                "mem_ratio": 0.9882168921417035,
                "task_to_do": 0
            }
        },
        "face_detection": {
            "10832": {
                "cpu_ratio": 0.0,
                "mem_ratio": 0.8926369264778068,
                "task_to_do": 0
            }
        },
        "mem_ratio": 72.9,
        "net_ratio(MBps)": 0.10514,
        "swap_ratio": 89.9,
        "gpu_ratio":  {  
            "0": 0.012761433919270834, 
            "1": 0.012761433919270834, 
            "2": 0.012761433919270834, 
            "3": 0.012761433919270834
        }
    }
        };
        this.node_type_list = [
                { key: "host", ui_value: "视频边端" },
                { key: "edge", ui_value: "其他边端" },
                { key: "cloud", ui_value: "云端" },
                ];
        this.encoder_type_list = [
            { key: "H264", ui_value: "H264" },
            { key: "JPEG", ui_value: "JPEG" },
            { key: "x", ui_value: "..." },
            ];
        this.fps_type_list = [
            { key: 1, ui_value: "1" },
            { key: 5, ui_value: "5" },
            { key: 10, ui_value: "10" },
            { key: 20, ui_value: "20" },
            { key: 30, ui_value: "30" },
            ];
        this.resolution_type_list = [
            { key: "360p", ui_value: "480x360" },
            { key: "480p", ui_value: "640x480" },
            { key: "720p", ui_value: "1280x720" },
            { key: "1080p", ui_value: "1920x1080" },
        ];
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