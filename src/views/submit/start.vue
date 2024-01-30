<template>
	<div>
		<el-card shadow="hover" style="margin: 20px">
			<div class="form-header">提交任务</div>

			<el-form label-width="100px">
				<el-form-item label="选择任务">
					<el-select v-model="selectedDetectionIndex" @change="handleChange" placeholder="请选择任务">
						<el-option v-for="(option, index) in detectionOptions" :key="index" :label="option.chineseLabel" :value="index"></el-option>
					</el-select>
					<el-button style="margin-left: 20px" type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<Free />
		<el-loading :visible="loading" text="提交中，请稍候..." fullscreen></el-loading>
		<!-- <el-alert v-if="successMessage" title="提交成功" type="success" :closable="false">{{ successMessage }}</el-alert> -->
	</div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElCard, ElForm, ElFormItem, ElSelect, ElOption, ElButton, ElLoading, ElMessage, ElAlert } from 'element-plus';
import Free from './Free.vue';

export default {
	components: {
		ElCard,
		ElForm,
		ElFormItem,
		ElSelect,
		ElOption,
		ElButton,
		ElLoading,
		ElMessage,
		ElAlert,
		Free,
	},
	setup() {
		const selectedDetectionIndex = ref(null);
		const successMessage = ref('');
		const loading = ref(false);
		const detectionOptions = ref([]);

		onMounted(async () => {
			try {
				const response = await axios.get('/api/task');
				detectionOptions.value = response.data.map((item) => {
					const key = Object.keys(item)[0];
					const value = item[key];
					return { chineseLabel: value, englishLabel: key };
				});
			} catch (error) {
				console.error('Failed to fetch detection options', error);
				detectionOptions.value = [
					{ chineseLabel: '路面监控', englishLabel: 'road-detection' },
					{ chineseLabel: '音频分类', englishLabel: 'audio' },
					{ chineseLabel: '惯性轨迹感知', englishLabel: 'imu' },
					{ chineseLabel: '工业视觉纠偏', englishLabel: 'edge-eye' },
				];
			}
		});

		const handleChange = () => {
			successMessage.value = '';
		};

		const handleSubmit = async () => {
			loading.value = true;
			try {
				const index = selectedDetectionIndex.value;
				if (index !== null && index >= 0 && index < detectionOptions.value.length) {
					const englishLabel = detectionOptions.value[index].englishLabel || '';
					const response = await axios.post('/api/start', { service_name: englishLabel });
					const data = response.data;
					successMessage.value = data['msg'];
					console.log(successMessage.value);
					ElMessage({
						message: '提交成功',
						showClose: true,
						type: 'success',
						duration: 3000,
					});
					loading.value = false;
				} else {
					console.error('Invalid selected index.');
				}
			} catch (error) {
				loading.value = false;
				console.error('Submission failed', error);
				ElMessage.error('上传失败');
			}
		};

		return {
			selectedDetectionIndex,
			successMessage,
			loading,
			detectionOptions,
			handleChange,
			handleSubmit,
		};
	},
};
</script>
  
<style scoped>
.form-header {
	font-size: 20px;
	font-weight: bold;
	margin-bottom: 20px;
}
</style>
