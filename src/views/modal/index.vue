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
        <el-row :gutter="15" class="home-card-two mb15">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <div class="home-card-item">
                    <div style="height: 100%">
                        <div class="flex-margin flex w100">
                            <div class="flex-auto">
                                <DataVisualize :data="filteredVisualizeData"/>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <div class="home-card-item">
                    <div style="height: 100%">
                        <div class="flex-margin flex w100">
                            <div class="flex-auto">
                                <ResultGraph :data="filteredResultData" :prompt="prompt"/>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <div class="home-card-item">
                    <div style="height: 100%">
                        <div class="flex-margin flex w100">
                            <div class="flex-auto">
                                <DelayGraph :data="filteredDelayData" />
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="15" class="home-card-two mb15 free-manage">
            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <div class="home-card-item">
                    <div style="height: 100%">
                        <div class="flex-margin flex w100">
                            <div class="flex-auto">
                                <FreeTaskSubmit :freeTaskState="freeTaskState" :freeTaskDuration="freeTaskDuration"
                                    :selectedDataSource="selectedDataSource" @freeTaskState="handleStateUpdate"
                                    @freeTaskDuration="handleDurationUpdate" :disabled="!selectedDataSource || !(this.freeTaskState === 0)"/>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <div class="home-card-item">
                    <div style="height: 100%">
                        <div class="flex-margin flex w100">
                            <div class="flex-auto">
                                <FreeTaskResult :freeTaskState="freeTaskState" :freeTaskResult="filteredFreeResultData" />
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <div class="home-card-item">
                    <div style="height: 100%">
                        <div class="flex-margin flex w100">
                            <div class="flex-auto">
                                <FreeTaskDelay :freeTaskState="freeTaskState" :freeTaskDelay="filteredFreeDelayData" />
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

// 除了FreeTaskSubmit，其他组件应该只负责渲染父组件传递的数据
// freexxxx 通过freeTaskState控制显示状态
// TODO1: 切换数据源时，应当重新向后端请求数据，更新freeTaskState


import { reactive } from 'vue'
import DataVisualize from './DataVisualize.vue'
import ResultGraph from './ResultGraph.vue'
import DelayGraph from './DelayGraph.vue'
import FreeTaskSubmit from './FreeTaskSubmit.vue'
import FreeTaskResult from './FreeTaskResult.vue'
import FreeTaskDelay from './FreeTaskDelay.vue'

