<template>
	<div>
		<el-card shadow="hover" style="margin: 20px">
			<div class="form-header">自由周期</div>

			<el-form label-position="left" label-width="120px">
				<el-form-item label="修改任务">
					<el-input v-model="serviceName"></el-input>
				</el-form-item>
				<el-form-item label="持续时间(s)">
					<el-input v-model="time" type="number"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="handleSubmit">提交</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
  
  <script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

import axios from 'axios';

export default {
	setup() {
		const serviceName = ref('');
		const time = ref('');

		const handleSubmit = async () => {
			try {
				const formData = {
					service_name: serviceName.value,
					time: time.value,
				};

				const response = await axios.post('/api/free', formData);
				console.log('Submission successful:', response.data.msg);
				console.log('Submission successful:', response.data);
				ElMessage({
					message: '提交成功',
					showClose: true,
					type: 'success',
					duration: 3000,
				});
			} catch (error) {
				console.error('Submission failed', error);
			}
		};

		return {
			serviceName,
			time,
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
  