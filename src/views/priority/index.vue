<template>
    <div class="home-container layout-pd">
        <el-row :gutter="15" class="home-card-two mb15 toggleSource">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <div class="home-card-item">
                    <div style="height: 100%">
                        <div class="flex-margin flex w100">
                            <div class="flex-auto">
                                选择数据源: &nbsp; &nbsp; &nbsp;
                                <el-select v-model="selectedDataSource" placeholder="请选择...">
                                    <el-option v-for="item in dataSourceList" :key="item.id" :label="item.label"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="15" class="home-card-two mb15 pri-graph">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <div class="home-card-item">
                    <div style="height: 100%">
                        <div class="flex-margin flex w100">
                            <div class="flex-auto">
                                <PriorityAnimation :data="priorityData" />
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import PriorityAnimation from './PriorityAnimation.vue'
export default {
    components: {
        PriorityAnimation
    },
    mounted() {
        this.getDataSourceList();
        this.getPipelineInfo();
        setInterval(this.getLatestPriorityData, 5000);
        // this.priorityData.pipelineLength = this.pipelineLength;
        // this.generateFakeDataForAllSources();
        // setInterval(this.generateFakeDataForAllSources, 5000);
    },
    data() {
        return {
            selectedDataSource: '',
            dataSourceList: [
                {
                    id: '1',
                    label: '数据源1'
                },
                {
                    id: '2',
                    label: '数据源2'
                }
            ],
            rawPipelineLength: 0,
            pipelineName : null,
            priorityData: {
                pipelineLength: null,
                taskList: []
            },
            // priorityData: {
            //     pipelineLength: 4,
            //     taskList: [
            //         {
            //             taskId: 1,
            //             priorityTrace: [
            //                 { urgency: 1, importance: 1, priority: 1 },
            //                 { urgency: 2, importance: 2, priority: 2 },
            //                 { urgency: 3, importance: 3, priority: 3 },
            //                 { urgency: 1, importance: 1, priority: 1 }
            //             ]
            //         },
            //         {
            //             taskId: 2,
            //             priorityTrace: [
            //                 { urgency: 5, importance: 5, priority: 5 },
            //                 { urgency: 4, importance: 4, priority: 4 },
            //                 { urgency: 3, importance: 3, priority: 3 },
            //                 { urgency: 1, importance: 1, priority: 1 }
            //             ]
            //         },
            //         {
            //             taskId: 3,
            //             priorityTrace: [
            //                 { urgency: 3, importance: 3, priority: 3 },
            //                 { urgency: 2, importance: 2, priority: 2 },
            //                 { urgency: 1, importance: 1, priority: 1 },
            //                 { urgency: 1, importance: 1, priority: 1 }
            //             ]
            //         }
            //     ]
            // }

            bufferedTaskCache: {
                // '1': [],
                // '2': []
             },
            maxBufferedTaskCacheSize: 10,
            fakeDataIndex: {
                '1': 0,
                '2': 0
            
            }
        }
    },
    methods: {
        generateFakeDataForAllSources(){
            this.dataSourceList.forEach((item) => {
                this.generateRandomPriorityData(item.id);
            });
        },
        generateRandomPriorityData(sourceId) {
            if (!sourceId) {
                return;
            }
            const taskList = [];
            const taskNum = Math.floor(Math.random() * 10) + 1; // 随机生成任务数
            const priorityTraceLength = this.rawPipelineLength;

            for (let i = 0; i < taskNum; i++) {
                const priorityTrace = [];
                for (let j = 0; j < priorityTraceLength; j++) {
                    priorityTrace.push({
                        urgency: Math.floor(Math.random() * 10) + 1,
                        importance: Math.floor(Math.random() * 10) + 1,
                        priority: Math.floor(Math.random() * 10) + 1
                    });
                }
                taskList.push({
                    taskId: this.fakeDataIndex[sourceId]++,
                    priorityTrace: priorityTrace
                });
            }
            this.bufferedTaskCache[sourceId] = taskList;
            if(this.selectedDataSource && this.selectedDataSource === sourceId){
                this.priorityData = {
                    pipelineLength: this.rawPipelineLength,
                    taskList: taskList
                };
                console.log('priorityData', this.priorityData);
            }

        },

        // =========================== 与后端对接
        // 1. 获取数据源，仅初始化时获取一次
                    // 后端返回json格式
            // return [
            //     {
            //         id: '1',
            //         label: '数据源1'
            //     },
            //     {
            //         id: '2',
            //         label: '数据源2'
            //     }
            // ];
        getDataSourceList() { 
            fetch('/api/source_list')
                .then(response => response.json())
                .then(data => {
                    this.dataSourceList = data;
                });
        },


            // 2. 获取流水线信息
            // "/pipeline_info"
            // 后端返回json格式
            // return ["stage1", "stage2"]
            
        getPipelineInfo() { 
            fetch('/api/pipeline_info')
                .then(response => response.json())
                .then(data => {
                    console.log('获取到流水线信息', data);
                    this.rawPipelineLength = data.length;
                    this.pipelineName = data;
                    this.priorityData.pipelineLength = this.rawPipelineLength;
                    // console.log('pipelineLength', this.pipelineLength);
                    // console.log('pipelineName', this.pipelineName);
                    
                });
        },


            // 3. 获取所有数据源的最新数据
             // /queue_result
            // 后端返回json格式
            // return {
            //     'datasource1': [
            //         {
            //             taskId: 1,
            //             priorityTrace: [
            //                 { urgency: 1, importance: 1, priority: 1 },
            //                 { urgency: 2, importance: 2, priority: 2 },
            //                 { urgency: 3, importance: 3, priority: 3 },
            //                 { urgency: 1, importance: 1, priority: 1 }
            //             ]
            //         },
            //         {
            //             taskId: 2,
            //             priorityTrace: [
            //                 { urgency: 5, importance: 5, priority: 5 },
            //                 { urgency: 4, importance: 4, priority: 4 },
            //                 { urgency: 3, importance: 3, priority: 3 },
            //                 { urgency: 1, importance: 1, priority: 1 }
            //             ]
            //         }],
            //     'datasource2': [
            //         {
            //             taskId: 1,
            //             priorityTrace: [
            //                 { urgency: 1, importance: 1, priority: 1 },
            //                 { urgency: 2, importance: 2, priority: 2 },
            //                 { urgency: 3, importance: 3, priority: 3 },
            //                 { urgency: 1, importance: 1, priority: 1 }
            //             ]
            //         },
            //         {
            //             taskId: 2,
            //             priorityTrace: [
            //                 { urgency: 5, importance: 5, priority: 5 },
            //                 { urgency: 4, importance: 4, priority: 4 },
            //                 { urgency: 3, importance: 3, priority: 3 },
            //                 { urgency: 1, importance: 1, priority: 1 }
            //             ]
            //         }
            //     ]
            // }

        getLatestPriorityData() { 
            fetch('/api/queue_result')
                .then(response => response.json())
                .then(data => {
                    this.bufferedTaskCache = data;
                    console.log('获取到最新优先级数据', data);
                    console.log('bufferedTaskCache', this.bufferedTaskCache);
                });
        },
       
    },
    watch: {
        selectedDataSource: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                console.log('数据源改变了');
                this.priorityData = {
                    pipelineLength: this.rawPipelineLength,
                    taskList: this.bufferedTaskCache[newVal]
                    
                };
                console.log('priorityData', this.priorityData);
                
            }
        },
        bufferedTaskCache: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                console.log('数据改变了');
                this.priorityData = {
                    pipelineLength: this.rawPipelineLength,
                    taskList: this.bufferedTaskCache[this.selectedDataSource]
                };
                console.log('priorityData', this.priorityData);
            }
        }
    },
    // computed: {
    //     filteredPriorityData() {
    //         if (!this.priorityData) {
    //             return null;
    //         }
    //         return this.priorityData.map((item) => {
    //             return {
    //                 // TODO: 过滤数据
                    

    //             }
    //         });
    //     },
    // }
}
</script>


