// 仪表盘
function DashBoardChart(id, label, count, percent) {
	let option = {
    series: [
      {
        // 图表类型
        type: 'gauge',
        // 半径
        radius: '100%',
        // 轴线
        axisLine: {
          lineStyle: {
            color: [[0.36, '#1eb2ff'], [1, '#005399']],
            width: 30
          }
        },
        // 分隔线
        splitLine: {
          length: 25,
          lineStyle: {
            color: '#fff',
            width: 4
          }
        },
        // 刻度
        axisTick: {
          length: 10,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        // 刻度标签
        axisLabel: {
          distance: 10,
          color: '#fff',
          fontSize: 20
        },
        // 指针
        pointer: {
          width: 10
        },
        // 指针样式
        itemStyle: {
          normal: {
            color: '#ffda2e'
          }
        },
        title: {
          offsetCenter: [0, '85%'],
          rich: {
            a: {
              color: '#1cb1ff',
              fontSize: 18,
              padding: [0, 0, 10, 0]
            },
            b: {
              color: '#fff',
              fontSize: 36,
              padding: [0, 0, 0, 0]
            },
            c: {
              color: '#fff',
              fontSize: 18,
              padding: [0, 0, 10, 2]
            }
          }
        },
        // 详情
        detail: {
          formatter: '{value}{a|%}',
          offsetCenter: [0, '35%'],
          color: '#ffda2e',
          fontSize: 48,
          rich: {
            a: {
              color: '#ffda2e',
              fontSize: 18,
              padding: [0, 0, 15 , 2]
            }
          }
        },
        data: [{value: 36, name: '{a|混合式：}{b|2658}{c|个}'}]
      }
    ],
    graphic: {
      elements: [
        {
          type: 'circle',
          left: 'center',
          top: 'center',
          shape: { r: 48 },
          style: { fill: '#00569c'}
        },
        {
          type: 'circle',
          left: 'center',
          top: 'center',
          shape: { r: 24 },
          style: { fill: '#1cb1ff'}
        }
      ]
    }
	}
}

// 面积图
function AreaChart() {
	let option = {
    title: {
      text: '车流量',
      textStyle: {
        fontSize: 18,
        color: '#fff'
      },
      left: 20
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        return params[0].value;
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#fff',
          type: 'dashed'
        }
      },
      backgroundColor: '#00c6ff'
    },
    grid: {
      left: 0,
      right: 25,
      top: 40,
      bottom: 0,
      containLabel: true
    },
    xAxis : [
      {
        type: 'category',
        axisTick: { show: false },
        boundaryGap : false,
        axisLine: {
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        axisLabel: {
          interval: 0,
          fontSize: 18,
          color: '#fff'
        },
        data : ['00:00','04:00','08:00','12:00','16:00','20:00','24:00']
      }
    ],
    yAxis : [
      {
        type : 'value',
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        axisLabel: {
          interval: 1,
          fontSize: 18,
          color: '#fff'
        },
        splitLine: {
          show: false
        }
      }
    ],
    series : [
      {
        type:'line',
        smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#258eb4'
              },
              {
                offset: 1,
                color: '#00c6ff'
              }
            ])
          }
        },
        lineStyle: {
          normal: {
            color: '#fff',
            width: 1
          }
        },
        itemStyle: {
          normal: {
            borderColor: '#fff'
          }
        },
        data:[1200, 1300, 900, 1000, 800, 1100, 950]
      }
    ]
	}
}

