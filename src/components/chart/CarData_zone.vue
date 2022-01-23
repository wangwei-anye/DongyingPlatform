<template>
  <v-chart-box hrefto='/index/trip' boxType='polygon' iconName='car' :w="355" :h="301" boxTitle="车场数据" style='margin: auto;'>
    <v-car-data :carData='unitCarData'></v-car-data>
  </v-chart-box>
</template>
<script>
import vChartBox from '@/components/ChartBox'
import vCarData from '@/components/chart/CarData'

export default {
  name: 'cardata_wrap',
  computed: {
    unitCarData() {
      return this.$store.state.platform.unitCarData
    }
  },
  components: {
    vChartBox,
    vCarData
  }
}
</script>

