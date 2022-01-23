<template>
  <div class="camerapoint">
    <div class="small-select">
      <span>{{ curPoliceName }}</span>
      <select :value="curPoliceId" @input="policeChange">
        <option v-for="(item, index) in polices" :value="item.id">{{ item.name }}</option>
      </select>
    </div>
    <div class="small-select">
      <span>{{ curUnitName }}</span>
      <select :value="curUnitId" @input="unitChange">
        <option v-for="(item, index) in units" :value="item.id">{{ item.name }}</option>
      </select>
    </div>
    <div class="small-select">
      <span>{{ curPoint }}</span>
      <select :value="curPoint" @input="pointChange">
        <option v-for="(item, index) in points" :value="item">{{ item }}</option>
      </select>
    </div>
  </div>
</template>

<script>
import http from '@/utils/http'
export default {
  name: 'camerapoint',
  props: {
    onChange: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      curPoliceId: '',
      polices: [],
      curUnitId: '',
      units: [],
      curPoint: '',
      points: [],
    }
  },
  computed: {
    queryParam() {
      return this.$store.getters['platform/queryParam']
    },
    accountType() {
      // 0：超级用户  1：省级  2：市级  3：区县级 4:管辖区  6:小区 7:派出所
      return this.$store.state.global.accountInfo.rolePermission.roleType.level
    },
    curPoliceName() {
      const p = this.polices.find(item => item.id === this.curPoliceId);
      return p && p.name;
    },
    curUnitName() {
      const u = this.units.find(item => item.id === this.curUnitId);
      return u && u.name;
    }
  },
  methods: {
    policeChange(e) {
      this.curPoliceId = e.target.value;
      this.getUnits(this.curPoliceId);
    },
    unitChange(e) {
      this.curUnitId = e.target.value;
      this.getPoints(this.curUnitId);
    },
    pointChange(e) {
      this.curPoint = e.target.value;
      this.onChange && this.onChange(this.curPoint);
    },
    getPolices() {
      return new Promise((resolve, reject) => {
        if(this.accountType === 7) {
          console.log('派出所帐号特殊处理');
        } else {
          http.get('/account/rolePermissionManager/selectPoliceS.do?'+this.queryParam).then(res => {
            const data = res.data;
            if(data.success === true) {
              this.polices = data.data.map(item => ({id: item.id, name: item.police_station}));
              this.curPoliceId = this.polices[0] && this.polices[0].id;
              resolve(this.curPoliceId);
            }
          })
        }
      });
    },
    getUnits(pid) {
      return new Promise((resolve, reject) => {
        http.get('/account/rolePermissionManager/selectUnitByPolice.do?police_code=' + pid).then(res => {
          const data = res.data;
          if(data.success === true) {
            this.units = data.data.map(item => ({id: item.unit_id, name: item.name}));
            this.curUnitId = this.units[0] && this.units[0].id;
            resolve(this.curUnitId);
          }
        })
      });
    },
    getPoints(uid) {
      return new Promise((resolve, reject) => {
        http.get('/camera/searchCameraIdsByUnit.do?unit_id=' + uid).then(res => {
          const data = res.data;
          this.points = data;
          this.curPoint = this.points[0] && this.points[0];
          resolve(this.curPoint);
        })
      });
    },
    initList() {
      this.getPolices()
        .then(pid => this.getUnits(pid))
        .then(uid => this.getPoints(uid))
        .then(cid => {
          this.onChange && this.onChange(cid);
        })
        .catch((err) => console.error(err));
    }
  },
  mounted() {
    this.initList();
  }
}
</script>

<style lang="scss" scoped>
.camerapoint{
  display: inline-block;
  .small-select{
    margin-left: 5px;
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
    text-overflow: ellipsis;
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
</style>

  