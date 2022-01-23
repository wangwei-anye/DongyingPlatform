<template>
  <v-chart-box hrefto="/index/estate" boxType='polygon' iconName='pview' :w="355" :h="301" boxTitle="门禁抓拍">
    <div class="doorphoto-box">
      <div class="hd">
        <v-cameraPoint :on-change="getPic"></v-cameraPoint>
      </div>
      <div class="bd">
        <div class="photo-box" v-for="item in pics">
          <img :src="getPicUrl(item.original_pic)" alt="">
          <p>09:44:28</p>
        </div>
      </div>
    </div>
  </v-chart-box>
</template>
<script>
import vChartBox from '@/components/ChartBox'
import http from '@/utils/http'
import { imgServerAddr } from '@/config'
import vCameraPoint from './CameraPoint'
export default {
  name: 'doorphoto',
  data() {
    return {
      pics: []
    }
  },
  methods: {
    getPic(cid) {
      return new Promise((resolve, reject) => {
        http.get('/camera/searchPic.do?camera_id=' + cid).then(res => {
          const data = res.data;
          this.pics = data;
          resolve();
        })
      })
    },
    getPicUrl(md5) {
      return imgServerAddr + '/' + md5 + '?p=0';
    }
  },
  components: {
    vChartBox,
    vCameraPoint
  },
  created() {
    // this.getPolices();
    // this.getPoints(3888);
  }
}
</script>
<style lang="scss" scoped>
.doorphoto-box{
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #fff;
  .hd{
    margin: 10px 0 0;
    text-align: right;
    line-height: normal;
    padding-right: 26px;
  }
  .bd{
    overflow: hidden;
    padding-left: 15px;
    .photo-box{
      float: left;
      position: relative;
      margin: 10px 10px 0;
      width: 87px;
      height: 102px;
      >img{
        width: 100%;
        height: 100%;
      }
      >p{
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 20px;
        padding-left: 30px;
        color: #b4bac3;
        line-height: 20px;
        background: rgba(0,0,0,.5) url(../../assets/image/doorphoto-icon.png) no-repeat 5px center;
      }
    }
  }
}
</style>


