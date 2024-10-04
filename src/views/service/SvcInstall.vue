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
          <el-select style="width: 300px;" v-model="selectedDetectionIndex"
                     placeholder="请选择任务">
            <el-option v-for="(option, index) in detectionOptions" :key="index" :label="option.dag_name"
                       :value="index"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <br>
    <div>
      <h3>选择调度算法</h3>
    </div>
    <div>

      <el-select style="width: 300px;" v-model="selectedPolicyIndex"
                 placeholder="请选择调度策略">
        <el-option v-for="(option, index) in policyOptions" :key="index" :label="option.policy_name"
                   :value="index"></el-option>
      </el-select>

    </div>

    <!-- :loading="loading" :disabled="installed === 'install'" -->
    <div>
      <el-button type="primary" round native-type="submit"
                 :loading="loading" :disabled="installed === 'install'"
                 style="margin-top: 10px;"
      >安装服务
      </el-button>
    </div>
  </form>
</template>

<script>
import {ElButton} from "element-plus";
import {ElMessage} from "element-plus";

import axios from 'axios';
import {useInstallStateStore} from '/@/stores/installState';
import {ref, watch, onMounted} from 'vue';
// const install_state = useInstallStateStore()
export default {
  components: {
    ElButton,
  },
  data() {
    return {
      selectedImages: [],
      // imageList: [],
      selectedDetectionIndex: null,
      selectedPolicyIndex: null,
      selectedUrls: {},
      successMessage: '',
      // installed: install_state.status, // install:已安装, uninstall:未安装
      stageMessage: null,
      loading: false
    };
  },
  setup() {
    const install_state = useInstallStateStore();
    const installed = ref(null);
    const detectionOptions = ref(null);
    const policyOptions = ref(null);
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
        const response = await axios.get('/api/policy');
        if (response.data !== null) {
          policyOptions.value = response.data;
        }
      } catch (error) {
        console.error('Failed to fetch detection options', error);
        ElMessage.error("出错了,请联系工作人员")
      }

      try {
        const response = await axios.get('/api/install_state');
        installed.value = response.data['state'];
        if (installed.value === 'install') {
          install_state.install();
        } else {
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
      policyOptions,
      getTask
    };
  },
  methods: {
    updateSelection(index, stage, selected) {
      // this.imageList[index] = selected.split('&')[0];
      // console.log(this.installed)
    },
    submitService() {
      const index = this.selectedDetectionIndex;
      if (index !== null && index >= 0 && index < this.detectionOptions.length) {
        // const taskName = this.detectionOptions[index].englishLabel || '';
        const dagId = this.detectionOptions[index].dag_id;
        const policyId = this.policyOptions[this.selectedPolicyIndex].policy_id

        // console.log(image_list);
        const content = {
          'dag_id': dagId,
          'policy_id': policyId
        }
        let task_info = JSON.stringify(content);

        // console.log(JSON.stringify(content));
        this.loading = true;
        fetch('/api/install', {
          method: "POST",
          body: task_info
        }).then((response) => response.json())
            .then((data) => {
              const state = data.state;
              let msg = data.msg;
              this.loading = false;
              if (state === 'success') {
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
              } else {
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
          ElMessage.error("网络故障,上传失败", 3000);
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

  
  
  