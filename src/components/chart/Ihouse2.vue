<template>
  <v-chart-box hrefto='/index/house' boxType='polygon' iconName='house' :w="size[0]" :h="size[1]" boxTitle="房屋数据">
    <div class="chartbox">
      <div class="cbox" :class="info">
        <div class="echarts"></div>
      </div>
      <div class="txtbox" v-show="info === 'left'">
        <div class="item">
          <h4>小区房屋总数</h4>
          <p><em>{{total}}</em>户</p>
        </div>
        <div class="item">
          <h4>小区入住率</h4>
          <p><em>{{ data.occRate.replace(/%$/, '') }}</em>%</p>
        </div>
      </div>
      <div class="smallchart" v-show="info === 'right'">
        <p title="1223550"><span>房屋总数：</span>{{ total }}</p>
        <div class="schart">
          <div class="top"></div>
          <div class="bot"></div>
          <div class="wrap">
            <div class="tit">入住率</div>
            <div class="spie"></div>
          </div>
        </div>
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
     * {
     *   list: [
     *     { value: 20, name: '混合式', color: '#ffda2e' },
     *     { value: 30, name: '开放式', color: '#2951ff' },
     *     { value: 50, name: '封闭式', color: '#00ffea' }
     *   ],
     *   occRate: '26%',  // 入住率
     *   total: 100
     * }
     */
    data: {
      type: Object,
      required: true,
      default: function () {
        return {
          list: [],
          occRate: '0%',
          total: 0
        }
      }
    },
    delay: {
      type: Number,
      default: 1500
    },
    info: {
      type: String,
      default: 'right'
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
      spie: null,
      timer: null
    }
  },
  computed: {
    total () {
      return this.data.total
    },
    spieOption () {
      const value = this.data.occRate.replace(/%$/, '')
      return {
        series: [
          {
            name: '入住率',
            type: 'pie',
            radius: [40, 45],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            hoverOffset: 0,
            selectedOffset: 0,
            silent: true,
            data: [
              {
                name: '入住率',
                value: value,
                label: {
                  normal: {
                    show: true
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#008aff'
                  }
                }
              },
              {
                name: '未入住率',
                value: 100 - value,
                itemStyle: {
                  normal: {
                    color: '#235182'
                  }
                }
              }
            ],
            label: {
              normal: {
                show: false,
                position: 'center',
                fontSize: 18,
                color: '#fff',
                //formatter: '{d}%'
                formatter: function(params) {
                  return params.percent.toFixed(2) + '%'
                }
              },
              emphasis: {
                show: true
              }
            }
          }
        ]
      }
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
          show: false,
          orient: 'horizontal',
          bottom: 10,
          data: legendData,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '房屋数据',
            type: 'pie',
            radius: ['40%', '50%'],
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
                //formatter: '{p|{d}}%\n{b}',
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
      const opt = this.initOption(this.data)
      this.pie.setOption(opt, true)
      this.animate()

      this.spie = echarts.init(this.$el.querySelector('.spie'))
      this.spie.setOption(this.spieOption, true)
    })
  },
  watch: {
    data (val, oldVal) {
      clearInterval(this.timer)
      const opt = this.initOption(val)
      this.pie.setOption(opt, true)
      this.animate()
      this.spie.setOption(this.spieOption, true)
    }
  }
}
</script>
<style lang="scss" scoped>
.chartbox{
  position: relative;
  width: 100%;
  height: 100%;
  bottom: 20px;
  margin-top: 10px;
  overflow: hidden;
}
.echarts {
  width: 100%;
  height: 100%;
}
.cbox{
  position: absolute;
  top: 0;
  left: 40px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.cbox.right{
  left: -70px;
}
.shadebox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 2px solid #dcdcdc;
  div{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .c1{
    width: 162px;
    height: 162px;
    border-radius: 50%;
    border: 1px solid #dcdcdc;
  }
  .c2{
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px dashed #dcdcdc;
  }
  .c3{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px dashed #dcdcdc;
  }
  .c4{
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1px dashed #dcdcdc;
  }
}
.txtbox{
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  font-size: 16px;
  color: #1cb1ff;
  .item{
    position: relative;
    padding: 12px 0 6px;
    &:after{
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 2px;
      background: linear-gradient(90deg, rgba(28, 177, 255, 0), rgba(28, 177, 255, 0.3), rgba(28, 177, 255, 0));
    }
    &:nth-of-type(2):before{
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      height: 2px;
      background: linear-gradient(90deg, rgba(28, 177, 255, 0), rgba(28, 177, 255, 0.3), rgba(28, 177, 255, 0));
    }
  }
  p{
    color: #fff;
    line-height: normal;
  }
  em {
    font-style: normal;
    font-size: 36px;
  }
}
.smallchart{
  position: absolute;
  top: 0;
  right: 6px;
  bottom: 0;
  width: 148px;
  p{
    margin-top: 50px;
    color: #fff;
    font-size: 18px;
    text-align: center;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    span{
      font-size: 12px;
      color: #1cb1ff;
    }
  }
  .schart{
    position: absolute;
    bottom: 13px;
    left: 1px;
    width: 146px;
    height: 164px;
    border: 1px solid #1c5893;
    padding: 5px;
  }
  .top{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    &:before{
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      width: 6px;
      height: 6px;
      border-left: 3px solid #1c5893;
      border-top: 3px solid #1c5893;
    }
    &:after{
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 6px;
      height: 6px;
      border-right: 3px solid #1c5893;
      border-top: 3px solid #1c5893;
    }
  }
  .bot{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    &:before{
      content: '';
      position: absolute;
      bottom: -2px;
      left: -2px;
      width: 6px;
      height: 6px;
      border-left: 3px solid #1c5893;
      border-bottom: 3px solid #1c5893;
    }
    &:after{
      content: '';
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 6px;
      height: 6px;
      border-right: 3px solid #1c5893;
      border-bottom: 3px solid #1c5893;
    }
  }
  .wrap{
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(91,199,255, .05);
    color: #1cb1ff;
  }
  .spie{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .tit{
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
