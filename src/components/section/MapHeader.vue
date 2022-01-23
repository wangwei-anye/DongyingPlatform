<template>
  <div class="map-header clear" :style="headerStyle">
    <div class="header-title fl" :style="titleStyle">{{ headerTitle }}</div>
    <router-link :to="{ path: '/index/tdmap' }" class="link"></router-link>
    
    <!-- <div class="fr">
      <span class="time">{{ time }}</span>
      <div class="week-YMD fr">
        <span>{{ week }}</span><br>
        <span>{{ YMD }}</span>
      </div>
    </div> -->
  </div>
</template>

<script>
  export default {
    name: 'MapHeader',
    props: {
      headerTitle: {
        type: String,
        required: true
      },
      headerWidth: {
        type: String,
        default: '697px'
      },
      headerHeight: {
        type: String,
        default: '46px'
      }
    },
    data() {
      return {
        time: '',
        week: '',
        YMD: '',
        headerStyle: {
          width: this.headerWidth,
          height: this.headerHeight
        },
        titleStyle: {
          height: this.headerHeight,
          'line-height': this.headerHeight
        }
      }
    },
    created() {
      this.formatTime(this.getCurrentTime());
      setInterval(() => {
        this.formatTime(this.getCurrentTime());
      }, 1000)
    },
    methods: {
      getCurrentTime() {
        let date = new Date,
            Y, M, D, h, m, s, w,
            weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

        Y = date.getFullYear().toString();
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1).toString();
        D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()).toString();
        h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours().toString());
        m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString());
        s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds().toString()); 
        w = weekArr[date.getDay()];

        return {Y: Y, M: M, D: D, h: h, m:m, s:s, w: w};
      },
      formatTime(now) {
        this.time = now.h + ':' + now.m;
        this.week = now.w;
        this.YMD = now.Y + '/' + now.M + '/' + now.D;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .map-header {
    position: relative;
    border: 1px solid #1cb1fc; background-color: rgba(28, 177, 255, .6);
    .header-title {padding-left: 17px; font-size: 18px; color: #fff;}
    .time {font-size: 30px; color: #fff;}
    .week-YMD {margin: 7% 10px 0; height: 12px; line-height: 12px; font-size: 12px; color: rgba(255, 255, 255, .5);}

    .link{
        position: absolute;
        top: 8px;
        right: 12px;
        width: 20px;
        height: 20px;
        background: url(/static/img/icons.1ee1679.png) -176px -21px;
    }
  } 
  
</style>
