<template>
      <!-- <el-card class="box-card"> -->
      <form @submit.prevent="submitService">
        <div>
          <div>
            <h3>选择服务类型</h3>
          </div>
          <div>
            <el-form label-width="100px">
              <!-- <el-form-item label="选择任务"> -->
                <el-select v-model="selectedDetectionIndex" @change="handleChange" placeholder="请选择任务">
                  <el-option v-for="(option, index) in detectionOptions" :key="index" :label="option.chineseLabel" :value="index"></el-option>
                </el-select>
            </el-form>
          </div>
        </div>
        <br>
        <div>
          <h3>选择容器镜像</h3>
          <!-- TODO: 访问后端 提供下拉框进行镜像选择 -->
        </div>
        <div>
          
          <div v-for="(stage, index) in selectedImages" :key="index" style="margin-top: 10px;">
            <p>{{ stage.stage_name }}</p>
            <!-- <el-select v-model="stage.selected" placeholder="Select image"> -->
            <el-select v-model="stage.selected" @change="updateSelection(index,stage,stage.selected)" placeholder="Select image">
              <el-option
                v-for="item in stage.image_list"
                :key="item.image_name"
                :label="item.image_name"
                :value="item.image_name + '-' + item.url"
                
              ></el-option>
            </el-select>
            <p v-if="stage.selected"
             style="margin-top: 10px; font-size: 14px;">{{ stage.selected.split('-')[1]  }}</p>
          </div>
        </div>
  
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
  export default {
    components: {
      ElButton,
    },
    props: ['detectionOptions','installed'],
    data() {
      return {
        selectedImages: [],
        imageList:[],
        loading: false,
        selectedDetectionIndex:null,
        // detectionOptions:[],
        selectedUrls: {},
        successMessage: '',
        // installed: null, // install:已安装, uninstall:未安装
        stageMessage:null,
        loading:false
      };
    },
    
    methods: {
      updateSelection(index,stage,selected){
        this.imageList[index] = selected.split('-')[0];
        console.log(this.installed)
      },
      async handleChange() {
			  this.successMessage = '';
        try {
          const index = this.selectedDetectionIndex;
          if (index !== null && index >= 0 && index < this.detectionOptions.length) {
            const englishLabel = this.detectionOptions[index].englishLabel || '';
            console.log(englishLabel);
            // to get task stage
            const response = await axios.get(`/api/get_task_stage/${englishLabel}`);
            const data = response.data;
            this.stageMessage = data;
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
        const taskName = this.detectionOptions[index].englishLabel || '';
        const image_list = Object.values(this.imageList);
        if (image_list.includes('')) {
            ElMessage.error('请为所有阶段选择镜像');
            return; // 提前结束方法
        }

        console.log(taskName);
        console.log(image_list);
        const content = {
          'task_name':taskName,
          'image_list':image_list
        }
        this.loading = true;
        fetch('/api/install',{
          method: "POST",
          body:content
        }).then((response) => response.json())
          .then((data) => {
              const state = data.state;
              const msg = data.msg;
              this.loading = false;
              if(state === 'success'){
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
              // location.reload();
            }).catch((error) => {
              this.loading = false;
              console.error(error);
              ElMessage.error("网络故障,上传失败");
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
</style>

  
  
  