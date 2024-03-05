<template>
    <div class="pipeline">
        <div v-for="(stage, index) in pipelineLength" :key="index" class="stage" :style="{ width: stageWidth }">
            <div class="background">
                <span class="stage-index">Stage {{ index + 1 }}</span> <!-- 添加阶段文字 -->
            </div>
            <!-- <div class="arrow">=></div> -->
            <div class="task-container" :class="{ 'animate': currentTask && currentTask.stageIndex === index }">
                <div v-if="currentTask && currentTask.stageIndex === index" class="task">
                    <div class="taskId">task {{ currentTask.taskId }}</div>
                    <div class="priority">
                        Urgency: {{ currentTask.priorityTrace[index].urgency }}
                        <br>
                        Importance: {{ currentTask.priorityTrace[index].importance }}
                        <br>
                        Priority: {{ currentTask.priorityTrace[index].priority }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        data: {
            type: Object,
        }
    },
    watch: {
        data: {
            handler: function (newVal, oldVal) {

                this.loadData();
                clearInterval(this.animationInterval);
                this.currentTaskIndex = 0;
                this.startAnimation();
            },
            deep: true
        }
    },
    data() {
        return {
            // isAnimationFinished: true,
            pipelineLength: null,
            taskList: null,

            // taskList: [
            //   {
            //     taskId: 1,
            //     priorityTrace: [
            //       { urgency: 1, importance: 1, priority: 1 },
            //       { urgency: 2, importance: 2, priority: 2 },
            //       { urgency: 3, importance: 3, priority: 3 },
            //       { urgency: 1, importance: 1, priority: 1 }
            //     ]
            //   },
            //   {
            //     taskId: 2,
            //     priorityTrace: [
            //       { urgency: 5, importance: 5, priority: 5 },
            //       { urgency: 4, importance: 4, priority: 4 },
            //       { urgency: 3, importance: 3, priority: 3 },
            //       { urgency: 1, importance: 1, priority: 1 }
            //     ]
            //   },
            //   {
            //     taskId: 3,
            //     priorityTrace: [
            //       { urgency: 9, importance: 9, priority: 9 },
            //       { urgency: 8, importance: 8, priority: 8 },
            //       { urgency: 7, importance: 7, priority: 7 },
            //       { urgency: 1, importance: 1, priority: 1 }
            //     ]
            //   }
            // ],

            // taskList: [
            //     {
            //         taskId: 1,
            //         priorityTrace: [
            //             { urgency: 1, importance: 1, priority: 1 },
            //             { urgency: 2, importance: 2, priority: 2 },
            //             { urgency: 3, importance: 3, priority: 3 }
            //         ]
            //     },
            //     {
            //         taskId: 2,
            //         priorityTrace: [
            //             { urgency: 5, importance: 5, priority: 5 },
            //             { urgency: 4, importance: 4, priority: 4 },
            //             { urgency: 3, importance: 3, priority: 3 }
            //         ]
            //     },
            //     {
            //         taskId: 3,
            //         priorityTrace: [
            //             { urgency: 9, importance: 9, priority: 9 },
            //             { urgency: 8, importance: 8, priority: 8 },
            //             { urgency: 7, importance: 7, priority: 7 }
            //         ]
            //     }
            // ],


            // taskList: [
            //   {
            //     taskId: 1,
            //     priorityTrace: [
            //       { urgency: 1, importance: 1, priority: 1 },
            //       { urgency: 2, importance: 2, priority: 2 },

            //     ]
            //   },
            //   {
            //     taskId: 2,
            //     priorityTrace: [
            //       { urgency: 5, importance: 5, priority: 5 },
            //       { urgency: 4, importance: 4, priority: 4 },

            //     ]
            //   },
            //   {
            //     taskId: 3,
            //     priorityTrace: [
            //       { urgency: 9, importance: 9, priority: 9 },
            //       { urgency: 8, importance: 8, priority: 8 },

            //     ]
            //   }
            // ],
            currentTaskIndex: 0,
            currentTask: null,
            animationInterval: null
        };
    },
    computed: {
        stageWidth() {
            if(this.pipelineLength  <= 2){
                return `${100 / 3}%`;
            }
            return `${100 / this.pipelineLength}%`;
        }
    },
    // mounted() {
    //     while(this.data === null) {
    //         // try load data every 1 second
    //         setTimeout(() => {
    //             console.log('try loading data');
    //             this.loadData();
    //         }, 1000);
    //     }
    //     console.log(this.data);
    //     this.startAnimation();
    // },
    methods: {
        loadData() {
            console.log('load data');
            console.log(this.data);
            if (!this.data) {
                return;
            }
            // TODO: 拿到空的数组不更新，还渲染上一轮缓存中的数据
            if(this.data == null || this.data.taskList === null || this.data.taskList === undefined || this.data.taskList == []) {
                return;
            }
            this.taskList = this.data.taskList;
            this.pipelineLength = this.data.pipelineLength;
            console.log('load data success');
            console.log(this.taskList);
        },

           
        startAnimation() {
            console.log('start animation');
            console.log(this.data);
            if(this.taskList === null || this.taskList.length === 0) {
                return;
            }
            // console.log(this.data);
            // this.isAnimationFinished = false;
            this.animationInterval = setInterval(() => {
                if (this.currentTask && this.currentTask.stageIndex < this.pipelineLength - 1) {
                    this.currentTask.stageIndex++;
                    console.log("case 1");
                } else {
                    if (this.currentTaskIndex < this.taskList.length) {
                        this.currentTask = {
                            ...this.taskList[this.currentTaskIndex],
                            stageIndex: 0
                        };
                        this.currentTaskIndex++;
                        console.log("case 2");
                    } else {
                        // this.isAnimationFinished = true;
                        clearInterval(this.animationInterval);
                        this.loadData();
                        this.currentTaskIndex = 0; // Reset task index for next animation
                        this.startAnimation(); // Restart animation
                        console.log("case 3");
                    }
                }
            }, 800); // Adjust interval as needed
        }
    }
};
</script>
  
