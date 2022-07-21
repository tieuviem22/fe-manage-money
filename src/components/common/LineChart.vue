<template>
  <div>
    <Line 
        :chart-data="chartData"
        :width="widthBar"
        :height="heightBar"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, h, PropType } from 'vue'

import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Plugin
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
)
export default defineComponent({
    name: "bar",
    props: {
        widthBar: {
            type: Number,
            default: 1000
        },
        heightBar: {
            type: Number,
            default: 300
        },
        dataChart: {
            type: Object,
            default: {}
        }
    },
    components: {
        Line
    },
    setup(props, context) {
        return {
            chartData: props.dataChart,
            heightBar: props.heightBar,
            widthBar: props.widthBar,
        }
    }
})
</script>
<style scoped>
    div {
        background: rgba(255, 255, 255, 1);
        padding: 5px;
        text-align: center;
    }
</style>