<template>
    <div class="outline">
      <div>
          <h3>新增任务流水线</h3>
        </div>

        <div>
                <div class="new-dag-font-style">流水线名称 </div>
                <el-input v-model="newInputName" placeholder="请填写名称" />
                <br>
                <br>
                <div style="display: inline;">
                  <div class="new-dag-font-style">服务容器
                  
                  <el-tooltip placement="right">
                    <template #content>
                      来自docker镜像仓库：https://hub.docker.com/repositories/onecheck
                    </template>
                    <el-button size="small" circle>i</el-button>
                  </el-tooltip>
                  
                </div>
                </div>
                <ul style="list-style-type: none" class="svc-container">
                  <li
                    v-for="(service, index) in services"
                    :key="index"
                    class="svc-item"
                  >
                    <!-- <el-button
                      :label="service"
                      @click="putSvcIntoList(service)"
                      >{{ service }}</el-button> -->
                      <el-tooltip placement="top">
                        <template #content>
                          {{ service.description }}
                        </template>
                        <el-button
                          :label="service.service_name"
                          @click="putSvcIntoList(service.service_name)"
                          >{{ service.service_name }}</el-button>
                      </el-tooltip>
                    <!-- <el-divider /> -->
                  </li>
                </ul>

                <el-input v-model="newInputDag" placeholder="[]" disabled="disabled" />


        </div>
        <br/>

        <div>
          <el-button type="primary" round @click="handleNewSubmit">提交新增</el-button>
          <el-button type="primary" round @click="clearInput">清空已选</el-button>
          <!-- <el-button round>修改</el-button>
          <el-button round>删除</el-button> -->
        </div>
        <br/><br/>
        <div>
          <h3>现有任务流水线</h3>
        </div>

        <el-table :data="dagList" style="width: 100%">
            <el-table-column label="服务名称" width="180">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                <!-- <el-icon><timer /></el-icon> -->
                <span style="margin-left: 10px">{{ scope.row.dag_name }}</span>
                </div>
            </template>
            </el-table-column>
            <el-table-column label="流水线" width="540">
            <template #default="scope">
                <div>{{ scope.row.dag }}</div>
            </template>
            </el-table-column>
            <el-table-column label="操作">
            <template #default="scope">
                
                <el-button
                size="small"
                type="danger"
                @click="deleteWorkflow(scope.$index,scope.row.dag_id)"
                >删除</el-button
                >
            </template>
            </el-table-column>
        </el-table>

        <br>

        <br>

        <br>
        



    </div>
</template>

<script>
import { ElTable, ElTableColumn, ElTooltip, ElTag, ElInput, ElButton} from 'element-plus';
import { ElMessage } from "element-plus";
export default {
    components: {
        ElTable,
        ElTableColumn,
        ElTooltip,
        ElTag,
        ElInput,
        ElButton,
    },
    data(){
        return{
            services: [],
            editInput: '',
            newInputName: '',
            newInputDag: '',
            editDisabled: true,
            editingIndex: -1,
            editingRow: null,
            dagList:[
                
            ],
        };
    },
    methods: {
        clearInput(){
          this.newInputDag = ''
        },
        deleteWorkflow(index,dag_id){
          this.dagList.splice(index, 1);
          console.log(dag_id);
          const content = {
            'dag_id': dag_id
          }
          fetch('/api/delete_dag_workflow',{
            method:'POST',
            body:JSON.stringify(content)
          }).then(response => response.json())
          .then(data => {
              const state = data['state']
              let msg = data['msg']
              msg+=',即将刷新页面'
              this.showMsg(state,msg);
              setTimeout(() => {
                location.reload()
              }, 1000);
          }).catch(error=>{
            ElMessage.error("出错了,请联系管理员")
            console.log(error);
          })
        },
        handleNewSubmit(){
          if(this.newInputName === '' || this.newInputName === null){
            ElMessage.error("请填写服务名称")
            return;
          }
          if(this.newInputDag === '' || this.newInputDag === null){
            ElMessage.error("请选择流水线")
            return;
          }
          const newData = {
            "dag_name":this.newInputName,
            "dag":JSON.parse(this.newInputDag)
          }
            // this.dagList.push({
            //     "dag_name":this.newInputName,
            //     "dag":JSON.parse(this.newInputDag)
            // });
            this.updateDagList(newData);
            this.newInputName = '';
            this.newInputDag = '';
        },
        getDagList(){
          console.log('get_dag_workflows_api');
            fetch('/api/get_dag_workflows_api') 
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // 成功获取数据后，更新dagList字段
                this.dagList = data;
            })
            .catch(error => {
                // console.error('Error fetching data:', error);
                console.error('Error fetching data');
            });
        },
        fetchData(){
          this.getDagList();
        },
        showMsg(state,msg){
          if(state==='success'){
              ElMessage({
                message: msg,
                showClose: true,
                type: "success",
                duration: 3000,
              });
            }else{
              ElMessage({
                message: msg,
                showClose: true,
                type: "error",
                duration: 3000,
              });
            }
        },
        updateDagList(data) {
          console.log(data);
          fetch('/api/update_dag_workflows_api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
            const state = data['state'];
            const msg = data['msg'];
            console.log(state);
            this.showMsg(state,msg);
            this.getDagList();
            location.reload()
          })
          .catch(error => {
            console.error('Error sending data:', error);
          });
        },
        async getServiceList() {
          const response = await fetch("/api/get_all_service");
          const data = await response.json();
          // const data = ["face_detection","face_alignment","car_detection","helmet_detection","ixpe_preprocess","ixpe_sr_and_pc","ixpe_edge_observe"]
          this.services = data;
          console.log(this.services);
      },
      putSvcIntoList(service){
        service = "\"" + service + "\""
        if(this.newInputDag == ''){
          this.newInputDag = '[' + service + ']'
        }else{
          service = ',' + service;
          const lastBracketIndex = this.newInputDag.lastIndexOf(']');
          if (lastBracketIndex !== -1) {
            this.newInputDag = this.newInputDag.slice(0, lastBracketIndex) + service + this.newInputDag.slice(lastBracketIndex);
          } else {
            this.newInputDag += service;
          }   
      }
    }
    
  },
  mounted() {
          // 初次加载数据
          this.fetchData();

          // 每隔一段时间获取一次数据
          // setInterval(() => {
          //   this.fetchData();
          // }, 5000); 

          this.getServiceList();
          // setInterval(this.getServiceList, 5000);
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


