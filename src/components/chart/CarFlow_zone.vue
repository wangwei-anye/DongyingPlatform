<template>
  <v-chart-box hrefto='/index/trip' boxType='polygon' iconName='car' :w="355" :h="301" boxTitle="车场流量" style='margin: auto;'>
    <v-car-flow :carFlow='carDateCountFilter' style="padding-top: 20px;"></v-car-flow>
  </v-chart-box>
</template>
<script>
import vChartBox from '@/components/ChartBox'
import vCarFlow from '@/components/chart/CarFlow'

export default {
  name: 'carflow_wrap',
  computed: {
    carDateCountFilter() {
      return this.$store.getters['platform/carDateCountFilter']  
    }
  },
  components: {
    vChartBox,
    vCarFlow
  }
}
</script>

