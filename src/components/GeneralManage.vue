<template>
    <div style="padding: 20px ">
      <a-row type="flex" justify="space-between" >
        <div style="margin-bottom:15px;font-size: 18px;">
          <b>Time: </b>
          <a-select
            v-model:value="timeValue"
            size="middle"
            style="width: 200px"
            :options="options"
            placeholder="Please select"
          ></a-select>
        </div>
        <span style="font-size: 18px;">
          <b>Total : </b> {{ timeValue == "thisWeek" ? fomatNumber(dataThisWeek.totalMoney) : fomatNumber(dataThisMonth.totalMoney) }} 
          <span style="font-size: 14px;">VND</span>
        </span>
      </a-row>
      <!-- line chart -->
      <LineChartVue 
        :data-chart="chartLineData"
        :width-bar="800"
        :height-bar="180"
      />
      <a-row style="margin-top: 2vh; display: flex !important;" justify="space-between" >
        <BarChartVue 
          style="width: 48% !important;"
          :width-bar="700"
          :height-bar="300"
          :data-chart="chartBarDataWeek"
        />
        <BarChartVue 
          style="width: 48% !important;"
          :width-bar="700"
          :height-bar="300"
          :data-chart="chartBarDataMonth"
        />
      </a-row>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watchEffect } from 'vue';
import BarChartVue from './common/BarChart.vue';
import LineChartVue from './common/LineChart.vue';
import { TChartData } from 'vue-chartjs/dist/types';
import { getAllDaysInMonth } from '@/utils';
import jwtService from '@/config/jwt.service';
import ApiService from '@/config/api.service';
import { openNotificationWithIcon } from '@/common';
import { generalState } from '@/interface';
import moment from 'moment';
import { fomatNumber } from '@/utils';

export default defineComponent({
  name: 'General',
  props: {
    msg: String,
  },
  components: {
    BarChartVue,
    LineChartVue
  },
  setup(props, context) {
    const setLabel = (val: string) => {
      if(val == "thisWeek") 
      {
        state.chartLineData.datasets[0].label = "this week"
        state.chartLineData.labels = state.labelsThisWeek
        let arrValueChart: any[] = []
        if(state.dataThisWeek.items.length > 0) {
          state.chartLineData.labels.forEach(element => {
            let countMoney = 0;
            state.dataThisWeek.items.forEach(item => {
              if(item.createdAt == element) countMoney += item.money
            });
            arrValueChart.push(countMoney)
          });
        }
        state.chartLineData.datasets[0].data = arrValueChart
      }
      if(val == "thisMonth") {
        state.chartLineData.datasets[0].label = "this month"
        state.chartLineData.labels = dateArr.map((item) => {
          return moment(item).format("MMM Do")
        })
        let arrValueChart: any[] = []
        if(state.dataThisMonth.items.length > 0) {
          state.chartLineData.labels.forEach(element => {
            let countMoney = 0;
            state.dataThisMonth.items.forEach(item => {
              if(item.createdAt == element) countMoney += item.money
            });
            arrValueChart.push(countMoney)
          });
        }
        state.chartLineData.datasets[0].data = arrValueChart
      }
    }
    var state = reactive<{
      labelsThisWeek: string[],
      timeValue: string;
      options: {
        value: string,
        label: string
      }[];
      total: number,
      chartBarDataWeek: TChartData,
      chartBarDataMonth: TChartData,
      chartLineData: TChartData,
      dataThisWeek: generalState,
      dataLastWeek: generalState,
      dataThisMonth: generalState,
      dataLastMonth: generalState,
    }>({
      labelsThisWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      dataThisWeek: {
        totalMoney: 0,
        items: []
      },
      dataLastWeek: {
        totalMoney: 0,
        items: []
      },
      dataThisMonth: {
        totalMoney: 0,
        items: []
      },
      dataLastMonth: {
        totalMoney: 0,
        items: []
      },
      timeValue: 'thisWeek',
      total: 0,
      options: [
        {
          value: 'thisWeek',
          label: 'this week'
        },
        {
          value: 'thisMonth',
          label: 'this month'
        }
      ],
      chartBarDataWeek: {
        labels: ['Weekly Chart'],
        datasets: [
          {
            label: 'last week',
            backgroundColor: '#002140',
            data: [400]
          },
          {
            label: 'this week',
            backgroundColor: '#1890ff',
            data: [100]
          },
        ]
      },
      chartBarDataMonth: {
        labels: ['Monthly Chart'],
        datasets: [
          {
            label: 'last month',
            backgroundColor: '#002140',
            data: [4000]
          },
          {
            label: 'this month',
            backgroundColor: '#1890ff',
            data: [5000]
          },
        ]
      },
      chartLineData: {
        labels: [],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            data: []
          }
        ]
      },
    })
    watchEffect(() => {
      setLabel(state.timeValue)
    })
    //init data lcurrent week
	  const initData = async(time: string) => {
		  if(jwtService.getToken()) {
        await ApiService.postApi('/api/work/read/timeline',{
          "timeSelect": time
        })
        .then(res => {
          if(res.status == 200) {				
            const data = res.data
            
            var getData: generalState = {
              totalMoney: 0,
              items: []
            }
            getData.totalMoney = data.totalMoney
            data.items.map((item:any) => {
              getData.items.push({
                createdAt: item.createdAt,
                money: item.money
              })
            })
            if(time == "thisWeek") {
              getData.items.map((item) => {
                item.createdAt = moment(item.createdAt).format('dddd')
              })
              state.dataThisWeek = getData
              state.chartBarDataWeek.datasets[1].data = [getData.totalMoney]
            }
            if(time == "lastWeek") {
              state.dataLastWeek = getData
              state.chartBarDataWeek.datasets[0].data = [getData.totalMoney]
            }
            if(time == "thisMonth") {
              getData.items.map((item) => {
                item.createdAt = moment(item.createdAt).format('MMM Do')
              })
              state.dataThisMonth = getData
              state.chartBarDataMonth.datasets[1].data = [getData.totalMoney]
            }
            if(time == "lastMonth") {
              state.dataLastMonth = getData
              state.chartBarDataMonth.datasets[0].data = [getData.totalMoney]
            }
          }else {
            openNotificationWithIcon('error', res.data.message, '')
          }
        })
        .catch(err => {
          openNotificationWithIcon('error', err.response.data.message, '');
        })
		  }
	  }
    initData("thisWeek")
    initData("lastWeek")
    initData("thisMonth")
    initData("lastMonth")
    
    const date = new Date()
    var dateArr = getAllDaysInMonth(date.getFullYear(), date.getMonth())
    return {
      ...toRefs(state), fomatNumber
    }
  },

});
</script>

<style scoped>

</style>
