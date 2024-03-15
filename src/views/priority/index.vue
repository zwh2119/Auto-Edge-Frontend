<template>
    <div class="home-container layout-pd">
        <!-- <el-row :gutter="15" class="home-card-two mb15 toggleSource">
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
        </el-row> -->
        <el-row :gutter="15" class="home-card-two mb15 toggleSource">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <div class="home-card-item">
                    <div style="height: 100%">
                        <div class="flex-margin flex w100">
                            <div class="flex-auto">
                                选择节点: &nbsp; &nbsp; &nbsp;
                                <el-select v-model="selectedNode" placeholder="请选择...">
                                    <el-option v-for="item in node" :key="item" :label="item" :value="item">
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
                                <!-- <PriorityAnimation :data="priorityData" /> -->
                                <PriorityView :priority_num="priority_num" :stage="stage"
                                    :queue_result="queue_result" />
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// import PriorityAnimation from './PriorityAnimation.vue'
import PriorityView from './PriorityView.vue'
export default {
    components: {
        // PriorityAnimation,
        PriorityView
    },
    mounted() {

        this.getPipelineInfo();
        this.getLatestPriorityData();
        setInterval(this.getLatestPriorityData, 1000);

    },
    data() {
        return {
            priority_num: null,
            stage: [],
            node: [],
            queue_result: null,
            selectedNode: null,
        }
    },
    methods: {
        //  获取流水线信息
        // "/pipeline_info"
        // 后端返回json格式
        // {
        //     'priority_num': 10,
        //     'stage': [stage_name1,stage_name2],
        //      'node': [node_name1,node_name2]
        // }



        getPipelineInfo() {
            fetch('/api/pipeline_info')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.priority_num = data.priority_num;
                    this.stage = data.stage;
                    this.node = data.node;
                });
        },


        // 3. 获取最新数据
        // /queue_result
        // 后端返回json格式

        getLatestPriorityData() {
            if(!this.selectedNode){
                return;
            }
            fetch('/api/queue_result/' + this.selectedNode)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.queue_result = data;
                });
        },

    },
    watch: {
        selectedNode: function (newVal, oldVal) {
            this.getLatestPriorityData();
        }
    }
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
            height: 100vh;
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
