<template>
	<div class="content">
		<div class="card-container">
			<el-card shadow="hover" class="card" style="flex: 1; display: flex; justify-content: center; height: 350px">
				<div id="delay" style="width: 500px; height: 300px; margin-top: 20px">111</div>
			</el-card>

			<el-card shadow="hover" class="card" style="flex: 1; display: flex; justify-content: center; height: 350px">
				<div id="objn" style="width: 500px; height: 300px; margin-top: 20px">222</div>
			</el-card>
		</div>
		<div class="card-container">
			<el-card shadow="hover" class="card" style="flex: 1; display: flex; justify-content: center; height: 350px">
				<div id="objsize" style="width: 500px; height: 300px; margin-top: 20px">333</div>
			</el-card>

			<!-- 资源情境 -->
			<el-card shadow="hover" class="card" style="flex: 1; display: flex; justify-content: center; height: 350px">
				<div id="objstable" style="width: 500px; height: 300px; margin-top: 20px">444</div>
			</el-card>
		</div>
	</div>
</template>
<script>
import * as echarts from 'echarts';
export default {
	data() {
		return {
			select_job: null,
			// select_content: null,
			delay_list: [],
			objn_list: [],
			objsize_list: [],
			objstable_list: [],
		};
	},
	methods: {
		// 根据指定内容绘图
		// showSelectedResult(itemKey) {
		showSelectedResult(itemKey) {
			// console.log(itemKey);
			// this.updateResultUrl();
			var chart = echarts.init(document.getElementById(itemKey));
			// console.log(chart);
			// var chart = echarts.init(document.getElementById('delay'));
			var xAsixName = 'n_loop';
			var xData = [];
			var yData = [];

			let list = [];
			if (itemKey === 'delay') {
				// const item = this.delay_list.find((obj) => Object.keys(obj)[0] === this.select_job);

				// 如果找到了对应的对象，则获取其对应的list
				// list = item ? Object.values(item)[0] : [];
				list = this.delay_list[this.select_job];
				for (var key in list) {
					xData.push(key);
					yData.push(list[key]);
				}

				console.log(list);
			} else if (itemKey === 'objn') {
				list = this.objn_list[this.select_job]
				for (var key in list) {
					xData.push(key);
					yData.push(list[key]);
				}
				console.log(list);
			} else if (itemKey === 'objsize') {
				list = this.objsize_list[this.select_job]
				for (var key in list) {
					xData.push(key);
					yData.push(list[key]);
				}
				console.log(list);
			} else if (itemKey === 'objstable') {
				list = this.objstable_list[this.select_job]
				for (var key in list) {
					xData.push(key);
					yData.push(list[key]);
				}
				console.log(list);
			}

			// 配置项
			const options = {
				xAxis: {
					type: 'category',
					data: xData, 
					name: '近期帧数',
				},
				yAxis: {
					type: 'value',
					name: '检测情况',
				},
				series: [
					{
						type: 'line',
						data: yData,
						label: {
							show: true,
							position: 'bottom',
							textStyle: {
								fontSize: 12,
							},
						},
					},
				],
				title: {
					show: true,
					text: this.mapTOChinese(itemKey),
				},
			};

			// 使用配置项绘制折线图
			chart.setOption(options);
		},
		mapTOChinese(itemKey) {
			if (itemKey === 'delay') {
				return '时延';
			} else if (itemKey === 'objn') {
				return '目标数量';
			} else if (itemKey === 'objsize') {
				return '目标大小';
			} else if (itemKey === 'objstable') {
				return '场景稳定性';
			} else return itemKey;
		},
	},
	mounted() {
		// this.select_job = 'GLOBAL_ID_1';
		const selectJob = sessionStorage.getItem("job_id");
        if (selectJob) {
            this.select_job = JSON.parse(selectJob);
            console.log(this.select_job);
        }
		// this.delay_list = [
		// 	{
		// 		GLOBAL_ID_1: [0.2, 0.3, 0.4, 0.6],
		// 	},
		// 	{
		// 		GLOBAL_ID_2: [0.2, 0.3, 0.4, 0.6],
		// 	},
		// ];
		// this.objn_list = [
		// 	{
		// 		GLOBAL_ID_1: [12, 13, 14, 15],
		// 	},
		// 	{
		// 		GLOBAL_ID_2: [12, 13, 14, 15],
		// 	},
		// ];
		// this.objsize_list = [
		// 	{
		// 		GLOBAL_ID_1: [112, 113, 114, 115],
		// 	},
		// 	{
		// 		GLOBAL_ID_2: [112, 113, 114, 115],
		// 	},
		// ];
		// this.objstable_list = [
		// 	{
		// 		GLOBAL_ID_1: [true, false, true, false],
		// 	},
		// 	{
		// 		GLOBAL_ID_2: [false, true, false, true],
		// 	},
		// ];
		const delayList = sessionStorage.getItem("delay_list");
        if (delayList) {
            this.delay_list = JSON.parse(delayList);
            console.log(this.delay_list);
        }
		const objnList = sessionStorage.getItem("objn_list");
        if (objnList) {
            this.objn_list = JSON.parse(objnList);
            console.log(this.objn_list);
        }
		const objsizeList = sessionStorage.getItem("objsize_list");
        if (objsizeList) {
            this.objsize_list = JSON.parse(objsizeList);
            console.log(this.objsize_list);
        }
		const objstableList = sessionStorage.getItem("objstable_list");
        if (objstableList) {
            this.objstable_list = JSON.parse(objstableList);
            console.log(this.objstable_list);
        }
		this.showSelectedResult('delay');
		this.showSelectedResult('objn');
		this.showSelectedResult('objsize');
		this.showSelectedResult('objstable');
	},
};
</script>
<style>
.content {
	margin-top: 20px;
}
.card-container {
	display: flex;
	margin-left: 20px;
	/* margin-right: 20px; */
}
.card {
	height: 600px;
	margin-right: 10px; /* 添加适当的间距 */
	margin-bottom: 10px;
}
</style>