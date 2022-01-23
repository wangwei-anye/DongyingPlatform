<template>
  <v-chart-box boxType='polygon' hrefto='/index/safety' iconName='ranking' :w="355" :h="301" boxTitle="小区安全排行">
    <IRanking></IRanking>
  </v-chart-box>
</template>
<script>
import vChartBox from '@/components/ChartBox'
import IRanking from '@/components/chart/IRanking'
export default {
  name: 'ranking',
  components: {
    vChartBox,
    IRanking
  }
}
</script>

