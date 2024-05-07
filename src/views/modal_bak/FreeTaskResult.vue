<template>
    <div class="result-container">
      <h3>自由任务执行结果</h3>
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
        <div class="result-item" v-for="item in localFreeTaskResult" :key="item.name">
          <p class="result-name">{{ item.name }}: {{ item.value }}</p>
          <!-- <p class="result-value">{{ item.value }}</p> -->
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      freeTaskState: {
        type: Number,
      },
      freeTaskResult: {
        type: Object,
      }
    },
    data() {
      return {
        // hasRendered: false,
        localFreeTaskResult: this.freeTaskResult
      };
    },
    watch: {
      freeTaskResult: {
        handler: function (newVal, oldVal) {
          this.localFreeTaskResult = newVal;

        },
        deep: true
      },
      freeTaskState: {
        handler: function (newVal, oldVal) {
          if (newVal === 2) {
            this.showResult();
          }
          else {
            this.clearResult();
          }
        },
        deep: true
      }
    },
    mounted() {
    //   if (this.freeTaskState === 1) {
    //     this.showResult();
    //   } else {
    //     this.timer = setInterval(() => {
    //       if (this.freeTaskState === 1) {
    //         clearInterval(this.timer);
    //         this.showResult();
    //       }
    //     }, 5000);
    //   }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      showResult() {
        // this.hasRendered = true;
        this.localFreeTaskResult = this.freeTaskResult;
      },
      clearResult() {
        // this.hasRendered = false;
        this.localFreeTaskResult = {};
      }
    }
  }
  </script>
  
  <style scoped>
  .result-container {
    text-align: center;
  }
  
  .result-item {
    margin-bottom: 10px;
  }
  
  .result-name {
    font-weight: bold;
    margin-right: 10px;
  }
  
  .result-value {
    display: inline-block;
  }
  </style>
  