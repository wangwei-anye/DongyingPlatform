<template>
  <div class="appcenter-box">
    <div class="appcenter-box__hd">
      <h3>应用中心</h3>
      <a href="javascript:;" @click="close">&times;</a>
    </div>
    <div class="appcenter-box__bd">
      <ul>
        <li v-for="(item, index) in appDatas" @click="addComponent(item)">
          <i><img :src="require('../assets/image/appcenter-' + item.value + '.png')" alt=""></i>
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'appcenter',
  computed: {
    appDatas () {
      return this.$store.state.editmode.appDatas;
    }
  },
  methods: {
    close () {
      this.$emit('on-close')
    },
    addComponent (item) {
      this.$emit('on-selected', item);
    }
  },
  mounted () {
    // console.log(this.appDatas)
  }
}
</script>
<style lang="scss" scoped>
.appcenter-box{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 808px;
  height: 614px;
  background: url(../assets/image/appcenter-box.png) no-repeat 0 0;
  background-size: 100% 100%;
  &__hd{
    position: relative;
    overflow: hidden;
    >h3{
      font-size: 18px;
      color: #4fc7ff;
      text-align: center;
      line-height: normal;
      margin-top: 40px;
    }
    >a{
      position: absolute;
      top: 5px;
      right: 25px;
      color: #fff;
      font-size: 48px;
    }
  }
  &__bd{
    margin-top: 35px;
    ul{
      width: 690px;
      overflow: hidden;
      list-style: none;
      margin-left: 50px;
    }
    li{
      float: left;
      width: 114px;
      height: 136px;
      border: 1px solid #2a7fce;
      margin-left: 24px;
      margin-bottom: 24px;
      cursor: pointer;
      >i{
        display: flex;
        width: 100%;
        height: 112px;
        overflow: hidden;
        justify-content: center;
        align-items: center;
      }
      >p{
        position: relative;
        height: 24px;
        line-height: 23px;
        border-top: 1px solid #2a7fce;
        color: #fff;
        font-size: 12px;
        background: rgba(10, 95, 174, .48) url(../assets/image/appcenter-icon-add.png) no-repeat 92px center;
        padding: 0 5px;
      }
    }
  }
}
</style>


      
