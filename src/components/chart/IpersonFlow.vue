<template>
  <v-chart-box hrefto="/index/trip" boxType='polygon' iconName='people_flow' :w="size[0]" :h="size[1]" boxTitle="人流数据">
    <div class="person-flow">
      <div class="img"></div>
      <div class="txt">
        <span>今日开门</span>
        <p>{{ data }}</p>
      </div>
    </div>
  </v-chart-box>
</template>
<script>
import vChartBox from '@/components/ChartBox'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
export default {
  name: 'iestate',
  props: {
    /**
     * 数据类型
     * 1111
     */
    data: {
      type: Number,
      required: true,
      default: 0
    },
    size: {
      type: Array,
      default: function (){
        return [355, 301]
      }
    }
  },
  components: {
    vChartBox
  }
}
</script>
<style lang="scss" scoped>
.person-flow{
  .img{
    margin: 50px auto;
    width: 149px;
    height: 78px;
    background: url(../../assets/image/person-flow.png) no-repeat;
  }
  .txt{
    font-size: 12px;
    text-align: center;
    color: #47e3ff;
    span{
      display: block;
    }
    p{
      color: #fff;
      font-size: 24px;
      line-height: normal;
    }
  }
}
</style>
