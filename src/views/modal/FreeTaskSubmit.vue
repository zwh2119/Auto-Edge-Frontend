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
            <div class="input-container">
                <label for="free-task-duration">任务持续时间(s): </label>
                <input v-if="localFreeTaskState === 0" type="text" v-model="localFreeTaskDuration" :disabled="disabled"
                    placeholder="请输入任务持续时间" />
                <input v-else-if="localFreeTaskState === 1 || localFreeTaskState === 2" type="text" :disabled="disabled"
                    :value="localFreeTaskDuration" disabled />
            </div>
            <br><br><br>
            <div class="button-container">
                <button v-if="localFreeTaskState === 0" @click="submitFreeTask" class="submit-button"
                    :disabled="disabled">提交</button>
                <button v-else-if="localFreeTaskState === 1 || localFreeTaskState === 2" @click="cancelFreeTask"
                    :disabled="disabled && localFreeTaskState === 1" class="cancel-button">取消</button>
            </div>
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
            localFreeTaskDuration: 0
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
                // stop the interval
                clearInterval(interval);
            }
        }, 500);
    },

    methods: {
        submitFreeTask() {
            console.log('submit free task');

            // TODO：校验输入的任务持续时间是否合法，必须是数字，不能小于0秒，不能大于60秒，否则弹出框
            if (this.localFreeTaskDuration === '' || isNaN(this.localFreeTaskDuration) || this.localFreeTaskDuration > 60 || this.localFreeTaskDuration < 0) {
                alert('请输入合法的任务持续时间(0-60s)');
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
                    source_label: this.selectedDataSource
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
    max-width: 300px;
    margin-bottom: 20px;
    font-family: Arial, sans-serif;
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