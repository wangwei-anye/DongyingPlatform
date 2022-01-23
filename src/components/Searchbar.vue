<template>
  <div class="v-searchbar" :style="{width: w}">
    <input type="text" v-model="searchtxt" class="v-searchbar__input" :placeholder="placeholder" @keyup.enter="search">
    <a class="v-searchbar__btn" @click="search"></a>
  </div>
</template>
<script>
export default {
  name: 'searchbar',
  props: {
    width: {
      type: [Number, String],
      default: 340
    },
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    }
  },
  data () {
    return {
      searchtxt: ''
    }
  },
  computed: {
    w () {
      return parseInt(this.width) + 'px'
    }
  },
  methods: {
    search () {
      this.$emit('searchHandler', this.searchtxt, this.clear);
    },
    clear () {
      this.searchtxt = ''
    }
  }
}
</script>
<style lang="scss">
.v-searchbar {
  display: inline-block;
  position: relative;
  height: 40px;
  background: rgba(28, 177, 255, .1);
  border: 1px solid #1cb1ff;
  vertical-align: middle;
  &__input{
    width: 100%;
    height: 100%;
    background: transparent !important;
    border: 0;
    outline: none;
    font-size: 16px;
    color: #fff;
    padding-left: 8px;
    padding-right: 38px;
    &:-ms-input-placeholder{
      color: #91d7fc;
    }
    &::-webkit-input-placeholder {
      color: #91d7fc;
    }
    &::-moz-placeholder {
      color: #91d7fc;
    }
  }
  &__btn{
    position: absolute;
    top: 0;
    right: 0;
    width: 38px;
    height: 38px;
    background: url(../assets/image/searchbar-icon.png) no-repeat center center;
  }
}
</style>


