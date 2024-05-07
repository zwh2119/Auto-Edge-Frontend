<template>
  <div class="task-management" style="display: flex; justify-content: center;">
    <div v-for="(stage, index) in queue_result" :key="index" class="stage" style="width: 480px;">
      <div class="stage-title">阶段 {{ index + 1 }}</div>
      <div class="priority-queues">
        <div v-for="(priorityQueue, pqIndex) in stage" :key="pqIndex" class="priority-queue" style="height: 90px;">
          <div class="queue-title">优先级队列 {{ pqIndex + 1 }}</div>
          <div v-if="priorityQueue.length > 0" class="tasks" style="display: flex;">
            <div v-for="(task, taskIndex) in priorityQueue.slice(0, 4)" :key="taskIndex" class="task"
              style="margin: 10px;">
              <!-- <p>Source ID: {{ task.source_id }}, Task ID: {{ task.task_id }}, Importance: {{ task.importance }}, Urgency: {{ task.urgency }}</p> -->
              <div style=" border: 1px solid #ccc; padding: 2px;">
                <p>数据源 ID: {{ task.source_id }}</p>
                <p>任务 ID: {{ task.task_id }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-tasks">
            <!-- <p>No tasks in this priority queue</p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    priority_num: {
      type: Number,
      required: true
    },
    stages: {
      type: Array,
      required: true
    },
    queue_result: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // fake_data: [
      //   [
      //     [
      //       { source_id: 1, task_id: 1, importance: 1, urgency: 1 },
      //       { source_id: 1, task_id: 2, importance: 2, urgency: 2 },
      //       { source_id: 1, task_id: 3, importance: 3, urgency: 3 },
      //     ],
      //     [
      //       { source_id: 2, task_id: 4, importance: 1, urgency: 2 },
      //       { source_id: 2, task_id: 5, importance: 2, urgency: 3 },
      //     ],
      //     [],
      //     [],
      //     []
      //   ],
      //   [
      //     [
      //       { source_id: 3, task_id: 6, importance: 1, urgency: 1 },
      //       { source_id: 3, task_id: 7, importance: 2, urgency: 2 },
      //     ],
      //     [],
      //     [],
      //     [],
      //     []
      //   ]
      // ]
    };
  }
};
</script>

<style scoped>
.task-management {
  display: flex;
}

.stage {
  margin-right: 20px;
  border: 1px solid #ccc;
  padding: 10px;
}

.stage-title {
  font-weight: bold;
  font-size: 20px;
}

.priority-queues {
  display: flex;
  flex-direction: column;
}

.priority-queue {
  margin-top: 10px;
  border: 1px solid #ccc;
  padding: 10px;
}

.queue-title {
  font-weight: bold;
  margin-bottom: -15px;
}

.tasks {
  margin-top: 10px;
}

.task {
  margin-top: 5px;
}

.no-tasks {
  margin-top: 5px;
  color: #888;
}
</style>