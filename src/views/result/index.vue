<template>
    <div class="content">
        <!-- 视频任务配置new  -->
        <el-card shadow="hover" style="margin-left: 20px;margin-right: 20px;">
            <div slot="header" style="font-size: 20px; font-weight: bold; margin-bottom: 20px;">视频任务配置</div>
            
            <!-- 显示当前页的内容 -->
            <div style="display: flex; flex-direction: column; align-items: center;">
              <!-- 上面的 div 包含 v-for 循环的内容 -->
              <div>
                <div v-for="(values, job_id, index) in currentPageItems" class="available-node-result"
                  v-on:click="selectQuery(job_id)"
                  v-bind:class="{ 'selected': selected === job_id }"
                >
                  <div class="centered-div">
                    <ul style="list-style-type: none;">
                        <li style="font-size: 16px; font-weight: bold;">{{job_id}}</li>
                        <li class="subli">节点：{{values['node_id']}}，摄像头: {{ values['video_id'] }}</li>
                        <li class="subli">流水线: {{ dag_dict[values['dag_id']]['name'] }}</li>
                        <!-- <li class="subli">优化模式: {{ values.mode == 'latency'? '时延优先':'精度优先' }}</li> -->
                        <li class="subli">调度器: {{ scheduler_dict[values['scheduler_id']]['description'] }}</li>
                        <li class="subli">时延约束（秒）: {{ 0.2 }}
                            <!-- {{ values.delay_constraint }} - {{ values.acc_constraint }} -->
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

        <el-card shadow="hover" style="margin: 20px;">
          <div ref="checkboxContainer">
            <el-checkbox @change="togglePic()" :disabled="!selected" v-model="checkedPic">处理结果可视化</el-checkbox>
            <!-- <el-checkbox v-for="(item, idx) in keyList" :key="idx" :label="item" @change="toggleChart(item)" :disabled="!selected">{{ item }}</el-checkbox> -->
            <el-checkbox v-for="(item, idx) in modifiedKeyList" :key="idx" :label="item" @change="toggleChart(mapBack(item))" :disabled="!selected" v-model="checkboxes[idx]">{{ item }}</el-checkbox>
  
          </div>

          <!-- 画布容器 -->
          <div>
            <div v-show="showOriginal" style="width: 500px; height: 250px; margin-top: 20px; float: left;">
              <img :src="videoUrl + selected" style="width: 100%; height: 90%;" />
            </div>
            
            <div v-for="(item, idx) in keyList" :key="idx" style="float: left;margin-left: 20px;">
              <div v-show="showChart(item)" :id="item" style="width: 500px; height: 250px; margin-top: 20px;"></div>
            </div>
          </div>

        </el-card>



    </div>
