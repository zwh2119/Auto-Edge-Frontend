<template>
    <div>
        <h3>处理时延CDF图</h3>
    </div>
    <br>
    <div id="cdf-chart" style="width: 300px; height: 250px;"></div>
</template>
  
<script>
import * as echarts from 'echarts';

export default {
    props: {
        data: {
            type: Object,
        }
    },
    data() {
        return {
            chartData: [],
            chart: null
        }
    },
    mounted() {

        // 初始化echarts实例
        this.chart = echarts.init(document.getElementById('cdf-chart'));
        // 调用加载数据的方法
        this.loadData();
        // 定时更新数据
        setInterval(this.loadData, 5000); // 每5秒更新一次
    },
    watch: {
        data: {
            handler: function (newVal, oldVal) {
                this.loadData();
            },
            deep: true
        }
    },
    methods: {
        loadData() {
            this.chartData = this.data;
            if (!this.chartData) {
                return;
            }
            // 调用渲染图表的方法
            this.renderChart();
        },

        renderChart() {
            const sortedData = this.data.sort((a, b) => a.delay - b.delay);
            const delayData = sortedData.map(item => Number(item.delay));

            const option = {
                // title: {
                //     text: '处理时延CDF图'
                // },
                xAxis: {
                    type: 'value',
                    name: '处理时延',
                    nameLocation: 'middle', // 使轴名称居中显示
                    nameGap: 25, // 与轴的距离
                    axisLine: {
                        lineStyle: {
                            color: '#999' // x轴线颜色
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed' // 分隔线类型
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '累积分布函数',
                    nameLocation: 'middle', // 使轴名称居中显示
                    nameGap: 30, // 与轴的距离
                    axisLine: {
                        lineStyle: {
                            color: '#999' // x轴线颜色
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed' // 分隔线类型
                        }
                    }
                },
                grid: {
                    left: '5%', // 调整左边距
                    right: '5%', // 调整右边距
                    bottom: '10%', // 调整底边距
                    containLabel: true // 包含标签在内
                },
                series: [
                    {
                        type: 'line',
                        data: delayData.map((delay, index) => [delay, (index + 1) / delayData.length]), // 计算累积分布函数
                        label: {
                            show: true,
                            formatter: '{b}', // 显示数据点的横坐标值
                            position: 'top' // 数据标签位置在数据点顶部
                        },
                        areaStyle: { // 添加背景色
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(87, 137, 243, 0.3)'
                            }, {
                                offset: 1,
                                color: 'rgba(87, 137, 243, 0)'
                            }])
                        }
                    }
                ]
            };

            this.chart.setOption(option);
        }
    }
};
</script>
  
<style scoped>
#cdf-chart {
    margin: 0 auto;
    width: 100%;
    height: 100%;
}
</style>
  