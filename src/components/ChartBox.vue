<!-- author: Tim -->
<template>
  <div class="chart-box" :style="chartBoxStyle">
    <div v-if="boxType === 'polygon'" class="polygon">
      <h3>
        <i class="icon" :style="iconStyle"></i>
        <span>{{ boxTitle }}</span>
        <router-link :to="hrefto" class="link"></router-link>
      </h3>
      <div class="slot" :style="slotStyle">
        <slot></slot>
      </div>
    </div>
    <div v-else-if="boxType === 'orthogon'" class="orthgon">
      <h3>
        <i class="icon" :style="iconStyle"></i>
        <i class="orthogon-left"></i><span class="orthogon-color-repeat">{{ boxTitle }}</span><i class="orthogon-middle"></i><i class="orthogon-border-repeat" :style="borderRepeatWidth"></i><i class="orthogon-right"></i>
        <router-link :to="hrefto" class="link"></router-link>
      </h3>
      <div class="slot" :style="slotStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
  var icons = {
    "village": {
      x: 365,
      y: 18
    },
    "house": {
      x: 423,
      y: 19
    },
    "people": {
      x: 481,
      y: 19
    },
    "ranking": {
      x: 549,
      y: 17
    },
    "volume_of_flow": {
      x: 310,
      y: 89
    },
    "prevent": {
      x: 367,
      y: 87
    },
    "patrol": {
      x: 424,
      y: 87
    },
    "special": {
      x: 483,
      y: 87
    },
    "alarm": {
      x: 549,
      y: 87
    },
    "car": {
      x: 28, 
      y: 240
    },
    "people_flow": {
      x: 99,
      y: 239
    },
    "park": {
      x: 171,
      y: 237
    },
    "chart": {
      x: 239, 
      y: 240
    },
    "camera": {
      x: 0,
      y: 300
    },
    "pview": {
      x: 30,
      y: 300
    },
    "vistor": {
      x: 70,
      y: 302
    }
  }

  export default {
    name: 'ChartBox',
    props: {
      boxType: {
        type: String,
        default: "polygon",
        required: true
      },
      iconName: {
        type: String,
        default: "people"
      },
      w: {
        type: Number,
        default: 100
      },
      h: {
        type: Number,
        default: 100
      },
      boxTitle: {
        type: String,
        default: '盒子标题'
      },
      hrefto: {
        type: String,
        default: '/index'
      }
    },
    data() {
      return {
        chartBoxStyle: {
          'width': this.w + 'px',
          'height': this.h + 'px'
        },
        slotStyle: {
          'height': this.h - 34 + 'px'
        },
        borderRepeatWidth: {
          'width': ''
        },
        iconStyle: {
          'background-position': (-icons[this.iconName].x + 'px ') + (-icons[this.iconName].y + 'px')
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .chart-box {
    > div {
      height: 100%;
      > h3 {
        position: relative; padding-left: 38px; width: 100%; height: 34px; line-height: 34px; text-align: left;
        span {
          color: #fff; font-size: 18px;
        }
        .icon {
          position: absolute; top: 6px; left: 8px; width: 22px; height: 22px; background: url(../assets/image/icons.png) -481px -19px;
        }
        .link {position: absolute; top: 8px; right: 10px; width: 20px; height: 20px; background: url(../assets/image/icons.png) -176px -21px;}
        .link:hover {background-position-y: -91px;}
      }
    }
    
    > .polygon {
      background-color: rgba(0, 115, 212, .1);
      > h3 {
        background-color: #1276b7;
      }
      > .slot {
        border: 1px solid #234a6b;
      }
    }

    > .orthgon {
      > h3 {
        display: flex; top: 1px; padding: 0;
        .orthogon-left {width: 11px; height: 33px; background: url(../assets/image/orthogon-left.png) no-repeat;}
        .orthogon-color-repeat {float: left; padding: 0 10px 0 27px; background: url(../assets/image/orthogon-color-repeat.png) repeat-x;}
        .orthogon-middle {width: 23px; height: 33px; background: url(../assets/image/orthogon-middle.png) no-repeat;}
        .orthogon-border-repeat {flex: auto; height: 33px; background: url(../assets/image/orthogon-border-repeat.png) repeat-x;}
        .orthogon-right {float: right; width: 11px; height: 33px; background: url(../assets/image/orthogon-right.png) no-repeat;}
      }
      > .slot {
        border: 1px solid #008dd7; background-color: rgba(0, 115, 212, .2);
      }
    }
  }
</style>
