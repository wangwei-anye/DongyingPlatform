<template>
  <v-chart-box hrefto="/index/estate" boxType='polygon' iconName='camera' :w="355" :h="301" boxTitle="实时监控">
    <div class="cameranow-box">
      <div class="hd">
        <div class="small-select">
          <span>派出所</span>
          <select>
            <option value="1">测试1</option>
            <option value="2">测试2</option>
            <option value="3">测试3</option>
          </select>
        </div>
        <div class="small-select">
          <span>小区</span>
          <select>
            <option value="1">测试1</option>
            <option value="2">测试2</option>
            <option value="3">测试3</option>
          </select>
        </div>
        <div class="small-select">
          <span>点位</span>
          <select>
            <option value="1">测试1</option>
            <option value="2">测试2</option>
            <option value="3">测试3</option>
          </select>
        </div>
      </div>
      <div class="bd">
        <div class="v"></div>
      </div>
    </div>
  </v-chart-box>
</template>
<script>
import vChartBox from '@/components/ChartBox'
export default {
  name: 'cameranow',
  components: {
    vChartBox
  }
}
</script>
<style lang="scss" scoped>
.cameranow-box{
  color: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .hd{
    margin: 10px 0 0;
    text-align: right;
    line-height: normal;
    padding-right: 26px;
    .small-select{
      margin-left: 5px;
    }
  }
  .bd{
    margin-top: 10px;
    .v{
      width: 340px;
      height: 216px;
      background: #0f5595;
      overflow: hidden;
      margin-left: 7px;
    }
  }
  .small-select{
    position: relative;
    display: inline-block;
    width: 66px;
    height: 20px;
    &:after{
      content: '';
      position: absolute;
      top: 8px;
      right: 6px;
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top-color: #009be3;
    }
    span{
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      line-height: 1.5;
      color: #fff;
      padding: 0 11px 0 6px;
      border: 1px solid #1f5a75;
      border-radius: 4px;
      overflow: hidden;
      text-align: left;
    }
    select{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      outline: none;
      opacity: 0;
    }
  }
}
</style>


