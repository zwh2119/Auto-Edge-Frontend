<!-- <template>
	<div>
		<el-card class="cluster-card" shadow="hover" style="margin: 20px; border: 1px solid #ebeef5">
			<div slot="header" style="font-size: 20px; font-weight: bold; margin-bottom: 20px">集群信息</div>

			<div v-if="loading">正在加载...</div>
			<div v-else>
				<el-table :data="formattedClusterInfo" border>
					<el-table-column prop="key" label="IP"></el-table-column>
					<el-table-column prop="value" label="Hostname"></el-table-column>
				</el-table>
			</div>
		</el-card>
	</div>
</template>
  
  <script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
	setup() {
		// 使用 ref 创建响应式变量
		const loading = ref(true);
		const clusterInfo = ref({});

		// 使用 onMounted 钩子在组件挂载后执行操作
		onMounted(async () => {
			try {
				// 发送后端请求获取集群信息
				const response = await axios.get('/api/info'); // 替换成实际的后端接口地址
				clusterInfo.value = response.data;
			} catch (error) {
				console.error('获取集群信息失败', error);
				clusterInfo.value = { 'cloud.kubeedge': '114.212.81.11', edge1: '192.168.1.2', edge2: '192.168.1.4' };
			} finally {
				loading.value = false;
			}
		});

		// 返回需要在模板中使用的变量和方法
		return {
			loading,
			clusterInfo,
		};
	},
	computed: {
		formattedClusterInfo() {
			return Object.entries(this.clusterInfo).map(([key, value]) => ({
				key,
				value,
			}));
		},
	},
};
</script>
  
  <style scoped>
/* 可以添加一些组件的样式 */
</style>
   -->

   <template>
	<div class="tooltip-base-box">
	  <div class="row center">
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Top Left prompts info"
		  placement="top-start"
		>
		  <el-button>top-start</el-button>
		</el-tooltip>
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Top Center prompts info"
		  placement="top"
		>
		  <el-button>top</el-button>
		</el-tooltip>
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Top Right prompts info"
		  placement="top-end"
		>
		  <el-button>top-end</el-button>
		</el-tooltip>
	  </div>
	  <div class="row">
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Left Top prompts info"
		  placement="left-start"
		>
		  <el-button>left-start</el-button>
		</el-tooltip>
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Right Top prompts info"
		  placement="right-start"
		>
		  <el-button>right-start</el-button>
		</el-tooltip>
	  </div>
	  <div class="row">
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Left Center prompts info<br>
		  adssdgsadf"
		  placement="left"
		>
		  <el-button class="mt-3 mb-3">left</el-button>
		</el-tooltip>
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Right Center prompts info"
		  placement="right"
		>
		  <el-button>right</el-button>
		</el-tooltip>
	  </div>
	  <div class="row">
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Left Bottom prompts info"
		  placement="left-end"
		>
		  <el-button>left-end</el-button>
		</el-tooltip>
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Right Bottom prompts info"
		  placement="right-end"
		>
		  <el-button>right-end</el-button>
		</el-tooltip>
	  </div>
	  <div class="row center">
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Bottom Left prompts info"
		  placement="bottom-start"
		>
		  <el-button>bottom-start</el-button>
		</el-tooltip>
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  placement="bottom"
		>
		<template #content>
			多行信息<br/>第二行信息
		</template>
		  <el-button>bottom</el-button>
		</el-tooltip>
		<el-tooltip
		  class="box-item"
		  effect="dark"
		  content="Bottom Right prompts info"
		  placement="bottom-end"
		>
		  <el-button>bottom-end</el-button>
		</el-tooltip>
	  </div>
	</div>
  </template>
  
  <style>
  .tooltip-base-box {
	width: 600px;
  }
  .tooltip-base-box .row {
	display: flex;
	align-items: center;
	justify-content: space-between;
  }
  .tooltip-base-box .center {
	justify-content: center;
  }
  .tooltip-base-box .box-item {
	width: 110px;
	margin-top: 10px;
  }
  </style>
  