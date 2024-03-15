<template>
    <div>
      <h3>自由任务查询结果</h3>
      <br>
      <!-- <div v-if="freeTaskState === 0 && !hasRendered"> -->
        <div v-if="freeTaskState === 0">
        <p>当前无自由任务!</p>
      </div>
      <!-- if freeTaskState is 1, show this div -->
      <!-- <div v-else-if="freeTaskState === 1 || hasRendered"> -->
        <div v-else-if="freeTaskState === 1">
            <p>当前自由任务正在执行，请稍等...</p>
        </div>
        <!-- if freeTaskState is 2, show this div -->
        <div v-else-if="freeTaskState === 2">
            <p>当前自由任务已完成!</p>
        <div id="free-delay-chart" style="width: 55vw; height: 30vh;"></div>
        <br>
        <!-- 对freeTaskResult中的每个kv 渲染 -->
        <div style="text-align: center;">
        <div class="result-item" v-for="(value, key) in freeTaskResult" :key="key">
          <p class="result-name"><strong>{{ value.name }} : {{ value.value }}</strong></p>
         </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    props: {
      freeTaskState: {
        type: Number,
      },
      freeTaskDelay: {
        type: Object,
      },
      freeTaskResult: {
        type: Object,
      }
    },
    watch: {
      freeTaskDelay: {
        handler: function (newVal, oldVal) {
          console.log('freeTaskDelay changed');
          console.log(newVal);
          if (newVal && newVal.delay && newVal.delay.length > 0) {
            this.initChart();
          }
        },
        deep: true
      },
      freeTaskState: {
        handler: function (newVal, oldVal) {
          if (newVal === 2) {
            console.log('freeTaskState changed to 2');
            // this.$nextTick(() => {
            //   this.initChart();
            // });
          }else if(newVal ===1){
            console.log('freeTaskState changed to 1');
          }
          else if(newVal === 0){
            this.clearChart();
          }
        },
        deep: true
      }
    },
    data() {
      return {
        chartInstance: null,
        // hasRendered: false,
      };
    },
    mounted() {
    //   if (this.freeTaskState === 1) {
    //     this.initChart();
    //   } else {
    //     this.timer = setInterval(() => {
    //       if (this.freeTaskState === 1) {
    //         clearInterval(this.timer);
    //         this.initChart();
    //       }
    //     }, 5000);
    //   }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      initChart() {
        const chartContainer = document.getElementById('free-delay-chart');
        this.chartInstance = echarts.init(chartContainer);
  
        const startTime = new Date(this.freeTaskDelay.start_time).getTime();
        const endTime = new Date(this.freeTaskDelay.end_time).getTime();
        const interval = (endTime - startTime) / (this.freeTaskDelay.delay.length - 1);
        const timeRange = [];
        for (let i = 0; i < this.freeTaskDelay.delay.length; i++) {
          const currentTime = new Date(startTime + i * interval);
          timeRange.push(currentTime.toLocaleTimeString());
        }
  
        const option = {
        //   title: {
        //     text: '自由任务时延图',
        //     left: 'center',
        //   },
          tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c} s'
          },
          xAxis: {
            type: 'category',
            data: timeRange,
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            name: '时延 (s)'
          },
          series: [{
            data: this.freeTaskDelay.delay,
            type: 'line',
            smooth: true,
            areaStyle: {}
          }]
        };
  
        this.chartInstance.setOption(option);
        // this.hasRendered = true;
      },
      clearChart() {
        if (this.chartInstance) {
          this.chartInstance.clear();
        }
        // this.hasRendered = false;
      }
    }
  };
  </script>
  
  <style scoped>
  #free-delay-chart {
    margin: 0 auto;
  }
  </style>
  