<style scoped lang="scss">
$homeNavLengh: 8;


.home-container {
    overflow: hidden;

    .home-card-one,
    .home-card-two,
    .home-card-three {
        .home-card-item {
            width: 100%;
            height: 130px;
            border-radius: 4px;
            transition: all ease 0.3s;
            padding: 20px;
            overflow: hidden;
            background: var(--el-color-white);
            color: var(--el-text-color-primary);
            border: 1px solid var(--next-border-color-light);

            &:hover {
                box-shadow: 0 2px 12px var(--next-color-dark-hover);
                transition: all ease 0.3s;
            }

            &-icon {
                width: 70px;
                height: 70px;
                border-radius: 100%;
                flex-shrink: 1;

                i {
                    color: var(--el-text-color-placeholder);
                }
            }

            &-title {
                font-size: 15px;
                font-weight: bold;
                height: 30px;
            }
        }
    }

    .home-card-one {
        @for $i from 0 through 3 {
            .home-one-animation#{$i} {
                opacity: 0;
                animation-name: error-num;
                animation-duration: 0.5s;
                animation-fill-mode: forwards;
                animation-delay: calc($i/4) + s;
            }
        }
    }

    .home-card-two,
    .home-card-three {
        .home-card-item {
            height: 50vh;
            width: 100%;
            overflow: scroll;

            .home-monitor {
                height: 100%;

                .flex-warp-item {
                    width: 25%;
                    height: 111px;
                    display: flex;

                    .flex-warp-item-box {
                        margin: auto;
                        text-align: center;
                        color: var(--el-text-color-primary);
                        display: flex;
                        border-radius: 5px;
                        background: var(--next-bg-color);
                        cursor: pointer;
                        transition: all 0.3s ease;

                        &:hover {
                            background: var(--el-color-primary-light-9);
                            transition: all 0.3s ease;
                        }
                    }

                    @for $i from 0 through $homeNavLengh {
                        .home-animation#{$i} {
                            opacity: 0;
                            animation-name: error-num;
                            animation-duration: 0.5s;
                            animation-fill-mode: forwards;
                            animation-delay: calc($i/10) + s;
                        }
                    }
                }
            }
        }
    }

    .pri-graph {
        .home-card-item {
            height: 60vh;
            width: 100%;
            overflow: scroll;
        }
    }

    .toggleSource {
        .home-card-item {
            height: 12vh;
            width: 100%;
            overflow: scroll;
        }
    }
}
</style>