// 雷达图
function RadarChart() {
	let option = {
    radar: [
      {
        indicator: [
          { name: '案件', max: 120 },
          { name: '告警处理', max: 120 },
          { name: '出入实名制', max: 120  },
          { name: '巡查', max: 120 },
          { name: '三防', max: 120 },
          { name: '外来人员', max: 120 },
          { name: '重点人员', max: 120 }
        ],
        center: ['50%', '50%'],
        radius: '70%',
        startAngle: 90,
        splitNumber: 6,
        shape: 'circle',
        name: {
          color:'#bce8ff',
          fontSize: 18
        },
        splitArea: {
          areaStyle: {
            color: [
              'rgba(44, 154, 178, 0.30)',
              'rgba(44, 154, 178, 0.25)',
              'rgba(44, 154, 178, 0.20)',
              'rgba(44, 154, 178, 0.15)',
              'rgba(44, 154, 178, 0.10)',
              'rgba(44, 154, 178, 0.05)'
            ]
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(32, 105, 162, 0.25)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(26, 82, 125, 0.25)',
            type: 'dashed'
          }
        }
      }
    ],
    series: [
      {
        name: '雷达图',
        type: 'radar',
        data: [
          {
            value: [99, 91, 98, 87, 89, 86, 92],
            symbol: 'circle',
            symbolSize: 1,
            itemStyle: {
              normal: {
                color: '#8398ce'
              }
            },
            lineStyle: {
              normal: {
                type: 'dashed',
                color: '#8398ce'
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(96, 0, 254, 0.5)'
              }
            },
            label: {
              normal: {
                show: true,
                formatter:function(params) {
                  return params.value;
                },
                fontSize: 18,
                color: '#bce8ff'
              }
            }
          }
        ]
      }
    ]
	}
}

// 三极雷达图
function TripolarChart() {
	let option = {
    radar: [
      {
        indicator: [
          { name: '人防', max: 60 },
          { name: '物防', max: 60 },
          { name: '技防', max: 60  }
        ],
        center: ['50%', '50%'],
        radius: '80%',
        startAngle: 90,
        splitNumber: 6,
        shape: 'circle',
        name: {
          color:'#e8e8e8',
          fontSize: 14
        },
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(97, 120, 171, 0.25)'
          }
        }
      }
    ],
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [49, 30, 50],
            symbol: 'circle',
            symbolSize: 5,
            itemStyle: {
              normal: {
                color: '#fff'
              }
            },
            lineStyle: {
              normal: {
                type: 'dashed',
                color: '#8398ce'
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(78, 0, 255, 0.5)'
              }
            }
          }
        ]
      },
      {
        type: 'radar',
        data: [
          {
            value: [55, 55, 55],
            symbol: 'none',
            lineStyle: {
              normal: {
                opacity: 0
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(97, 120, 171, 0.05)'
              }
            }
          }
        ]
      },
      {
        type: 'radar',
        data: [
          {
            value: [45, 45, 45],
            symbol: 'none',
            lineStyle: {
              normal: {
                opacity: 0
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(97, 120, 171, 0.10)'
              }
            }
          }
        ]
      },
      {
        type: 'radar',
        data: [
          {
            value: [35, 35, 35],
            symbol: 'none',
            lineStyle: {
              normal: {
                opacity: 0
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(97, 120, 171, 0.15)'
              }
            }
          }
        ]
      },
      {
        type: 'radar',
        data: [
          {
            value: [25, 25, 25],
            symbol: 'none',
            lineStyle: {
              normal: {
                opacity: 0
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(97, 120, 171, 0.20)'
              }
            }
          }
        ]
      },
      {
        type: 'radar',
        data: [
          {
            value: [15, 15, 15],
            symbol: 'none',
            lineStyle: {
              normal: {
                opacity: 0
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(97, 120, 171, 0.25)'
              }
            }
          }
        ]
      }
    ]
	}
}

// 单系列柱状图
function SingleBarChart() {
	let option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}：{c}',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#db6c45'
        }
      },
      backgroundColor: '#db6c45'
    },
    grid: {
      left: '0',
      right: '0',
      top: '30',
      bottom: '0',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        data : ['警服', '警服-铁叉', '铁叉', '铁叉-催泪器', '催泪器', '催泪器-灭火器', '灭火器', '灭火器-防刺背心', '防刺背心', '防刺背心-手电筒', '手电筒', '手电筒-防盗窗', '防盗窗', '更多'],
        axisLine: {
          lineStyle: {
            color: '#7269ac',
            opacity: 0.25
          }
        },
        axisTick: {
          interval: 0,
          inside: true,
          length: 8,
          lineStyle: {
            color: '#7269ac',
            opacity: 0.25
          }
        },
        axisLabel: {
          interval: 2,
          color: '#fff',
          fontSize: 14
        }
      }
    ],
    yAxis : [
      {
        type : 'value',
        name: '数量',
        nameTextStyle: {
          fontSize: 14,
          color: '#fff'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 2,
          color: '#fff',
          fontSize: 14
        }
      }
    ],
    series : [
      {
        type:'bar',
        barWidth: '50%',
        itemStyle: {
          normal: {
            color: ['#dbcf45']
          }
        },
        data:[1700, 2000, 2600, 1950, 2950, 2700, 2500, 800, 950, 2250, 2800, 1550, 900, 450]
      }
    ]
	}
}

