<template>
  <v-chart-box hrefto="/index/estate" boxType='polygon' iconName='village' :w="355" :h="301" boxTitle="门禁数据">
    <div class="doordata-box">
      <table cellpadding="0" cellspacing="0">
        <colgroup>
          <col width="70">
          <col width="40">
          <col width="40">
          <col width="50">
          <col width="60">
          <col width="60">
          <col>
        </colgroup>
        <thead>
          <tr>
            <th>时间-日期</th>
            <th>用户名</th>
            <th>小区</th>
            <th>门禁ID</th>
            <th>开门情况</th>
            <th>开门方式</th>
            <th>照片</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>2018/04/26 14:36:07</td>
            <td><span class="ov">{{ item.user_name }}</span></td>
            <td><span class="ov">{{ item.unit_name }}</span></td>
            <td><span class="ov">{{ item.door_name }}</span></td>
            <td><span class="ov">{{ item.open_status | openStatusFilter }}</span></td>
            <td><span class="ov">{{ typeObj[item.open_door] }}</span></td>
            <td><img :src="item.picurl" alt=""></td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-chart-box>
</template>
<script>
import vChartBox from '@/components/ChartBox'
import http from '@/utils/http'

export default {
  name: 'doordata',
  data() {
    return {
      items: [],
      typeObj: {
        '1': '一键开门',
        '2': '自动开门',
        '3': '亮屏开门',
        '4': '摇一摇开门',
        '5': '人脸识别开门',
        '9': '按键开门',
        '10': '手机蓝牙开门',
        '11': '手机NFC开门',
        '12': '手机WIFI开门',
        '13': '刷IC卡开门',
        '15': '身份证开门',
        '21': '密码开门',
        '22': '呼叫远程开门'
      }
    }
  },
  computed: {
    queryParams() {
      return this.$store.getters['platform/queryParam']
    }
  },
  filters: {
    openStatusFilter(value) {
      if(value > 5) {
        return '成功'
      } else {
        return '失败'
      }
    }
  },
  methods: {
    getData() {
      http.get('/door/record.do?pageNo=1&pageSize=4&' + this.queryParams).then(res => {
        const data = res.data;
        this.items = data.items;
      })
    }
  },
  created() {
    this.getData();
  },
  watch: {
    queryParams() {
      this.getData();
    }
  },
  components: {
    vChartBox
  }
}
</script>
<style lang="scss" scoped>
.doordata-box{
  width: 100%;
  height: 100%;
  overflow: hidden;
  table{
    width: 100%;
    font-size: 12px;
    color:#fff;
    table-layout: fixed;
  }
  th{
    height: 35px;
    color: #1cb1ff;
    font-weight: normal;
    border-bottom: 1px solid #1cb1ff;
  }
  td{
    text-align: center;
    padding: 10px 0;
    img{
      width: 28px;
      height: 32px;
    }
  }
  tbody{
    tr:nth-of-type(even){
      background: #0a417d;
    }
  }
  .ov{
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>


