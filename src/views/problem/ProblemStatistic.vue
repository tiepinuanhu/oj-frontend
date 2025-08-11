<template>
    <!-- 使用 vue-echarts 组件并绑定 option -->
<!-- <e-row  >
    <e-col  :span="12" >
    </e-col>
    <e-col :span="12" >
    </e-col>
</e-row> -->
     <div class="project-chart">
        <v-chart  ref="chart1Ref" class="chart" :option="option" />
        <v-chart ref="chart2Ref" class="bar" :option="option2" />

     </div>
</template>

<script setup >
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
// 你不需要在组件中直接引入 echarts，因为 vue-echarts 已经处理了初始化
import * as echarts from 'echarts';
import { getProblemStatistics } from '../../api/submission/index';
import { ElementPlus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
// import type { ProblemStatisticsVO } from "../../api/submission/types";
// import { ElMessage } from 'element-plus';

const problemId = ref('')
const chart1Ref= ref(null);
const chart2Ref= ref(null);
const route = useRoute();
onMounted(async () => {
    problemId.value = route.params.id
    await load_data()
    chart1Ref.value.resizeChart();
    chart2Ref.value.resizeChart()
    await init_chart()
})
const option = reactive({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold',
          formatter: '{d}%'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
})
const init_chart = () => {
    const myChart = echarts.init(chart1Ref.value)
    const myChart2 = echarts.init(chart2Ref.value)
    myChart.setOption(option);
    myChart2.setOption(option2);
    myChart.resize()
    myChart2.resize()
}
const update_chart  = (data) => { 
    option.series[0].data = data
}

const resultDistributions = ref([])
const timeList = ref([])
const load_data = async () => {

    const res = await getProblemStatistics(problemId.value);
    if (res.code == 200) {
      let total = res.data.submittedCount
        resultDistributions.value = res.data.resultDistributions.map(item => { 
            return {
                name: item.status,
                value: item.count 
            };
        });
        timeList.value = res.data.timeCount
        update_chart(resultDistributions.value)
    option2.series[0].data = timeList

    } else {
        ElMessage.error("..................................");
    }
}

const option2 = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['901~ms',
        '801~900ms', '701~800ms','601~700ms',
       '501~600ms', '401~500ms', '301~400ms',
        '201~300ms', '101~200ms', '0~100ms'],
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        interval: 0, // 必选：显示所有标签
        rotate: 45, // 可选：倾斜标签避免重叠
        // fontSize: 12, // 缩小字体
        margin: 5
        
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'count',
      type: 'bar',
      barWidth: '40%',
      data: timeList,
      itemStyle: {
                normal: {
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                          '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                           '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                        ];
                        return colorList[params.dataIndex]
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}%'
                    }
                }
            }
    }
  ]
})




</script>


<style scoped>
 .project-chart {
     display: flex;
  }
/* 定义图表的大小 */
.chart {
    width: 550px;
    height: 450px;
}
.bar {
    width: 750px;
    height: 450px;
}

</style>