// 多系列柱状图
function DoubleBarChart() {
	let option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a0}：{c0}<br/>{a1}：{c1}<br/>{a2}：{c2}',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#db6c45'
        }
      },
      backgroundColor: '#db6c45'
    },
    grid: {
      left: '0',
      right: '0',
      top: '30',
      bottom: '0',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        data : ['碧江区', '万山区', '江口县', '石阡县', '思南县', '德江县', '玉屏县', '松桃县', '沿河县', '印江县'],
        axisLine: {
          lineStyle: {
            color: '#7269ac',
            opacity: 0.25
          }
        },
        axisTick: {
          interval: 0,
          inside: true,
          length: 8,
          lineStyle: {
            color: '#7269ac',
            opacity: 0.25
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 14
        }
      }
    ],
    yAxis : [
      {
        type : 'value',
        name: '数量',
        nameTextStyle: {
          fontSize: 14,
          color: '#fff'
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          interval: 2,
          color: '#fff',
          fontSize: 14
        }
      }
    ],
    series : [
      {
        name: '人防',
        type:'bar',
        barWidth: '20%',
        itemStyle: {
          normal: {
            color: ['#186ee1']
          }
        },
        data:[90, 55, 50, 95, 75, 55, 15, 58, 35, 38]
      },
      {
        name: '物防',
        type:'bar',
        barWidth: '20%',
        itemStyle: {
          normal: {
            color: ['#00bc5d']
          }
        },
        data:[75, 65, 79, 82, 75, 82, 48, 50, 22, 43]
      },
      {
        name: '技防',
        type:'bar',
        barWidth: '20%',
        itemStyle: {
          normal: {
            color: ['#b3c70f']
          }
        },
        data:[30, 18, 62, 43, 62, 22, 30, 78, 32, 50]
      }
    ]
	}
}

// 柱状图
function BarChart() {
  let option = {
    grid: {
      left: '0',
      right: '15',
      bottom: '0',
      top: '0',
      containLabel: true
    },
    yAxis : [
      {
        type : 'category',
        data : ['思南县', '万山区', '江口县', '铜仁高新技术产业开发区', '碧江区', '玉屏侗族自治区', '德江县', '石阡县', '印江土家族苗族自治县', '大龙开发区', '松桃苗族自治县', '沿河土家族自治县'].reverse(),
        axisLine: {
          lineStyle: {
            color: '#79dcfd',
            width: 2
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#00d1fe'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#959595',
            type: 'dashed',
            opacity: 0.5
          }
        },
        axisPointer: {
          show: true,
          type: 'line',
          lineStyle: {
            color: '#959595',
            type: 'dashed',
            opacity: 0.5
          }
        }
      }
    ],
    xAxis : [
      {
        position: 'top',
        type : 'value',
        interval: 30,
        max: 210,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          fontSize: 14,
          color: '#fff'
        },
        splitLine: {
          show: false
        }
      }
    ],
    series : [
      {
        type:'bar',
        barWidth: '62%',
        itemStyle: {
          normal: {
            barBorderRadius: [0, 100, 100, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#00559d'
              },
              {
                offset: 1,
                color: '#0fa8d0'
              }
            ])
          }
        },
        data:[210, 200, 180, 120, 100, 70, 60, 50, 45, 40, 30, 10].reverse()
      }
    ]
  }
}