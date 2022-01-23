<template>
  <div class="business-box">
    <div class="hd">业务专项</div>
    <div class="bd">
      <ul>
        <li><i class="icon1"></i><a target="_blank" href="javascript:;">警务大数据系统</a></li>
        <li><i class="icon2"></i><a target="_blank" href="javascript:;">智能消防系统</a></li>
        <li><i class="icon3"></i><a target="_blank" href="javascript:;">E警通系统</a></li>
        <li><i class="icon4"></i><a target="_blank" href="javascript:;">三维码门牌系统</a></li>
        <li><i class="icon5"></i><a target="_blank" href="javascript:;">卡口系统</a></li>
        <li><i class="icon6"></i><a target="_blank" href="javascript:;">物流寄递系统</a></li>
        <li><i class="icon7"></i><a target="_blank" href="javascript:;">视频联网系统</a></li>
        <li><i class="icon8"></i><a target="_blank" href="javascript:;">老人帮扶系统</a></li>
        <li><i class="icon9"></i><a target="_blank" href="javascript:;">智能配电系统</a></li>
      </ul>
    </div>
  </div>
</template>
<script>
import vChartBox from '@/components/ChartBox'
export default {
  name: 'business'
}
</script>
<style lang="scss" scoped>
.business-box{
  width: 380px;
  height: 301px;
  background: rgba(0, 115, 212, 0.1);
  >.hd{
    height: 34px;
    line-height: 34px;
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    padding-left: 38px;
    background:#1276b7 url(../../assets/image/ibusiness-icon.png) no-repeat 8px 4px;
  }
  .bd {
    ul{
      margin-top: 10px;
      overflow: hidden;
      list-style: none;
    }
    i{
      display: inline-block;
      width: 22px;
      height: 22px;
      background: url(../../assets/image/ibusiness-icons.png) no-repeat;
      vertical-align: middle;
    }
    .icon1{
      background-position: 0 0;
    }
    .icon2{
      background-position: -30px 0;
    }
    .icon3{
      background-position: 0 -30px;
    }
    .icon4{
      background-position: -30px -30px;
    }
    .icon5{
      background-position: 0 -60px;
    }
    .icon6{
      background-position: -30px -60px;
    }
    .icon7{
      background-position: 0 -90px;
    }
    .icon8{
      background-position: -30px -90px;
    }
    .icon9{
      background-position: 0 -120px;
    }
    li{
      margin-top: 20px;
      margin-left: 25px;
      float: left;
      font-size: 12px;
      color: #fff;
      >a{
        display: inline-block;
        width: 114px;
        height: 24px;
        line-height: 24px;
        vertical-align: middle;
        border: 1px solid #009be3;
        border-radius: 6px;
        padding-left: 7px;
        background: rgba(0, 155, 227, 0.12) url(../../assets/image/ibusiness-arrow.png) no-repeat 95px center;
        margin-left: 12px;
        color: #fff;
      }
    }
  }
}
</style>