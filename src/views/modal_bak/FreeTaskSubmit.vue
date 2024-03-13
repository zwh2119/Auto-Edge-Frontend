<template>
    <div class="free-task-container">
        <h3 class="title">自由任务提交窗口</h3>
        <br>
        <div>
            <div v-if="localFreeTaskState === 0">
                <p>当前无自由任务...</p>
            </div>
            <div v-else-if="localFreeTaskState === 1">
                <p>当前有自由任务正在执行...</p>
            </div>
            <div v-else-if="localFreeTaskState === 2">
                <p>当前自由任务已完成!</p>
            </div>
            <br>
            <div class="input-container" style="font-size: large;">
                <label for="free-task-duration">任务持续时间(s): </label>
                <input v-if="localFreeTaskState === 0" type="text" v-model="localFreeTaskDuration" :disabled="disabled" :style="{ 'width': '90px', 'height': '30px'  }"
                    placeholder="请输入任务持续时间" />
                <input v-else-if="localFreeTaskState === 1 || localFreeTaskState === 2" type="text" :disabled="disabled" :style="{ 'width': '90px', 'height': '30px'  }"
                    :value="localFreeTaskDuration" disabled />
            </div>
            <!-- 下拉框从freeTaskMenu中选择自由任务类型 -->
            <div class="input-container" style="font-size: large;">
                <label for="free-task-type">自由任务类型: </label>
                <select v-if="localFreeTaskState === 0" v-model="localFreeTaskType" :disabled="disabled" :style="{ 'width': '130px', 'height': '30px' }">
                    <option v-for="item in freeTaskMenu" :key="item" :value="item">{{ item }}</option>
                </select>
                <select v-else-if="localFreeTaskState === 1 || localFreeTaskState === 2" :disabled="disabled" :style="{ 'width': '130px', 'height': '30px' }" :value="localFreeTaskType" disabled>
                    <option v-for="item in freeTaskMenu" :key="item" :value="item">{{ item }}</option>
                </select>
            </div>
            
            <br><br><br><br><br>
            <div class="button-container"><div style="display: flex; justify-content: center; align-items: center;">
                <el-button type="primary" v-if="localFreeTaskState === 0" @click="submitFreeTask" class="submit-button"
                    :disabled="disabled">提交</el-button>
                <el-button type="primary" v-else-if="localFreeTaskState === 1 || localFreeTaskState === 2" @click="cancelFreeTask"
                    :disabled="disabled && localFreeTaskState === 1" class="cancel-button">取消</el-button>
            </div></div>
        </div>
    </div>
</template>

<script>


export default {
    props: {
        freeTaskState: {
            type: Number,
        },
        freeTaskDuration: {
            type: Number,
        },
        freeTaskType: {
            type: String,
        },
        freeTaskMenu: {
            type: Array,
        },
        selectedDataSource: {
            type: Object,
        },
        disabled: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            localFreeTaskState: 0,
            localFreeTaskDuration: 0,
            localFreeTaskType: '',
            // freeType: null
        };
    },

    watch: {
        freeTaskState: {
            handler: function (newVal, oldVal) {
                this.localFreeTaskState = newVal;
            },
            deep: true
        },
        selectedDataSource: {
            handler: function (newVal, oldVal) {
                var interval1 = setInterval(() => {
                    if (this.freeTaskDuration == 0) {
                        return;
                    }
                    else {
                        this.localFreeTaskDuration = this.freeTaskDuration;
                        this.localFreeTaskType = this.freeTaskType;
                        // stop the interval
                        clearInterval(interval1);
                    }
                }, 500);
            },
            deep: true
        },
        //   freeTaskDuration: {
        //     handler: function (newVal, oldVal) {
        //       this.localFreeTaskDuration = newVal;
        //     },
        //     deep: true
        //   }
    },
    mounted() {
        console.log("disabled state:");
        console.log(this.disabled);
        var interval = setInterval(() => {
            if (this.freeTaskDuration == 0) {
                return;
            }
            else {
                this.localFreeTaskDuration = this.freeTaskDuration;
                this.localFreeTaskType = this.freeTaskType;
                // stop the interval
                clearInterval(interval);
            }
        }, 500);
    },

    methods: {
        submitFreeTask() {
            console.log('submit free task');

            // TODO：校验输入的任务持续时间是否合法，必须是数字，不能小于10秒，不能大于60秒，否则弹出框
            if (this.localFreeTaskDuration === '' || isNaN(this.localFreeTaskDuration) || this.localFreeTaskDuration > 60 || this.localFreeTaskDuration < 10) {
                 // alert('请输入合法的任务持续时间(0-60s)');
                 // 用ElMessage组件
                this.$message({
                    message: '请输入合法的任务持续时间(10-60s)',
                    type: 'warning'
                });
                return;
            }



            // 在此添加提交任务的逻辑
            // TODO 后端url？

            fetch('/api/start_free_task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // make duration an integer
                    duration: parseInt(this.localFreeTaskDuration),
                    source_label: this.selectedDataSource,
                    free_type: this.localFreeTaskType
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            // emit event to parent component

            this.$emit('freeTaskState', 1);
            

        },
        cancelFreeTask() {
            console.log('cancel free task');
            // 在此添加取消任务的逻辑
            // TODO 后端url？

            // fetch('/stop_free_task' + selectedDataSource)
            // .then(response => response.json())
            // .then(data => {
            //   console.log('Success:', data);
            // })
            // .catch((error) => {
            //   console.error('Error:', error);
            // });

            // emit event to parent component

            this.$emit('freeTaskState', 0);
            // this.$emit('freeTaskDuration', null);
        }
    },
};
</script>

<style scoped>
.free-task-container {
    /* max-width: 300px; */
    margin-bottom: 20px;
    /* font-family: Arial, sans-serif; */
}

.title {
    font-size: 1.2rem;
    font-weight: bold;
}

.input-container {
    margin-bottom: 10px;
}

.input-container input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.button-container {
    text-align: center;
}

.button-container button {
    padding: 8px 15px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.submit-button {
    background-color: #4c5cd9;
    color: white;
}

.cancel-button {
    background-color: #e95858;
    color: white;
}

.submit-button:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
}
</style>