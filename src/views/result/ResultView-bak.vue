<template>
	<div>
		<h2>任务执行结果</h2>
		<table class="table">
			<thead>
				<tr>
					<th>Source</th>
					<th>Task</th>
					<th>Task Type</th>
					<th>Service Name</th>
					<th>Execute Address</th>
					<th>Transmit Time</th>
					<th>Service Time</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="task in tasks" :key="task.task + '-' + task.source">
					<td>{{ task.source }}</td>
					<td>{{ task.task }}</td>
					<td>{{ task.task_type }}</td>
					<td>
						<ul class="stage-list">
							<li v-for="(stage, index) in task.pipeline" :key="stage.service_name">Stage {{ index + 1 }}: {{ stage.service_name }}</li>
						</ul>
					</td>
					<td>
						<ul class="stage-list">
							<li v-for="(stage, index) in task.pipeline" :key="stage.execute_address">Stage {{ index + 1 }}: {{ stage.execute_address }}</li>
						</ul>
					</td>
					<td>
						<ul class="stage-list">
							<li v-for="(stage, index) in task.pipeline" :key="stage.execute_data.transmit_time">
								Stage {{ index + 1 }}: {{ stage.execute_data.transmit_time }}
							</li>
						</ul>
						<strong>Total: {{ calculateTransmitTime(task.pipeline) }}</strong>
					</td>
					<td>
						<ul class="stage-list">
							<li v-for="(stage, index) in task.pipeline" :key="stage.execute_data.service_time">
								Stage {{ index + 1 }}: {{ stage.execute_data.service_time }}
							</li>
						</ul>
						<strong>Total: {{ calculateServiceTime(task.pipeline) }}</strong>
					</td>
				</tr>
			</tbody>
		</table>

		<h2>任务优先级</h2>
		<table class="table">
			<thead>
				<tr>
					<th>Source</th>
					<th>Task</th>
					<th>Task Type</th>
					<th>Importance</th>
					<th>Urgency</th>
					<th>Priority</th>
					<th>Start Time</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="task in tasks" :key="task.task + task.source">
					<td>{{ task.source }}</td>
					<td>{{ task.task }}</td>
					<td>{{ task.task_type }}</td>
					<td>
						<ul class="stage-list">
							<li v-for="(priority, index) in task.priority" :key="priority.importance">Stage {{ index + 1 }}: {{ priority.importance }}</li>
						</ul>
					</td>
					<td>
						<ul class="stage-list">
							<li v-for="(priority, index) in task.priority" :key="priority.urgency">Stage {{ index + 1 }}: {{ priority.urgency }}</li>
						</ul>
					</td>
					<td>
						<ul class="stage-list">
							<li v-for="(priority, index) in task.priority" :key="priority.priority">Stage {{ index + 1 }}: {{ priority.priority }}</li>
						</ul>
					</td>
					<td>
						<ul class="stage-list">
							<li v-for="(priority, index) in task.priority" :key="priority.start_time">Stage {{ index + 1 }}: {{ priority.start_time }}</li>
						</ul>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tasks: [],
			timeTicket: 0,
			size: 10,
		};
	},
	created() {
		this.fetchTimeTicket();
		// this.fetchData();
		setInterval(this.fetchData, 1000);
	},
	methods: {
		fetchTimeTicket() {
			fetch('/api/time_ticket', {
				method: 'GET',
			})
				.then((response) => response.json())
				.then((data) => {
					// append new data to this.tasks, if length of this.tasks is greater than 10, only keep the last 10 elements
					// console.log(data.result);
					this.timeTicket = data.time_ticket;
					console.log(this.timeTicket);
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
			console.log(JSON.stringify(json));
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
					// console.log(data.result);
					this.tasks = this.tasks.concat(data.result).slice(-10);
					this.timeTicket = data.time_ticket;
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
			return serviceTime;
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
