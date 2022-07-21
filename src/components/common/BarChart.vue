<template>
  <div>
    <Bar :chartData="chartData"
    :width="widthBar"
    :height="heightBar"
    />
  </div>
</template>
<script lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
import { defineComponent } from "vue";
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
            default: () => ({})
        }
    },
    components: {
        Bar
    },
    setup(props, context) {
        return {
            heightBar: props.heightBar,
            widthBar: props.widthBar,
            chartData: props.dataChart 
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