<style scoped>
.pipeline {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 400px;
    /* 固定高度 */
}

.stage {
    display: flex;
    align-items: center;
    position: relative;
}

.background {
    position: absolute;
    top: 50%;

    transform: translate(0, -50%);
    width: 80%;
    height: 300px;
    border: 2px solid #ccc;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    background-color: #f0f0f0;
    /* 添加背景色 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* 添加阴影效果 */
    transition: background-color 0.3s ease;
    /* 添加背景色过渡动画 */
}

.background:hover {
    background-color: #e0e0e0;
    /* 鼠标悬停时背景色变化 */
}


.task-container {
    /* display: flex;    */
    position: relative;
    /* top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); */
    /* transform: translateX(15%); */
    /* align-items: center; */
    width: 80%;
    padding: 15px;
}

.task {
    padding: 15px;
    border: 2px solid #007bff;
    border-radius: 10px;
    background-color: #f0f0f0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    font-size: 30px;
    /* 扩大字体大小 */
}

.taskId {
    font-weight: bold;
    color: #007bff;
}

.priority {
    margin-top: 10px;
    /* 增加上边距 */
    font-size: 24px;
    /* 调整字体大小 */
    line-height: 1.4;
    /* 增加行高，提高可读性 */


}

.priority span {
    display: block;
    /* 设置为块级元素 */
    margin-bottom: 5px;
    /* 增加下边距 */
}

.priority span strong {
    font-weight: bold;
    /* 加粗字段名称 */
    margin-right: 5px;
    /* 添加右边距 */
}

.priority span em {
    font-style: italic;
    /* 使用斜体 */
    color: #555;
    /* 调整颜色 */
}


/* 添加动画效果 */
.animate {
    transition: transform 0.5s ease-in-out;
}</style>
  