<template>
  <div class="index-wrapper" :class="component == null && editmodeStatus === 'custom' && 'custom'">
    <div class="comp" v-show="component != null">
      <component :data="data" :is="component"></component>
    </div>
    <div class="bg" v-show="component == null">
      <div class="hd"></div>
      <div class="bd" @click="add" v-show="editmodeStatus === 'editing'"></div>
    </div>
    <a href="javascript:;" class="close" @click="close" v-show="editmodeStatus === 'editing' && component != null"></a>
  </div>
</template>
<script>
export default {
  name: 'indexWrap',
  props: {
    component: {
      type: null,
      required: true
    },
    data: {
      type: null
    }
  },
  data () {
    return {

    }
  },
  computed: {
    editmodeStatus () {
      return this.$store.state.editmode.status;
    }
  },
  methods: {
    add() {
      this.$emit('on-add');
    },
    close(){
      this.$emit('on-close');
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrapper{
  position: relative;
  width: 355px;
  height: 301px;
  overflow: hidden;
  &.custom{
    border: 1px solid #234a6b;
    background: url(../assets/image/index-custom-bg.png) no-repeat center center;
  }
  .bg{
    position: relative;
    z-index: 3;
    >.hd{
      height: 34px;
      background: #1276b7;
    }
    >.bd{
      height: 267px;
      background: rgba(0, 115, 212, .1);
      border: 1px solid #234a6b;
      border-top: 0;
      box-sizing: border-box;
      background: url(../assets/image/indexwrap-add.png) no-repeat center center;
      cursor: pointer;
    }
  }
  .comp{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  >.close{
    position: absolute;
    top: 5px;
    right: 9px;
    width: 24px;
    height: 24px;
    background: #1276b7 url(../assets/image/indexwrap-close.png) no-repeat center center;
    z-index: 3;
  }
}
</style>

