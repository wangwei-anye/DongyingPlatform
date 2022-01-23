<template>
  <v-chart-box hrefto="/index/population" boxType='orthogon' iconName='people' :w="size[0]" :h="size[1]" boxTitle="小区人口">
    <div class="chartbox">
      <div class="echartsbox">
        <div class="echarts1"></div>
        <div class="echarts2"></div>
      </div>
      <div class="total">小区人口总数：<span>{{ total }}</span></div>
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
  name: 'ipersonnumber',
  props: {
    /**
     * 数据类型
     * {
     *   numbers: [
     *     { value: 22541, name: '流动人口', color: '#0084d8' },
     *     { value: 2000, name: '常住人口', color: '#00bc5d' }
     *   ],
     *   sexs: [
     *     { value: 14485, name: '男' },
     *     { value: 25564, name: '女' }
     *   ]
     * }
     */
    data: {
      type: Object,
      required: true,
      default: function () {
        return {
          numbers: [],
          sexs: []
        }
      }
    },
    delay: {
      type: Number,
      default: 1500
    },
    size: {
      type: Array,
      default: function (){
        return [484, 311]
      }
    }
  },
  data () {
    return {
      pieOne: null,
      pieTwo: null,
      timerOne: null,
      timerTwo: null
    }
  },
  computed: {
    total () {
      let sum = 0;
      this.data.numbers.forEach((item) => {
        sum += item.value;
      })
      return sum;
    }
  },
  methods: {
    initOption (data, name) {
      const legendData = data.map(item => item.name)
      const colorData = data.map(item => item.color)
      const seriesData = data.map(item => {
        return {
          value: item.value,
          name: item.name
        }
      })
      return {
        tooltip: {
          show: false
        },
        legend: {
          selectedMode: false,
          show: true,
          orient: 'vertical',
          top: 50,
          data: legendData,
          itemWidth: 30,
          textStyle: {
            color: '#fff'
          },
          formatter: function(name) {
            let number = data.find(item => item.name === name).value
            return name + '  ' + number + '(人)'
          }
        },
        series: [
          {
            name: name,
            type: 'pie',
            radius: '50%',
            center: ['50%', '65%'],
            hoverOffset: 5,
            color: colorData,
            data: seriesData,
            avoidLabelOverlap: false,
            silent: true,
            label: {
              normal: {
                color: '#fff',
                formatter: '{d}%\n{b}'
              }
            },
            labelLine: {
              normal: {
                length: 8,
                length2: 12,
                lineStyle: {
                  color: '#fff',
                  type: 'dashed'
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    animate () {
      let oneDataIndex = -1
      let oneLen = this.data.numbers.length
      this.timerOne = setInterval(() => {
        this.pieOne.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: oneDataIndex
        })
        oneDataIndex = (oneDataIndex + 1) % oneLen
        this.pieOne.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: oneDataIndex
        })
      }, this.delay)

      let twoDataIndex = -1
      let twoLen = this.data.sexs.length
      this.timerTwo = setInterval(() => {
        this.pieTwo.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: twoDataIndex
        })
        twoDataIndex = (twoDataIndex + 1) % twoLen
        this.pieTwo.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: twoDataIndex
        })
      }, this.delay)
    }
  },
  components: {
    vChartBox
  },
  mounted () {
    this.$nextTick(function(){
      this.pieOne = echarts.init(this.$el.querySelector('.echarts1'))
      this.pieTwo = echarts.init(this.$el.querySelector('.echarts2'))
      const options1 = this.initOption(this.data.numbers, '流动人口总数')
      const options2 = this.initOption(this.data.sexs, '性别总数')
      this.pieOne.setOption(options1, true)
      this.pieTwo.setOption(options2, true)
      this.animate()
    })
  },
  watch: {
    data (val,oldVal) {
      clearInterval(this.timerOne)
      clearInterval(this.timerTwo)
      const options1 = this.initOption(this.data.numbers, '流动人口总数')
      const options2 = this.initOption(this.data.sexs, '性别总数')
      this.pieOne.setOption(options1, true)
      this.pieTwo.setOption(options2, true)
      this.animate()
    }
  }
}
</script>
<style lang="scss" scoped>
.chartbox{
  position: relative;
  width: 100%;
  height: 100%;
}
.echartsbox {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.echarts1, .echarts2{
  float: left;
  width: 50%;
  height: 100%;
  overflow: hidden;
}
.total {
  position: absolute;
  top: 15px;
  left: 50px;
  font-size: 12px;
  color: #1cb1ff;
  span{
    font-size: 18px;
    color: #fff;
  }
}
</style>
