<template>
    <div class="content">
        <!-- 视频任务配置new  -->
        <!-- <el-card shadow="hover" style="margin-left: 20px;margin-right: 20px;">
            <div slot="header" style="font-size: 20px; font-weight: bold; margin-bottom: 20px;">视频任务配置</div>

            <div style="display: flex; flex-direction: column; align-items: center;">
              
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

              <div class="pagination">
                <el-button @click="prevPage" :disabled="currentPage === 1">上一页</el-button>
                <el-button @click="nextPage" :disabled="currentPage === pageCount">下一页</el-button>
              </div>
            </div>

        </el-card> -->


        <!-- 运行时情境 -->
        <div class="card-container">
            <!-- 应用情境 -->
            <el-card shadow="hover" class="card" style="flex: 1;height:500px;">
                <div slot="header"  style="font-size: 20px;font-weight: bold; margin-bottom: 20px;display: flex; align-items: center;">
                  <span style="margin-right: 50px;">应用情境</span>
                  <div class="custom-select">
                        <select v-model="selectedJob" @change="selectItem(selectedJob['job_id'])">
                         
                        <option value="" disabled selected>请选择查询数据流</option>
                        <option
                            v-for="(values, job_id, index) in job_info_dict"
                            :key="job_id"
                            :value="{'job_id':values['job_id'],'selectedIp':values['selectedIp'],'selectedVideoId':values['selectedVideoId'],
                                      'type':values['type'],'mode':values['mode'],'delay_constraint':values['delay_constraint'],'acc_constraint':values['acc_constraint']
                          }"
                        
                        >{{ values['selectedIp'] + " - " + values['selectedVideoId'] }}</option>
                        </select>
                        <span class="custom-arrow">&#9662;</span>
                        
                  </div>
                  
                  
                </div>
                <div style="display:flex;font-size:13px;font-weight:500;margin-left:20px;width:100%;color:gray;">
                      <div style="flex:1;margin-left:10px;">描述: {{ selectedJob.type }}</div>
                      <div style="flex:1;margin-left:10px;">优化模式: <div v-show="selectedJob" style="display:inline-block">{{ selectedJob.mode == 'latency'? '时延优先':'精度优先' }}</div></div>
                      <div style="flex:1;margin-left:10px;">
                        {{ selectedJob.mode === 'latency' ? '时延约束' : '精度约束' }}: {{ selectedJob.mode === 'latency' ? selectedJob.delay_constraint+'s' : selectedJob.acc_constraint }}
                      </div>
                      
                </div>
                
                    <a style="text-decoration:none;color:black;" :href="selected ? '/#/detail' : null">
                      
                      <div class="canvas-container" style="margin-top:20px">
                          <div class="inner-div">
                              <span>时延(s)</span>
                              <canvas ref="delayCanvas" width="150" height="150"></canvas>
                          </div>
                          <div class="inner-div">
                              <span>目标数量(个)</span>
                              <canvas ref="objNumCanvas" width="150" height="150"></canvas>
                          </div>
                      </div>

                      <div class="canvas-container">
                        <!-- {{ obj_size }} -->
                          <div v-show="obj_size" class="inner-div">
                              <span>目标大小</span>
                              <canvas ref="objSizeCanvas" width="150" height="150"></canvas>
                          </div>
                          <div class="inner-div">
                              <span>场景稳定性</span>
                              <canvas ref="objStableCanvas" width="150" height="150"></canvas>
                          </div>
                      </div>
                    </a>

                <div>
                </div>
            </el-card>
            
            <!-- 资源情境 -->
            <el-card shadow="hover" class="card" style="flex: 1;height:500px;">
                <div slot="header"  style="font-size: 20px;font-weight: bold; margin-bottom: 20px;display: flex; align-items: center;">
                    <span style="margin-right: 50px;">资源情境</span>
                    <!-- <el-select v-model="selectedIp" placeholder="请选择IP地址" @change="showSelectedInfo">
                        <el-option
                            v-for="(info, ip) in cluster_info"
                            :key="ip"
                            :label="ip"
                            :value="ip"
                        ></el-option>
                    </el-select> -->
                    <div class="custom-select">
                        <select v-model="selectedIp" @change="showSelectedInfo">
                        <option value="" disabled selected>请选择IP地址</option>
                        <option
                            v-for="(info, ip) in cluster_info"
                            :key="ip"
                            :value="ip"
                        >{{ ip }}</option>
                        </select>
                        <span class="custom-arrow">&#9662;</span>
                    </div>
                </div>
                
                    <div>
                      <!-- {{ cluster_info }} -->
                        <!-- 第一行 CPU利用率+内存利用率 -->
                        <div class="canvas-container" style="margin-top:52px">
                            <div class="inner-div">
                                <span>CPU利用率</span>
                                <canvas ref="cpuCanvas" width="150" height="150"></canvas>
                            </div>
                            <div class="inner-div">
                                <span>内存利用率</span>
                                <canvas ref="memCanvas" width="150" height="150"></canvas>
                            </div>
                        </div>
                        
                        <!-- 第二行 GPU利用率+网络带宽 -->
                        <div class="canvas-container">
                            <div class="inner-div">
                                <span>GPU利用率</span>
                                <!-- <div>{{ cluster_info[selectedIp]['gpu_utilization'] }}</div> -->
                                <canvas ref="gpuCanvas" width="150" height="150"></canvas>
                            </div>
                            <div class="inner-div">
                                <span>网络带宽(KB/s)</span>
                                <!-- <div>{{ cluster_info[selectedIp]['net_ratio(MBps)'] }}</div> -->
                                <canvas ref="netCanvas" width="150" height="150"></canvas>
                            </div>
                        </div>
                    </div>
                    
            </el-card>
        </div>

        <!-- 任务调度配置 -->
        <el-card shadow="hover" style="margin: 20px; height: 300px;">
          <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">任务调度配置</div>
          <div>
        <div class="info-box" >
          <!-- {{ plan }} -->
          <div v-for="(h1_value, h1_key) in modifiedPlan" style="flex: 1;">
            <div class="info-h1">{{ h1_key }}</div>
            <div>
              <div class="info-h1-flex-text" v-for="(h2_v, h2_k) in h1_value">
                <div 
                v-bind:class="{'info-h2-1': h1_key === '云边协同配置', 'info-h2-2': h1_key !== '云边协同配置'}">{{ mapTOChinese(h2_k) }}</div>

                <!-- 以按钮方式显示特定配置 -->
                <!-- 云边协同配置 -->
                <!-- 1、flow_mapping: 本机、边缘、云端 -->
                <!-- <div v-if="h1_key === '云边协同配置'" class="info-h2-flex-text">
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
                </div> -->
                <div v-if="h1_key === '云边协同配置'" class="info-h2-flex-text">
                  <!-- <el-radio-group
                    direction="row"
                    v-model="h1_value[h2_k]['node_role']"
                    :disabled="true"
                    > -->
                  <!-- {{ h1_value[h2_k]['node_ip'] === selectedJob['selectedIp'] ? 'host' : 'cloud' }} -->
                  <!-- {{ getSelectedNode(h1_value,h2_k) }} -->
                  <!-- <el-radio-group
                    direction="row"
                    :v-model="getSelectedNode(h1_value,h2_k)"
                    :disabled="true"
                  > -->
                  <!-- <el-radio-group
                    direction="row"
                    :disabled="true"
                  >
                    <el-radio-button
                      class="user-radio"
                      v-for="item in node_type_list"
                      :label="item.key"
                      :key="item.key"
                      :checked="item.key === getSelectedNode(h1_value,h2_k)"
                      >{{ item.ui_value }}</el-radio-button>
                  </el-radio-group> -->
                  <div v-for="item in node_type_list" 
                  v-bind:class="{'button-not-selected': item.key != getSelectedNode(h1_value,h2_k), 'button-selected': item.key === getSelectedNode(h1_value,h2_k)}"
                  >
                    <span class="centered-text">{{ item.ui_value }}</span>
                  </div>

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
import * as echarts from "echarts";
export default{
    data(){
        return{
            // url
            resultUrl: "/dag/query/get_agg_info/",
            resourceUrl: "/serv/get_cluster_info",
            videoUrl: "video/user/video/",

            cluster_info:null,
            selectedIp:"",
            // 资源
            resource_display:[],
            // 可查询任务
            submit_jobs:[],
            // 选取的查询任务
            submit_job:null,
            selectedJob:"",
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

            proNode:"",

            
        };
    },
    methods: {
      mapTOChinese(item){
        if(item === 'encoder'){
          return "编 码";
        }else if(item === 'fps'){
          return "帧 率";
        }else if(item === 'resolution'){
          return "分辨率";
        }else{
          return item;
        }
      },
        getSelectedNode(h1_value,h2_k){
            const proIP = h1_value[h2_k]['node_ip'];
            // console.log("处理IP:" + proIP);
            const submitIP = this.selectedJob['selectedIp'].split(':')[0];
            // console.log("提交IP:" + submitIP);
            if(proIP === submitIP){
              // console.log("host");
              return "host";
            }else if(proIP === "114.212.81.11"){
              // console.log("cloud");
              return "cloud";
            }
            // console.log("edge");
            return "edge";
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
        // 获得最大值
        getMaxKey(dict){
          var maxv = 0;
          var maxk = '';
          for(const key in dict){
            if(dict[key] > maxv){
              maxv = dict[key];
              maxk = key;
            }
          }
          return [maxk,maxv];
        },
        // 资源情境
        showSelectedInfo(){
            // console.log(this.selectedIp);
            const info = this.cluster_info[this.selectedIp];

            // cpu使用率
            this.drawCircle(this.$refs.cpuCanvas,info['n_cpu']+'核',info['cpu_ratio']*0.01,'#5b9bd5');

            // 内存使用率
            // console.log(info['mem_total']);
            const mem_total = info['mem_total'].toFixed(1);
            this.drawCircle(this.$refs.memCanvas,mem_total+'GB',info['mem_ratio']*0.01,'#c5e0b4');

            // 获得使用最多的卡的显存和使用率
            const kv = this.getMaxKey(info['gpu_mem_utilization']);
            const gpu_num = kv[0];
            const gpu_ratio = kv[1];
            this.drawCircle(this.$refs.gpuCanvas,info['gpu_mem_total'][gpu_num]+"GB",gpu_ratio*0.01,'#ffd966');

            // 带宽
            this.drawCircle(this.$refs.netCanvas,info['net_ratio(MBps)'].toFixed(2)*1024,1,'#f4b183');
        },
        // 点击选择查询任务
        selectItem(job_id){
          // console.log(job_id);
          // console.log(this.selectJob);
          this.selected = job_id;
          sessionStorage.setItem("job_id", JSON.stringify(this.selected));
          this.submit_job = job_id;
          this.updateResultUrl();
        },
        clearCanvas(canvas){
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height);
        },

        // 查询结果
        updateResultUrl() {
          // console.log(this.submit_job);
          if(this.submit_job){
            const url = this.resultUrl + this.submit_job;
            // console.log(url);
            // const loading = ElLoading.service({
            //   lock: true,
            //   text: "Loading",
            //   background: "rgba(0, 0, 0, 0.7)",
            // });
            fetch(url)
              .then((response) => response.json())
              .then((data) => {
                // loading.close();       
                // console.log(this.runtime);

                this.appended_result = data['appended_result'];
                // console.log(this.appended_result);
                const result = this.appended_result;
                const len = this.appended_result.length;
                // console.log(len);
                this.runtime = result[len - 1]['ext_runtime'];
                this.plan = result[len - 1]['ext_plan'];

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

                this.drawCircle(this.$refs.delayCanvas,this.delay,1,'#5b9bd5');
                this.drawCircle(this.$refs.objNumCanvas,this.obj_n,1,'#c5e0b4');
                this.drawCircle(this.$refs.objSizeCanvas,this.obj_size,1,'#ffd966');
                this.drawCircle(this.$refs.objStableCanvas,this.obj_stable,1,'#f4b183');
              //   this.drawResult();
                  
              })
              .catch((error) => {
                console.log(error);
                // loading.close();
                // ElMessage({
                //   showClose: true,
                //   message: "结果尚未生成,请稍后",
                //   type: "error",
                //   duration: 1500,
                // });
                // this.result = null;
              });
          }
          
        },

        // 更新系统资源状态
        updateResourceUrl() {
          const url = this.resourceUrl;
          fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
            //   console.log(data);
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
        
        // if (this.delay !== null) {
        //     this.drawCircle();
        // }
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
        this.resource_display = ["cpu_ratio","mem_ratio","gpu_ratio","net_ratio(MBps)"],
        // TO_REMOVE: 静态填充
        // this.job_info_dict = { 
        //     "GLOBAL_ID_1": 
        //     { 
        //         "job_id": "GLOBAL_ID_1", 
        //         "selectedIp": "172.27.142.247:5001", 
        //         "selectedVideoId": "1", 
        //         "type": "people in meeting-room",
        //          "mode": "latency", 
        //          "delay_constraint": "0.6", 
        //          "acc_constraint": "0.6" 
        //     },
        //     "GLOBAL_ID_2": 
        //     { 
        //         "job_id": "GLOBAL_ID_2", 
        //         "selectedIp": "172.27.142.247:5002", 
        //         "selectedVideoId": "2", 
        //         "type": "people in meeting-room",
        //          "mode": "latency", 
        //          "delay_constraint": "0.6", 
        //          "acc_constraint": "0.6" 
        //     },
        //     "GLOBAL_ID_3": 
        //     { 
        //         "job_id": "GLOBAL_ID_3", 
        //         "selectedIp": "172.27.142.247:5003", 
        //         "selectedVideoId": "3", 
        //         "type": "people in meeting-room",
        //          "mode": "latency", 
        //          "delay_constraint": "0.6", 
        //          "acc_constraint": "0.6" 
        //     },
        // },
    //     this.cluster_info = {
    // "114.212.81.11": {
    //     "cpu_ratio": 0.1,
    //     "gpu_mem": {
    //         "0": 1.2761433919270835,
    //         "1": 1.2761433919270835,
    //         "2": 1.2761433919270835,
    //         "3": 1.2761433919270835
    //     },
    //     "gpu_utilization": {
    //         "0": 0,
    //         "1": 0,
    //         "2": 0,
    //         "3": 0
    //     },
    //     "mem_ratio": 2.5,
    //     "n_cpu": 48,
    //     "net_ratio(MBps)": 0.00019,
    //     "node_role": "cloud",
    //     "swap_ratio": 0
    // },
    // "172.27.142.247": {
    //     "cpu_ratio": 5.9,
    //     "gpu_mem": {
    //         "0": 12.066474327674278
    //     },
    //     "gpu_utilization": {
    //         "0": 0
    //     },
    //     "mem_ratio": 24.5,
    //     "n_cpu": 4,
    //     "net_ratio(MBps)": 0.00143,
    //     "node_role": "edge",
    //     "swap_ratio": 0
    // }
    //     };

    //     this.appended_result = [
    //     {
    //         "count_result": {
    //             "total": 19,
    //             "up": 16
    //         },
    //         "delay": 0.22060694013323104,
    //         "execute_flag": true,
    //         "frame_id": 774,
    //         "n_loop": 63,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.27425,
    //                 "latency": 1.1754405498504639,
    //                 "pid": 11065
    //             }
    //         ]
    //     },
    //     {
    //         "count_result": {
    //             "total": 18,
    //             "up": 15
    //         },
    //         "delay": 0.20396453993661062,
    //         "execute_flag": true,
    //         "frame_id": 780,
    //         "n_loop": 64,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.27399999999999997,
    //                 "latency": 1.0766024589538574,
    //                 "pid": 11065
    //             }
    //         ]
    //     },
    //     {
    //         "count_result": {
    //             "total": 16,
    //             "up": 12
    //         },
    //         "delay": 0.18409783499581472,
    //         "execute_flag": true,
    //         "frame_id": 786,
    //         "n_loop": 65,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.27949999999999997,
    //                 "latency": 0.9475843906402588,
    //                 "pid": 11065
    //             }
    //         ]
    //     },
    //     {
    //         "count_result": {
    //             "total": 19,
    //             "up": 16
    //         },
    //         "delay": 0.21081665584019255,
    //         "execute_flag": true,
    //         "frame_id": 792,
    //         "n_loop": 66,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.27725,
    //                 "latency": 1.1265530586242676,
    //                 "pid": 11065
    //             }
    //         ]
    //     },
    //     {
    //         "count_result": {
    //             "total": 17,
    //             "up": 16
    //         },
    //         "delay": 0.21186903544834684,
    //         "execute_flag": true,
    //         "frame_id": 798,
    //         "n_loop": 67,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.26975,
    //                 "latency": 1.1213617324829102,
    //                 "pid": 11065
    //             }
    //         ]
    //     },
    //     {
    //         "count_result": {
    //             "total": 19,
    //             "up": 14
    //         },
    //         "delay": 0.21648645401000977,
    //         "execute_flag": true,
    //         "frame_id": 804,
    //         "n_loop": 68,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.273,
    //                 "latency": 1.1257836818695068,
    //                 "pid": 11065
    //             }
    //         ]
    //     },
    //     {
    //         "count_result": {
    //             "total": 18,
    //             "up": 16
    //         },
    //         "delay": 0.21124557086399626,
    //         "execute_flag": true,
    //         "frame_id": 810,
    //         "n_loop": 69,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.276,
    //                 "latency": 1.0686159133911133,
    //                 "pid": 11065
    //             }
    //         ]
    //     },
    //     {
    //         "count_result": {
    //             "total": 20,
    //             "up": 15
    //         },
    //         "delay": 0.21829724311828613,
    //         "execute_flag": true,
    //         "frame_id": 816,
    //         "n_loop": 70,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.271,
    //                 "latency": 1.180079460144043,
    //                 "pid": 11065
    //             }
    //         ]
    //     },
    //     {
    //         "count_result": {
    //             "total": 20,
    //             "up": 15
    //         },
    //         "delay": 0.21993769918169295,
    //         "execute_flag": true,
    //         "frame_id": 822,
    //         "n_loop": 71,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.27575,
    //                 "latency": 1.1873185634613037,
    //                 "pid": 11065
    //             }
    //         ]
    //     },
    //     {
    //         "count_result": {
    //             "total": 19,
    //             "up": 15
    //         },
    //         "delay": 0.2089878831590925,
    //         "execute_flag": true,
    //         "frame_id": 828,
    //         "n_loop": 72,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.27949999999999997,
    //                 "latency": 1.1177542209625244,
    //                 "pid": 11065
    //             }
    //         ]
    //     },
    //     {
    //         "count_result": {
    //             "total": 18,
    //             "up": 14
    //         },
    //         "delay": 0.20454134259905135,
    //         "execute_flag": true,
    //         "frame_id": 834,
    //         "n_loop": 73,
    //         "proc_resource_info_list": [
    //             {
    //                 "cpu_util_limit": 1,
    //                 "cpu_util_use": 0.27425,
    //                 "latency": 1.0840375423431396,
    //                 "pid": 11065
    //             }
    //         ]
    //     }
    // ],
        this.node_type_list = [
                { key: "host", ui_value: "视频边端" },
                { key: "edge", ui_value: "其他边端" },
                { key: "cloud", ui_value: "云端" },
                ];
        this.encoder_type_list = [
            { key: "H264", ui_value: "H264" },
            { key: "JPEG", ui_value: "JPEG" },
            // { key: "x", ui_value: "..." },
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
        // this.initChart();
        this.timer = setInterval(() => {
          this.updateResultUrl();
          this.updateResourceUrl();
        }, 6000);
    },
    beforeUnmount() {
      clearInterval(this.timer);
    },
}
</script>
<style>
.content {
    margin-top: 20px;
}
.card-container {
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
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
  font-weight: 750;
  font-size:18px;
  margin-top:10px;
  margin-bottom:10px;
}
.info-h1-flex-text {
  display: flex;
  align-items: center;
}
.info-h2-1 {
  width: min-content;
  height: min-content;
  white-space: nowrap;
  text-align: center;
  color: #6c9bd4;
  height:30px;
  /* width:120px; */
  line-height:30px;
  background-color: rgb(220, 220, 220);
  /* line-height: 20px; */
  /* border: 2px dashed rgb(77, 77, 77); */
  /* margin: 5px; */
  /* padding: 5px; */
  font-weight: 500;
  /* border-left: 5px solid rgb(77, 77, 77); */
  border-radius: 5px;
  margin: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 40px;
  margin-right: 5px;
}
.info-h2-2 {
  width: 60px;
  height: min-content;
  white-space: nowrap;
  text-align: center;
  color: #6c9bd4;
  height:30px;
  /* width:120px; */
  line-height:30px;
  background-color: rgb(220, 220, 220);
  /* line-height: 20px; */
  /* border: 2px dashed rgb(77, 77, 77); */
  /* margin: 5px; */
  /* padding: 5px; */
  font-weight: 500;
  /* border-left: 5px solid rgb(77, 77, 77); */
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
  background-color: #deebf7;
  /* color:white; */
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
.button-not-selected{
  width:75px;
  height:40px;
  border: 1px solid #ffffff;
  margin-left:8px;
  border-radius:5px;
  background: #dcdcdc;
  text-align:center;
  color:white;
}
.button-selected{
  width:75px;
  height:40px;
  /* color:blue; */
  border: 1px solid #ffffff;
  margin-left:8px;
  border-radius:5px;
  text-align:center;
  color:white;
  background-color: #9dc3e6;
  /* justify-content:center; */
}
.centered-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 使元素高度充满父元素，实现垂直居中 */
}
</style>

<style lang="scss" scoped>
:deep(.user-radio) {
  // ::v-deep .user-radio {
  .el-radio-button__inner {
    color: #ffffff;
    border: 1px solid #ffffff;
    margin-left:8px;
    border-radius:5px;
    // border-radius: 4px;
    background: #dcdcdc;
  }

  .el-radio-button__original-radio:disabled:checked + .el-radio-button__inner {
    background-color: #9dc3e6;
  }
}
</style>