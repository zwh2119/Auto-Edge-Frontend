<template>
	<div>
		<el-card shadow="hover" style="margin: 20px">
			<h2>任务执行结果</h2>
			<!-- <table class="table" style="height: 600px"> -->
			<table class="table">
				<thead>
					<tr>
						<th>数据源</th>
						<th>任务包</th>
						<th>任务类型</th>
						<th>应用服务</th>
						<th>处理设备</th>
						<!-- <th>Transmit Time</th> -->
						<!-- <th>处理结果</th> -->
						<th>处理时延</th>
						<th>总时延</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="task in tasks" :key="task.task + '-' + task.source">
						<td>{{ task.source }}</td>
						<td>{{ task.task }}</td>
						<td>{{ task.task_type }}</td>
						<td>
							<ul class="stage-list">
								<li v-for="(stage, index) in task.pipeline" :key="stage.service_name">阶段 {{ index + 1 }}: {{ stage.service_name }}</li>
							</ul>
						</td>
						<td>
							<ul class="stage-list">
								<li v-for="(stage, index) in task.pipeline" :key="stage.execute_address">阶段 {{ index + 1 }}: {{ stage.execute_address }}</li>
							</ul>
						</td>
						<!-- <td>{{ task.obj_num }}</td> -->
						<!-- <td>
            <ul class="stage-list">
              <li v-for="(stage, index) in task.pipeline" :key="stage.execute_data.transmit_time">
                Stage {{ index + 1 }}: {{ stage.execute_data.transmit_time }}
              </li>
            </ul>
            <strong>Total: {{ calculateTransmitTime(task.pipeline) }}</strong>
          </td> -->
						<td>
							<ul class="stage-list">
								<li v-for="(stage, index) in task.pipeline" :key="stage.execute_data.service_time">
									阶段 {{ index + 1 }}: {{ parseFloat(stage.execute_data.service_time).toFixed(2) }}
								</li>
							</ul>
							<!-- <strong>Total: {{ calculateServiceTime(task.pipeline) }}</strong> -->
						</td>
						<td>
							<strong>{{ calculateServiceTime(task.pipeline) }}</strong>
						</td>
					</tr>
				</tbody>
			</table>
			<br />
			<br />
			<br />
			<br />
			<h2>任务优先级</h2>
			<table class="table" style="height: 600px">
				<!-- <table class="table"> -->
				<thead>
					<tr>
						<th>数据源</th>
						<th>任务包</th>
						<th>任务类型</th>
						<th>重要程度(0-10)</th>
						<th>紧急程度(0-10)</th>
						<th>优先级(0-10)</th>
						<!-- <th>Start Time</th> -->
					</tr>
				</thead>
				<tbody>
					<tr v-for="task in tasks" :key="task.task + '-' + task.source">
						<td>{{ task.source }}</td>
						<td>{{ task.task }}</td>
						<td>{{ task.task_type }}</td>
						<td>
							<ul class="stage-list">
								<li v-for="(priority, index) in task.priority" :key="priority.importance">
									阶段 {{ index + 1 }}: <strong>{{ priority.importance }}</strong>
								</li>
							</ul>
						</td>
						<td>
							<ul class="stage-list">
								<li v-for="(priority, index) in task.priority" :key="priority.urgency">
									阶段 {{ index + 1 }}: <strong>{{ priority.urgency }}</strong>
								</li>
							</ul>
						</td>
						<td>
							<ul class="stage-list">
								<li v-for="(priority, index) in task.priority" :key="priority.priority">
									阶段 {{ index + 1 }}: <strong>{{ priority.priority }}</strong>
								</li>
							</ul>
						</td>
						<!-- <td>
            <ul class="stage-list">
              <li v-for="(priority, index) in task.priority" :key="priority.start_time">
                Stage {{ index + 1 }}: {{ priority.start_time }}
              </li>
            </ul>
          </td> -->
					</tr>
				</tbody>
			</table>
			<br />
			<br />
			<br />
			<br />
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tasks: [],
			timeTicket: 0,
			size: 10,
			addressToDeviceDict: {},
		};
	},
	created() {
		this.fetchTimeTicket();
		// this.fetchData();
		this.timer = setInterval(this.fetchData, 1000);
	},
	beforeUnmount() {
		clearInterval(this.timer);
	},
	methods: {
		fetchAddressToDeviceDict() {
			fetch('/api/device')
				.then((response) => response.json())
				.then((data) => {
					this.addressToDeviceDict = data;
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		},

		fetchTimeTicket() {
			fetch('/api/time_ticket')
				.then((response) => response.json())
				.then((data) => {
					this.timeTicket = data.time_ticket;
					this.fetchAddressToDeviceDict();
					this.fetchData();
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		},
		fetchData() {
			const json = {
				time_ticket: this.timeTicket,
				size: this.size,
			};
			// Make an API request to fetch data
			// Replace the API_URL with your actual API endpoint
			fetch('/api/result', {
				method: 'POST',
				body: JSON.stringify(json),
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((data) => {
					// append new data to this.tasks, if length of this.tasks is greater than 10, only keep the last 10 elements
					this.tasks = this.tasks.concat(data.result).slice(-10);
					this.timeTicket = data.time_ticket;
					this.filterTasks(this.tasks);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		},
		calculateTransmitTime(pipeline) {
			let transmitTime = 0;
			for (let stage of pipeline) {
				if (stage.execute_data && stage.execute_data.transmit_time) {
					transmitTime += stage.execute_data.transmit_time;
					transmitTime = parseFloat(transmitTime).toFixed(2);
				}
			}
			return transmitTime;
		},
		calculateServiceTime(pipeline) {
			let serviceTime = 0;
			for (let stage of pipeline) {
				if (stage.execute_data && stage.execute_data.service_time) {
					serviceTime += stage.execute_data.service_time;
				}
			}
			serviceTime = parseFloat(serviceTime).toFixed(2);
			return serviceTime;
		},
		filterTasks(tasks) {
			for (let task of tasks) {
				for (let stage of task.pipeline) {
					if (stage.execute_address in this.addressToDeviceDict) {
						stage.execute_address = this.addressToDeviceDict[stage.execute_address];
					}
					// if task.pipeline.stage is end, remove this stage
					if (stage.service_name === 'end') {
						task.pipeline.pop(stage);
					}
				}
			}
		},
	},
};
</script>

<style scoped>
.table {
	border-collapse: collapse;
	width: 100%;
}

.table th,
.table td {
	border: 1px solid #ddd;
	padding: 8px;
	text-align: left;
}

.table th {
	background-color: #f2f2f2;
}

.stage-list {
	list-style-type: none;
	padding: 0;
	margin: 0;
}

.stage-list li {
	margin-bottom: 4px;
	font-size: 14px;
	color: #333;
}

h2 {
	margin-top: 20px;
	margin-bottom: 10px;
	font-size: 18px;
	color: #333;
}

strong {
	font-weight: bold;
}
</style>