</template>
<script>
import { ElLoading, ElMessage } from "element-plus";
import * as echarts from "echarts";
import * as common from '../common.js'
export default{
    data(){
        return{
            // url
            resultUrl: "/dag/get_agg_info",
            resourceUrl: "/serv/get_cluster_info",
            videoUrl: "video/user/video/",

            cluster_info:null,
            selectedIp:null,

            // 可查询任务
            // 选取的查询任务
            submit_job: null,
            // 查询结果
            result: null,
            appended_result: null,

            // 选择的查询任务
            selected: null,

            node_type_list: [],
            // 前端获取已经提交的任务
            job_info_dict: {},
            scheduler_dict: {},
            dag_dict: {},

            // 绘制结果折线图
            chart:null,

            // 定时器
            timer:null,

            // 分页控件
            itemsPerPage: 3, // 每页显示的数量
            currentPage: 1, // 当前页数

            // checkbox相关
            keyList:[],
            checkedKey:null,
            showOriginal:false,
            selectedCharts:[],
            showOverview:false,

            checkedPic:false,
            checkboxes:[],

            // 一段时间折线图
            maxCount:10,
            delay_list:{},
            
        };
    },
    methods: {
        mapTOChinese(value) {
          if (value in common.RESULT_KEY_ZH) {
            return common.RESULT_KEY_ZH[value];
          } else {
            return value;
          }
        },

        mapBack(value) {
          const zh_map = common.RESULT_KEY_ZH
          for (var k in zh_map) {
            if (zh_map[k] === value) {
              return k;
            }
          }
          return value;
        },

        togglePic(){
          if(!this.showOriginal){
            this.showOriginal = true;
          }else{
            this.showOriginal = !this.showOriginal;
          }
          console.log(this.showOriginal);
        },

        toggleChart(itemKey){
          // 已经被选择则清除
          console.log("[toggleChart] this.selectedCharts = ", this.selectedCharts);
          console.log("[toggleChart] itemKey = ", itemKey);
          if (this.selectedCharts.includes(itemKey)) {
            this.selectedCharts = this.selectedCharts.filter(item => item !== itemKey);
            // console.log("尝试清除");
            echarts.dispose(document.getElementById(itemKey));
          } else {
            this.selectedCharts.push(itemKey);
            // 获取appended_result中每个元素的count_result字段，提取itemKey对应的value
            this.showSelectedResult(itemKey);
          }
          console.log(this.selectedCharts);

          // 没被选择则加入到list中
        },

        showChart(itemKey){
          return this.selectedCharts.includes(itemKey);
        },

        showSelectedResult(itemKey){
          console.log("[showSelectedResult] itemKey = " + itemKey);
          // this.updateResultUrl();
          var chart;
          if (echarts.getInstanceByDom(document.getElementById(itemKey)) === undefined) {
            chart = echarts.init(document.getElementById(itemKey));
          } else {
            chart = echarts.getInstanceByDom(document.getElementById(itemKey));
            // chart.clear();
          }
          // var chart = echarts.init(document.getElementById(itemKey));
          
          var xAsixName = "n_loop";

          const data = this.appended_result.map((item) => ({
            x:item[common.QSS_INFO_KEY_TID],
            y:item[common.QSS_INFO_KEY_RESULT][itemKey],
          }))

          // 2、获取itemKey字段的数据，itemKey字段对应的字典值可能是以下类型数据：
          // （1）数值的序列
          // （2）字典的序列
          const DATA_KEY_X = 'X';
          const DATA_KEY_Y = 'Y';
          var itemXYData;
          itemXYData = this.appended_result.map(function(item) {
            var X_val = item[common.QSS_INFO_KEY_TID];
            var Y_dict = item[common.QSS_INFO_KEY_RESULT][itemKey];
            if (typeof Y_dict !== 'object') {
              Y_dict = {[itemKey]: Y_dict};
            }
            return {[DATA_KEY_X]: X_val, [DATA_KEY_Y]: Y_dict};
          });

          console.log("[plotChart] itemXYData=", itemXYData);

          var series_v = {};
          var series_kl = [];

          // 3、初始化itemKey值字段的数据列表
          for (var i = 0; i < itemXYData.length; i++) {
            var kl = Object.keys(itemXYData[i][DATA_KEY_Y]);
            for (var j = 0; j < kl.length; j++) {
              if (series_kl.indexOf(kl[j]) == -1) {
                series_kl.push(kl[j]);
              }
            }
          }
          for (var i = 0; i < series_kl.length; i++) {
            var k = series_kl[i];
            series_v[k] = [];
          }
          // 4、生成各itemKey值字段的数据序列
          for (var i = 0; i < itemXYData.length; i++) {
            var value_dict = itemXYData[i][DATA_KEY_Y];
            for (var value_k in value_dict) {
              var k = value_k;
              var v = value_dict[value_k];
              series_v[k].push(v);
            }
          }
          // 5、生成各itemKey值字段的chart数据序列和与其对应的legend列表
          var y_axis_type = 'value';
          var chart_series_list = [];
          var chart_legend_list = [];
          // console.log("seriesData entries: " + Object.entries(seriesData));
          for (var ent of Object.entries(series_v)) {
            // console.log("ent[0]=" + ent[0]);
            // console.log("ent[1]=" + ent[1]);
            var k = ent[0];
            var v_list = ent[1];
            if (v_list.length > 0 && typeof v_list[0] === 'string') {
              y_axis_type = 'category';
            }
            chart_legend_list.push(k);
            chart_series_list.push({
              name: k,
              type: "line",
              label: {
                show: true,
                position: "top",
                color: "black",
                fontSize: 5,
                formatter: function (d) {
                  return d.data;
                },
              },
              data: v_list,
            });
          }

          // 6、喂数据画图
          const option = {
            xAxis: {
              type: 'category',
              data: itemXYData.map((item) => item[DATA_KEY_X]), // 使用映射后的横坐标数据
              name: "任务ID"
            },
            yAxis:{
              type: y_axis_type,
              name: '值'
            },
            legend: {
              data: chart_legend_list
            },
            series: chart_series_list,
            title:{
              show: true,
              text: this.mapTOChinese(itemKey),
            }
          };
          chart.setOption(option);
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
        selectQuery(job_id) {
          console.log(job_id);
          this.selected = job_id;
          this.submit_job = job_id;
          this.selectedCharts = [];
          this.showOriginal = false;
          this.checkedPic = false;
          this.clearCheckboxes();
          // 开始轮询获取job_id的结果并更新到全局变量
          this.updateResultUrl();
          // this.fetchAndProcessData();
        },

        // 获取appended_result中的key列表，更新前端key列表
        updateKeyList(){

          if (!this.appended_result) {
            console.log("[updateKeyList] this.appended_result is null");
            return;
          }

          const data = this.appended_result;
          console.log("[updateKeyList] data=", data);
          console.log(common.QSS_INFO_KEY_RESULT);
          const resKeyList = [];
          for(var i = 0;i < data.length;i ++){
            var keylist =  Object.keys(data[i][common.QSS_INFO_KEY_RESULT]);
            for(var j = 0;j < keylist.length;j ++){
              if(resKeyList.indexOf(keylist[j]) == -1){
                resKeyList.push(keylist[j]);
              }
            }
          }
          const isSame = (arr1, arr2) => {
            if (arr1.length !== arr2.length) {
              return false;
            }
            
            return arr1.every(item => arr2.includes(item));
          };

          // 如果keyList有变化则清空selectedCharts和checkboxes的选中状态
          console.log("[updateKeyList] resKeyList=", resKeyList);
          const keyListsAreSame = isSame(this.keyList, resKeyList);
          if(!keyListsAreSame){
            this.keyList = resKeyList;
            console.log(this.keyList);
            this.clearCheckboxes();
            this.selectedCharts = [];
          }
        },
        // 清除复选框勾选状态
        
        clearCheckboxes() {
          // 清除所有复选框的勾选状态
          this.checkboxes = this.checkboxes.map(() => false);
        },
        
        // 拼接submit_job到resultUrl，并获取一次结果
        assignData(data, job_id) {
          if (!data) {
            data = common.STATIC_RESULT;
          }
          console.log("[assignData] data=");
          console.log(data);

          if (!job_id) {
            job_id = Object.keys(data[common.KEY_QSS])[0];
          }
          console.log("[assignData] job_id=" + job_id);

          this.appended_result = data[common.KEY_QSS][job_id];

          const len = this.appended_result.length;

          console.log("[assignData] result len=" + len);

          // 根据结果更新可显示的图表的key值
          this.updateKeyList();
        },

        // 更新执行结果
        updateResultUrl() {
          
          console.log("[updateResultUrl] trigger once, this.submit_job = " + this.submit_job);

          if(this.submit_job !== null && this.submit_job !== undefined){
            // const url = this.resultUrl + this.submit_job;
            const url = this.resultUrl;

            console.log("[updateResultUrl] url = " + url);
            // const loading = ElLoading.service({
            //   lock: true,
            //   text: "Loading",
            //   background: "rgba(0, 0, 0, 0.7)",
            // });

            fetch(url)
              .then((response) => response.json())
              .then((data) => {
                // loading.close();
  
                this.result = data;
                // loading.close();

                this.assignData(data, this.submit_job);
  
              })
              .catch((error) => {
                console.log(error);
                // loading.close();

                this.assignData(null, null);

                ElMessage({
                  showClose: true,
                  message: "结果尚未生成,请稍后",
                  type: "error",
                  duration: 1500,
                });
                this.result = null;
              });
          }
          
        },

        // 获取正在运行的任务
        updateQueryInfo() {
          console.log("[updateQueryInfo]");

          this.getValidScheduler();
          this.getValidDAG();

          fetch("/api/get_query_meta")
            .then((resp) => resp.json())
            .then((data) => {
              console.log(data);
              this.job_info_dict = data;
            })
            .catch((err) => {
              console.log(err);
              this.job_info_dict = common.STATIC_SUBMITED_JOB_DICT;
            });
        },
        // 获取合法DAG
        getValidDAG() {
          fetch('/api/get_valid_dag')
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.dag_dict = data;
          })
          .catch(err =>{
            this.errHandler(err);
          });
        },
        // 获取合法调度器
        getValidScheduler() {
          fetch('/api/get_scheduler')
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.scheduler_dict = data;
          })
          .catch(err =>{
            this.errHandler(err);
          });
        },
        // 出错处理
        errHandler(err) {
          console.error(err);
          sessionStorage.clear();
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
          // var test_obj = {
          //   'selectedIp': '123.34.23.3:8000',
          //   'type': '测试输出', 
          //   'selectedVideoId': 'v0', 
          //   'mode': 'latency',
          //   'delay_constraint': 0.2,
          //   'acc_constraint': 0.8
          // }
          // return {
          //   'abcd': test_obj
          // }
        },


        // *************************************
        // 以modified开头的函数，主要做字段映射
        // *************************************

        // 映射结果字段
        modifiedKeyList(){
          // console.log(this.keyList);
          if(!this.keyList){
            return null;
          }

          return Object.fromEntries(
            Object.entries(this.keyList).map(([key,value]) =>{
              if (value in common.RESULT_KEY_ZH) {
                return [key, common.RESULT_KEY_ZH[value]];
              } else {
                return [key, value];
              }
            })
          );
        },

        // 映射任务信息字段
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
    },

    mounted(){
        
      const delay_list = sessionStorage.getItem("delay_list");
      if (delay_list) {
          this.delay_list = JSON.parse(delay_list);
      }

      this.updateKeyList();

      // this.initChart();
      this.timer = setInterval(() => {
        this.updateResultUrl();
        this.updateQueryInfo();

        // TODO:updateKeyList后会导致选中的复选框内容可能变化
        // 解决:如果keyList发生变化则清空已选内容和复选框勾选状态;不变则继续更新原来的折线图
        for(var i = 0;i < this.selectedCharts.length;i ++){
          this.showSelectedResult(this.selectedCharts[i]);
        }
      }, 3000);
      
      
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
  /* background-color: rgb(96, 158, 254);
  color:white; */
  background-color: #deebf7;
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

