<template>
  <v-chart-box hrefto="/index/population" boxType='polygon' iconName='people' :w="size[0]" :h="size[1]" boxTitle="人口数据">
    <div class="chartbox">
      <div class="echarts"></div>
      <div class="total">人口总数：<span>{{ data.total }}</span></div>
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
     * {
     *   list: [
     *     { value: 20, name: '混合式', color: '#ffda2e' },
     *     { value: 30, name: '开放式', color: '#2951ff' },
     *     { value: 50, name: '封闭式', color: '#00ffea' }
     *   ],
     *   total: 100
     * }
     */
    data: {
      type: Object,
      required: true,
      default: function () {
        return {
          list: [],
          total: 0
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
        return [355, 301]
      }
    }
  },
  data () {
    return {
      pie: null,
      timer: null
    }
  },
  methods: {
    initOption (data) {
      const legendData = data.list.map(item => item.name)
      const colorData = data.list.map(item => item.color)
      const seriesData = data.list.map(item => {
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
          orient: 'horizontal',
          bottom: 10,
          data: legendData,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '人口数据',
            type: 'pie',
            radius: ['50%', '60%'],
            center: ['50%', '50%'],
            hoverOffset: 5,
            color: colorData,
            data: seriesData,
            avoidLabelOverlap: false,
            silent: true,
            label: {
              normal: {
                show: false,
                position: 'center',
                // formatter: '{p|{d}}%\n{b}',
                formatter: function (params) {
                  var percent = params.percent.toFixed(2);
                  var text = params.name;
                  return '{p|'+ percent +'}%\n' + text;
                },
                fontSize: 18,
                color: '#fff',
                rich: {
                  p: {
                    fontSize: 32,
                    color: '#fff'
                  }
                }
              },
              emphasis: {
                show: true
              }
            },
            labelLine: {
              normal: {
                show: false
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
      let dataIndex = -1
      let len = this.data.list.length
      this.timer = setInterval(() => {
        this.pie.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex
        })
        dataIndex = (dataIndex + 1) % len
        this.pie.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex
        })
      }, this.delay)
    }
  },
  components: {
    vChartBox
  },
  mounted () {
    this.$nextTick(function(){
      this.pie = echarts.init(this.$el.querySelector('.echarts'))
      const data = this.initOption(this.data)
      this.pie.setOption(data, true)
      this.animate()
    })
  },
  watch: {
    data (val,oldVal) {
      clearInterval(this.timer)
      const data = this.initOption(this.data)
      this.pie.setOption(data, true)
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
.echarts {
  width: 100%;
  height: 100%;
}
.total {
  position: absolute;
  top: 10px;
  right: 8px;
  font-size: 12px;
  color: #1cb1ff;
  span{
    font-size: 18px;
    color: #fff;
  }
}
</style>
