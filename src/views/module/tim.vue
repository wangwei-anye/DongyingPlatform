<template>
  <div>
    <v-chart-box boxType='orthogon' iconName='volume_of_flow' :w="484" :h="311" boxTitle="实时人流量&车流量">
    </v-chart-box>
    <v-map-header headerTitle="居民活动轨迹"></v-map-header>
    <v-active-sequence-chart />
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import vChartBox from '@/components/ChartBox'
import vMapHeader from '@/components/section/MapHeader'
import vActiveSequenceChart from '@/components/chart/ActiveSequenceChart'

export default {
  data() {
    return {
      datum: [
        {
          date: '2017/05/03',
          carIn: [
            {
              time: '16:14:15',
              zone: '冲广坪小区',
              door: '北门'
            },
            {
              time: '16:14:15',
              zone: '冲广坪小区',
              door: '北门'
            }
          ],
          carOut: [
            {
              time: '16:14:15',
              zone: '冲广坪小区',
              door: '北门'
            },
            {
              time: '16:14:15',
              zone: '冲广坪小区',
              door: '北门'
            }
          ],
          people: [
            {
              time: '16:14:15',
              zone: '冲广坪小区',
              door: '北门'
            }
          ]
        }
      ]
    }
  },
  components: {
    vChartBox,
    vMapHeader,
    vActiveSequenceChart
  }
}
</script>
