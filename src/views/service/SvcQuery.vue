<template>
    <div class="outline">
        <div>
            <h3>已下装服务容器</h3>
        </div>
      <ul style="list-style-type: none" class="svc-container">
        <li
          v-for="(service, index) in services"
          :key="index"
          class="svc-item"
        >
          <el-radio
            v-model="selected"
            :label="service"
            @change="sendRequest(service)"
            >{{ service }}</el-radio>
          <!-- <el-divider /> -->
        </li>
      </ul>
      <br>
      <div>
            <h3>当前服务详情</h3>
      </div>

      <div class="table-container">
        <table>
        <thead>
            <tr>
            <th>ip地址</th>
            <th>主机名</th>
            <th>CPU使用率</th>
            <th>内存使用率</th>
            <th>带宽</th>
            <th>存活时间</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in urlData" class="outer-li">
              <td>{{ item.ip }}</td>
              <td>{{ item.hostname }}</td>
              <td>{{ item.cpu }}</td>
              <td>{{ item.memory }}</td>
              <td>{{ item.bandwidth }}</td>
              <td>{{ item.age }}</td>
            </tr>
        </tbody>
        </table>
    </div>
    <div style="text-align: right; margin-top: 20px;">
      <el-button type="danger" @click="stopService()" :disabled="installed!=='install'">停止容器运行</el-button>
    </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['installed'],
    data() {
      return {
        services: [],
        urlData: null,
        execResult: null,
        selected: null,
      };
    },
    methods: {
      stopService(){
        console.log(this.installed)
        
      },
      async getServiceList() {
        const response = await fetch("/api/get_service_list");
        const data = await response.json();
        // const data = ["face_detection","face_alignment","car_detection","helmet_detection","ixpe_preprocess","ixpe_sr_and_pc","ixpe_edge_observe"]
        this.services = data;
        // console.log(this.services);
      },
      async sendRequest(service) {
        try {
          const response = await fetch(`/api/get_execute_url/${service}`);
          const data = await response.json();

          this.urlData = data;
          // 请求成功，处理返回的数据
        } catch (error) {
          // 请求失败，进行提示
          console.error("请求失败:", error);
          // 进行提示操作，比如弹出一个错误提示框
          alert("请求失败，请稍后再试");
        }
      },
      async executeTaskResult() {
        const response = await fetch(
          // "http://127.0.0.1:5500/execute_task/face_detection"
          "/serv/execute_task/face_detection"
        );
        const data = response.json();
        this.execResult = data;
      },
    },
    mounted() {
      this.getServiceList();
      // setInterval(this.getServiceList, 20000);
    },
  };
  </script>
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
  h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  .outline{
    /* max-width: 600px; */
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); */
  }

  .svc-container {
    display: flex;
    flex-wrap: wrap;
    padding: 5px; /* 可根据需要调整 */
    list-style-type: none;
  }

  .svc-item {
    list-style-type: none;
    background-color: #d6d6d6; /* 底色 */
    margin: 5px; /* 可根据需要调整 */
    padding: 5px; /* 可根据需要调整 */
    border-radius: 10px; /* 圆角矩形 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .svc-item:hover {
    background-color: #e0e0e0;
  }

  .el-radio {
    margin-right: 10px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
  }

  th, td {
    border: 1px solid #f2f2f2;
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: #f8f9fa;
  }

  td {
    background-color: #ffffff;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .table-container {
    overflow-x: auto;
  }
  
  </style>
  