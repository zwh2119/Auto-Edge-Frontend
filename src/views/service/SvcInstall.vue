<template>
      <!-- <el-card class="box-card"> -->
      <form @submit.prevent="submitService">
        <div>
          <div>
            <h3>选择服务类型</h3>
          </div>
          <div>
            <div>
              <!-- <el-form-item label="选择任务"> -->
                <el-select style="width: 300px;" v-model="selectedDetectionIndex" @change="handleChange" placeholder="请选择任务">
                  <el-option v-for="(option, index) in detectionOptions" :key="index" :label="option.dag_name" :value="index"></el-option>
                </el-select>
              </div>
          </div>
        </div>
        <br>
        <div>
          <h3>选择容器镜像</h3>
          <!-- TODO: 访问后端 提供下拉框进行镜像选择 -->
        </div>
        <div>
          
          <div v-for="(stage, index) in selectedImages" :key="index" style="margin-top: 10px;">
            <p style="margin-bottom: 10px;">{{ stage.stage_name }}</p>
            <!-- <el-select v-model="stage.selected" placeholder="Select image"> -->
            <el-select style="width: 300px;" v-model="stage.selected" @change="updateSelection(index,stage,stage.selected)" placeholder="选择镜像">
                <el-option
                    v-for="item in stage.image_list"
                    :key="item.image_name"
                    :label="item.image_name"
                    :value="item.image_name + '&' + item.url"
                ></el-option>
            </el-select>
            <p v-if="stage.selected" style="margin-top: 10px; font-size: 14px;">仓库url:{{ stage.selected.split('&')[1]  }}</p>
            <el-divider v-if="index < selectedImages.length - 1"></el-divider>
            <!-- {{ stage.selected }} -->
        </div>

        </div>
  
        <!-- :loading="loading" :disabled="installed === 'install'" -->
        <div>
          <el-button type="primary" round native-type="submit" 
          :loading="loading" :disabled="installed === 'install'"
          style="margin-top: 10px;"
            >安装服务</el-button>
        </div>
      </form>
  </template>

<script>
  import { ElButton } from "element-plus";
  import { ElMessage } from "element-plus";

  import axios from 'axios';
  import{useInstallStateStore} from '/@/stores/installState';
  import {ref,watch,onMounted } from 'vue';
  // const install_state = useInstallStateStore()
  export default {
    components: {
      ElButton,
    },
    data() {
      return {
        selectedImages: [],
        imageList:[],
        selectedDetectionIndex:null,
        selectedUrls: {},
        successMessage: '',
        // installed: install_state.status, // install:已安装, uninstall:未安装
        stageMessage:null,
        loading:false
      };
    },
    setup() {
      const install_state = useInstallStateStore();
      const installed = ref(null);
      const detectionOptions = ref(null);
      const getTask = async () => {
        try {
          const response = await axios.get('/api/task');
          if (response.data !== null) {
            detectionOptions.value = response.data;
          }
        } catch (error) {
          console.error('Failed to fetch detection options', error);
          ElMessage.error("出错了,请联系工作人员")
        }
        
        try {
          const response = await axios.get('/api/install_state');
          installed.value = response.data['state'];
          if(installed.value === 'install'){
            install_state.install();
          }else{
            install_state.uninstall();
          }
        } catch (error) {
          console.error("query state error");
        }
      }

      watch(() => install_state.status, (newValue, oldValue) => {
        installed.value = newValue;
      });
      
      onMounted(async () => {
        getTask();
      });

      return {
        installed,
        install_state,
        detectionOptions,
        getTask
      };
    },
    methods: {
      updateSelection(index,stage,selected){
        this.imageList[index] = selected.split('&')[0];
        // console.log(this.installed)
      },
      async handleChange() {
			  this.successMessage = '';
        this.selectedImages = [];
        this.imageList = [];
        try {
          const index = this.selectedDetectionIndex;
          if (index !== null && index >= 0 && index < this.detectionOptions.length) {
            // const englishLabel = this.detectionOptions[index].englishLabel || '';
            const id = this.detectionOptions[index].dag_id
            // console.log(englishLabel);
            const response = await axios.get(`/api/get_task_stage/${id}`);
            const data = response.data;
            this.stageMessage = data;
            // console.log(data.length)
            for(var i = 0;i < data.length;i ++){
              this.selectedImages.push(data[i]);
              // console.log(data[i])
              this.imageList.push('');
            }
          } else {
            console.error('Invalid selected index.');
          }
        } catch (error) {
          console.error('Submission failed', error);
        }
		},
    submitService(){
      const index = this.selectedDetectionIndex;
      if (index !== null && index >= 0 && index < this.detectionOptions.length) {
        // const taskName = this.detectionOptions[index].englishLabel || '';
        const dagId = this.detectionOptions[index].dag_id;
        const image_list = Object.values(this.imageList);
        console.log(image_list)
        if (image_list.includes('')) {
            ElMessage.error('请为所有阶段选择镜像');
            return; // 提前结束方法
        }

        // console.log(image_list);
        const content = {
          'dag_id':dagId,
          'image_list':image_list
        }
        let task_info = JSON.stringify(content);
        
        // console.log(JSON.stringify(content));
        this.loading = true;
        fetch('/api/install',{
          method: "POST",
          body:task_info
        }).then((response) => response.json())
          .then((data) => {
              const state = data.state;
              let msg = data.msg;
              this.loading = false;
              if(state === 'success'){
                this.install_state.install();
                // this.installed = 'install';
                // console.log(this.install_state.status);
                msg += ",即将刷新页面"
                ElMessage({
                  message: msg,
                  showClose: true,
                  type: "success",
                  duration: 3000,
                });
                setTimeout(() => {
                  location.reload();  
                }, 3000);
              }else{
                ElMessage({
                  message: msg,
                  showClose: true,
                  type: "error",
                  duration: 3000,
                });
              }
              
            }).catch((error) => {
              this.loading = false;
              // console.error(error);
              ElMessage.error("网络故障,上传失败",3000);
            });
      }
      
    },
      
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


  .el-button {
    font-size: 16px;
    margin-right: 10px;
  }

  .el-button:first-child {
    margin-left: 0;
     
  }
</style>

  
  
  