export default {
    components: {
        DataVisualize,
        ResultGraph,
        DelayGraph,
        FreeTaskSubmit,
        FreeTaskResult,
        FreeTaskDelay
    },
    data() {
        return {
            // 子组件注入的数据
            visualizeData: null,
            resultData: null,
            delayData: null,

            // 数据源列表
            dataSourceList: null,
            // [
            //     {
            //         id: '1',
            //         label: '数据源1'
            //     }, {
            //         id: '2',
            //         label: '数据源2'
            //     }
            // ],

            // 选择的数据源
            selectedDataSource: null,

            prompt: null,

            // 自由任务状态，每次切换数据源时需要重新向后端请求
            // 0: 无自由任务（无其他字段） 1: 有自由任务（有duration字段） 2: 任务已完成（包含duration和执行结果）
            freeTaskState: 0,
            freeTaskDuration: 0,
            freeTaskResult: null,

            bufferedTaskCache: {},
            // {
                // 测试用fake数据
                // "1": [
                //             {
                //                 taskId: "1",
                //                 result: "8",
                //                 delay: "0.5"
                //             },
                //             {
                //                 taskId: "2",
                //                 result: "9",
                //                 delay: "0.6"
                //             },
                //             {
                //                 taskId: "3",
                //                 result: "10",
                //                 delay: "0.7"
                //             },
                //             {
                //                 taskId: "4",
                //                 result: "11",
                //                 delay: "0.8"
                //             },
                //             {
                //                 taskId: "5",
                //                 result: "12",
                //                 delay: "0.9"
                //             },
                //             {
                //                 taskId: "6",
                //                 result: "13",
                //                 delay: "1.0"
                //             },
                //             {
                //                 taskId: "7",
                //                 result: "14",
                //                 delay: "1.1"
                //             },
                //             {
                //                 taskId: "8",
                //                 result: "15",
                //                 delay: "1.2"
                //             },
                //             {
                //                 taskId: "9",
                //                 result: "16",
                //                 delay: "1.3"
                //             },
                //             {
                //                 taskId: "10",
                //                 result: "17",
                //                 delay: "1.4"
                //             }
                //         ],
                //     "2": [
                //             {
                //                 taskId: "1",
                //                 result: "8",
                //                 delay: "0.5"
                //             },
                //             {
                //                 taskId: "2",
                //                 result: "9",
                //                 delay: "0.6"
                //             },
                //             {
                //                 taskId: "3",
                //                 result: "10",
                //                 delay: "0.7"
                //             },
                //             {
                //                 taskId: "4",
                //                 result: "11",
                //                 delay: "0.8"
                //             },
                //             {
                //                 taskId: "5",
                //                 result: "12",
                //                 delay: "0.9"
                //             },
                //             {
                //                 taskId: "6",
                //                 result: "13",
                //                 delay: "1.0"
                //             },
                //             {
                //                 taskId: "7",
                //                 result: "14",
                //                 delay: "1.1"
                //             },
                //             {
                //                 taskId: "8",
                //                 result: "15",
                //                 delay: "1.2"
                //             },
                //             {
                //                 taskId: "9",
                //                 result: "16",
                //                 delay: "1.3"
                //             },
                //             {
                //                 taskId: "10",
                //                 result: "17",
                //                 delay: "1.4"
                //             }
                //         ]
            // },

            maxBufferedTaskCacheSize: 10,
        }
    },

    methods: {


        generateRandomJPG() {
            if (!this.selectedDataSource) {
                return;
            }
            // 创建一个 canvas 元素
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 设置 canvas 尺寸
            canvas.width = 320;
            canvas.height = 240;

            // 生成随机颜色
            const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

            // 绘制随机颜色的矩形
            ctx.fillStyle = randomColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 将 canvas 转换为 data URL
            const dataURL = canvas.toDataURL('image/jpeg');

            // 更新组件数据，渲染随机图像
            // this.visualizeData = dataURL;
            return dataURL;
        },

        generateRandomData(sourceId) {
            if (!sourceId) {
                return;
            }
            if (!this.bufferedTaskCache[sourceId] || this.bufferedTaskCache[sourceId].length === 0) {
                this.bufferedTaskCache[sourceId] = [];
                // generate first 1 task
                this.bufferedTaskCache[sourceId].push({
                    taskId: "1",
                    result: Math.floor(Math.random() * 100),
                    delay: Math.random().toFixed(2),
                    visualize: this.generateRandomJPG()
                });
            } else {
                // generate next task
                const nextTaskId = (parseInt(this.bufferedTaskCache[sourceId][this.bufferedTaskCache[sourceId].length - 1].taskId) + 2).toString();
                this.bufferedTaskCache[sourceId].push({
                    taskId: nextTaskId,
                    result: Math.floor(Math.random() * 100),
                    delay: Math.random().toFixed(2),
                    visualize: this.generateRandomJPG()
                });
                if (this.bufferedTaskCache[sourceId].length > this.maxBufferedTaskCacheSize) {
                    this.bufferedTaskCache[sourceId].shift();
                }
            }
        },
        generateFakeDataForAllSources() {
            this.dataSourceList.forEach((item) => {
                this.generateRandomData(item.id);
            });
        },

        // =========================== 与后端对接
        // 1. 获取数据源，仅初始化时获取一次
        getDataSourceList() {

            // for test
            // this.dataSourceList = [
            //     {
            //         id: 'datasource1',
            //         label: '数据源1'
            //     },
            //     {
            //         id: 'datasource2',
            //         label: '数据源2'
            //     }
            // ];
            // return;

            // "/source_list"
            // 后端返回json格式
            // return [
            //     {
            //         id: 'datasource1',
            //         label: '数据源1'
            //     },
            //     {
            //         id: 'datasource2',
            //         label: '数据源2'
            //     }
            // ];

            //  如果没有任务，返回空列表，表示现在没有开启的数据源

            fetch('/api/source_list')
                .then(response => response.json())
                .then(data => {
                    if (!data || data.length === 0) {
                        return;
                    }
                    this.dataSourceList = data;
                    console.log(data);
                    // initialize buffered cache
                    this.dataSourceList.forEach((item) => {
                        this.bufferedTaskCache[item.id] = [];
                    });
                });

        },


        // 2. 获取最新结果数据

        // "/task_result"
        // 后端返回json格式
        // return {
        //     'datasource1': [
        //         {
        //             taskId: "1",
        //             result: "8",
        //             delay: "0.5",
        //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
        //         },
        //         {
        //             taskId: "2",
        //             result: "9",
        //             delay: "0.6",
        //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
        //         }],
        //     'datasource2': [
        //         {
        //             taskId: "1",
        //             result: "8",
        //             delay: "0.5",
        //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
        //         },
        //         {
        //             taskId: "2",
        //             result: "9",
        //             delay: "0.6",
        //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
        //         }]
        // };

        //如果是空字典就停住（可能没有key）
        getLatestResultData() {

            // for test
            // this.bufferedTaskCache = {
            //     'datasource1': [
            //         {
            //             taskId: "1",
            //             result: "8",
            //             delay: "0.5",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         },
            //         {
            //             taskId: "2",
            //             result: "9",
            //             delay: "0.6",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         },
            //         {
            //             taskId: "3",
            //             result: "10",
            //             delay: "0.7",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         },
            //         {
            //             taskId: "4",
            //             result: "11",
            //             delay: "0.8",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         },
            //         {
            //             taskId: "5",
            //             result: "12",
            //             delay: "0.9",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         },
            //         {
            //             taskId: "6",
            //             result: "13",
            //             delay: "1.0",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         },
            //         {
            //             taskId: "7",
            //             result: "14",
            //             delay: "1.1",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         },
            //         {
            //             taskId: "8",
            //             result: "15",
            //             delay: "1.2",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         },
            //         {
            //             taskId: "9",
            //             result: "16",
            //             delay: "1.3",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         },
            //         {
            //             taskId: "10",
            //             result: "17",
            //             delay: "1.4",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         }
            //     ],
            //     'datasource2': [
            //         {
            //             taskId: "1",
            //             result: "8",
            //             delay: "0.5",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         },
            //         {
            //             taskId: "2",
            //             result: "9",
            //             delay: "0.6",
            //             visualize: "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAPsxpwBwiKNIuGxlOz0WhhpoWCMcALb/iyiLCTt8l10f//Z",
            //         }]
            // };
            
            // return;

            fetch('/api/task_result')
                .then(response => response.json())
                .then(data => {
                    console.log('getLatestResultData');
                    console.log(data);
                    
                    if (!data || Object.keys(data).length === 0) {
                        return;
                    }

                    for (const key in data) {
                        if (data[key].length === 0) {
                            continue;
                        }
                        for (const item of data[key]) {
                            if (!this.bufferedTaskCache[key] || this.bufferedTaskCache[key].length === 0) {
                                this.bufferedTaskCache[key] = [];
                            }
                            this.bufferedTaskCache[key].push(item);
                            if (this.bufferedTaskCache[key].length > this.maxBufferedTaskCacheSize) {
                                this.bufferedTaskCache[key].shift();
                            }
                        }
                    }
                });
        },


        // 3. 获取结果展示纵轴描述（开始时获取）
        // /result_prompt
        // 后端返回json格式
        // return {
        //     ‘prompt’: ‘执行结果’
        // }


        getResultPrompt() {
            // for test
            // this.prompt = '执行结果';
            // return;


            fetch('/api/result_prompt')
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        return;
                    }
                    console.log(data);
                    this.prompt = data.prompt;
                });
        },

        // 4. 获取自由任务状态
        // /free_state/{source}
        // 后端返回json格式
        // return {
        //     'state': 0/1,
        //     'duration': 100
        // }
        getFreeTaskState() {

            // for test
            // this.freeTaskState = 2;
            // this.freeTaskDuration = 100;
            // return;

            fetch('/api/free_state/' + this.selectedDataSource)
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        return;
                    }
                    this.freeTaskState = data.state;
                    if (this.freeTaskState === 1) {
                        this.freeTaskDuration = data.duration;
                    }
                    else if (this.freeTaskState === 2) {
                        this.freeTaskDuration = data.duration;
                        this.getFreeTaskResult();
                    }
                });
        },



        // 5. 停止执行自由任务
        // /stop_free_task/{source}

        stopFreeTask() {

            // for test
            // this.freeTaskState = 0;
            // this.freeTaskDuration = null;
            // return;

            fetch('/api/stop_free_task/' + this.selectedDataSource)
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        return;
                    }
                    console.log(data);
                    freeTaskState = 0;
                    freeTaskDuration = null;
                });
        },

        // 6. 获取自由任务结果
        // /free_task_result/{source}
        // 后端返回json格式
        // return {
        //    'state': 0/1, (是否有结果)
        //     'task_info':[
        //         {'name': "min", 'value': 20},
        //         {'name': "max", 'value': 30},
        //         {'name': "mean", 'value': 25},
        //         {'name': "std", 'value': 2},
        //         {'name': "median", 'value': 25},
        //         {'name': "percentile", 'value': 25}
        //     ],
        //     'delay':[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        //     'start_time': '2021-01-01 00:00:00',
        //     'end_time': '2021-01-01 00:00:10'
        // }

        // 点击开始任务 清空结果展示

        getFreeTaskResult() {
            // for test
            // this.freeTaskState = 2;
            // this.freeTaskResult = {
            //     'state': 1,
            //     'task_info': [
            //         { name: "min", value: 20 },
            //         { name: "max", value: 30 },
            //         { name: "mean", value: 25 },
            //         { name: "std", value: 2 },
            //         { name: "median", value: 25 },
            //         { name: "percentile", value: 25 }
            //     ],
            //     'delay': [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            //     'start_time': '2021-01-01 00:00:00',
            //     'end_time': '2021-01-01 00:01:10'
            // };
            // return;

            fetch('/api/free_task_result/' + this.selectedDataSource)
                .then(response => response.json())
                .then(data => {
                    console.log('getFreeTaskResult');
                    console.log(data);
                    if (!data) {
                        return;
                    }
                    console.log(data);
                    if (data.state === 2) {
                        this.freeTaskState = 2;
                        this.freeTaskResult = data;
                    }
                });
        },

        // 处理子组件发出的更新自由任务状态的事件
        handleStateUpdate(newState) {
            console.log('handleStateUpdate');
            console.log(newState);
            const oldState = this.freeTaskState;
            console.log(oldState);
            // 更新状态
            this.freeTaskState = newState;
            // 如果是0，清空结果展示，并向后端取消任务
            if (newState === 0) {
                this.freeTaskResult = null;
                // 如果任务在进行中，或者已经完成，都向后端取消任务
                if(oldState == 1 || oldState == 2){
                    this.stopFreeTask();
                }
            }
            if(newState === 1){
                setInterval(() => {
                    this.getFreeTaskState();
                }, 5000);
            }
        },

        // 处理子组件发出的更新任务持续时间的事件
        handleDurationUpdate(newDuration) {
            console.log('handleDurationUpdate');
            console.log(newDuration);
            this.freeTaskDuration = newDuration;
        },
    },
    mounted() {
        // this.generateRandomJPG();
        // this.generateRandomGraphData();
        // setInterval(() => {
        //     this.generateRandomJPG();  
        //     this.generateRandomGraphData();          
        // }, 5000);

        this.getDataSourceList();
        this.getResultPrompt();

        // this.generateFakeDataForAllSources();
        // setInterval(() => {
        //     this.generateFakeDataForAllSources();
        // }, 5000);

        this.getLatestResultData();
        console.log(this.bufferedTaskCache);
        setInterval(() => {
            this.getLatestResultData();
            console.log(this.bufferedTaskCache);
        }, 2000);


    },
    watch: {
        selectedDataSource: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                // console.log(newVal);
                // console.log(oldVal);
                
                // this.resultData = this.bufferedTaskCache[newVal];
                this.resultData = this.bufferedTaskCache[newVal];
                this.delayData = this.bufferedTaskCache[newVal];
                this.visualizeData = this.bufferedTaskCache[newVal];

                // 切换数据源时，需要重新获取当前数据源对应的free状态
                // 如果状态为2，会在内部调用getFreeTaskResult
                this.getFreeTaskState();

            }
        },

        // test
        freeTaskDuration: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                console.log('freeTaskDuration changed');
                console.log(newVal);
            }
        }
    },
    computed: {
        filteredVisualizeData() {
            if (!this.visualizeData) {
                return null;
            }
            return this.visualizeData.map((item) => {
                return {
                    taskId: item.taskId,
                    visualize: item.visualize
                }
            });
        },
        filteredResultData() {
            if (!this.resultData) {
                return null;
            }
            return this.resultData.map((item) => {
                return {
                    taskId: item.taskId,
                    result: item.result
                }
            });

        },
        filteredDelayData() {
            if (!this.delayData) {
                return null;
            }
            return this.delayData.map((item) => {
                return {
                    taskId: item.taskId,
                    delay: item.delay
                }
            });
        },
        filteredFreeResultData() {
            // test
            // return [
            //     { name: "min", value: 20 },
            //     { name: "max", value: 30 },
            //     { name: "mean", value: 25 },
            //     { name: "std", value: 2 },
            //     { name: "median", value: 25 },
            //     { name: "percentile", value: 25 }
            // ];

            if (!this.freeTaskResult) {
                return null;
            }
            return this.freeTaskResult.task_info;
        },
        filteredFreeDelayData() {
            // test
            // return {
            //     delay: [0.1, 0.2, 0.7, 0.4, 0.3, 0.6, 0.2, 0.8, 0.5, 0.4,
            //         0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            //     start_time: '2021-01-01 00:00:00',
            //     end_time: '2021-01-01 00:01:10'
            // };

            if (!this.freeTaskResult) {
                return null;
            }
            return {
                delay: this.freeTaskResult.delay,
                start_time: this.freeTaskResult.start_time,
                end_time: this.freeTaskResult.end_time
            };

        }
    }
};



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

    .free-manage {
        .home-card-item {
            height: 50vh;
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
