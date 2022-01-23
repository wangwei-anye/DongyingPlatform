<template>
  <div ref="radar"></div>
</template>

<script>
	import echarts from 'echarts'

  function radar(element, data) {
    var max = 0;
    var communityDis = echarts.init(element),
        value = [],
        indicator = [
          {
            'text': '',
            'max': max
          },
          {
            'text': '',
            'max': max
          },
          {
            'text': '',
            'max': max
          }
        ];

    for (var i = 0, len = data.length; i < len; i++) {
      indicator[i]['text'] = data[i]['name'];
      value.push(data[i]['value']);
      if (max <= data[i]['value']) {
        max = data[i]['value'];
      }
    }

    for (var j = 0, lenb = indicator.length; j < lenb; j++) {
      indicator[j]['max'] = max + 1;
    }

    communityDis.setOption({
      radar: {
        indicator: indicator,
        radius: 60,
        startAngle: 120,
        axisLine: {
          lineStyle: {
            color: '#ccc',
            width: 0.5
          }
        },
        splitLine: {
          lineStyle: {
            color: '#ccc',
            type: 'dotted',
            width: 0.2
          }
        },
        splitArea: {
          areaStyle: {
            color: 'rgba(255, 255, 255, 0)'
          }
        },
        splitNumber: 4,
        shape: 'circle',
        nameGap: 4
      },
      series: [{
        type: 'radar',
        data: [{
            name: '数据',
            value: value,
        }],
        areaStyle: {
          normal: {
            color: '#2ce9a7'
          }
        },
        lineStyle: {
          normal: {
            color: '#29e8a5',
            width: 1
          }
        },
        label: {
          normal: {
            show: true,
            formatter: function(params) {
              return params.value;
            },
            color: '#fff',
            position: ['50%', '50%']
          }
        }
      }],
      textStyle: {
        color: '#fff',
        fontSize: 12 
      }
    });
  }

export default {
  name: 'Radar',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  methods: {
    radar
  },
  mounted() {
    if (this.$refs.radar) {
      this.radar(this.$refs.radar, this.data);
    }
  },
  watch: {
    data() {
      this.radar(this.$refs.radar, this.data);
    }
  }
}
</script>
