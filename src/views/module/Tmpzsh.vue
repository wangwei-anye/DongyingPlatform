<template>
  <div class="wrap">
    <div style="overflow: hidden;">
      <div class="div1">
        <component v-bind:is="div1View"></component>
      </div>
      <div class="div2">
        <component v-bind:is="div2View"></component>
      </div>
      <div class="div3">
        <component v-bind:is="div3View"></component>
      </div>
      <div class="div4">
        <component v-bind:is="div4View"></component>
      </div>
    </div>
    <div>
      <button @click="test1">加载1</button>
      <button @click="test2">加载2</button>
      <button @click="test3">加载3</button>
      <button @click="test4">加载4</button>
      <button @click="test">清除</button>
    </div>
  </div>
</template>
<script>
import Div1 from './Div1'
import Div2 from './Div2'
import Div3 from './Div3'
import Div4 from './Div4'
export default {
  name: 'tmpzsh',
  data () {
    return {
      div1View: '',
      div2View: '',
      div3View: '',
      div4View: ''
    }
  },
  components: {
    Div1,
    Div2,
    Div3,
    Div4
  },
  methods: {
    test1 () {
      this.div1View = 'Div4'
    },
    test2 () {
      this.div2View = 'Div2'
    },
    test3 () {
      this.div3View = 'Div3'
    },
    test4 () {
      this.div4View = 'Div4'
    },
    test () {
      this.div1View = this.div2View = this.div3View = this.div4View = ''
    }
  }
}
</script>
<style scoped>
.wrap{
  position: relative;
  width: 1024px;
  height: 768px;
  background: #eee;
  line-height: normal;
  font-size: 12px;
}
.wrap .div1, .wrap .div2, .wrap .div3, .wrap .div4{
  display: inline-block;
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  margin: 10px;
  line-height: normal;
  font-size: 12px;
}
</style>

