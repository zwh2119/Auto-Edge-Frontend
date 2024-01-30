<template>
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
  