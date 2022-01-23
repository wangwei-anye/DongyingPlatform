<template>
  <div class="v-search">
    <a href="javascript:;" class="v-search__close" @click="close" v-show="!hiddenClose"></a>
    <div class="v-search__inputbox">
      <input type="text" class="v-search__input" :value="value" @input="input" :placeholder="placeholder">
    </div>
  </div>
</template>
<script>
export default {
  name: 'v-search',
  props: {
    value: {
      type: String,
      required: true
    },
    placeholder: {
      type: String
    },
    hiddenClose: {
      type: Boolean,
      default: true
    },
    closeHandler: {
      type: Function
    }
  },
  methods: {
    input (event) {
      this.$emit('input', event.target.value)
    },
    close () {
      this.closeHandler && this.closeHandler(123)
    }
  }
}
</script>
<style lang="scss">
.v-search{
  width: 100%;
  height: 100%;
  max-height: 40px;
  max-width: 600px;
  overflow: hidden;
}
.v-search__close{
  position: relative;
  float: left;
  height: 100%;
  width: 24px;
  background: url(../assets/image/search-close.png) no-repeat center center;
}
.v-search__inputbox{
  float: left;
  width: 100%;
  margin-left: -24px;
  height: 100%;
  padding-left: 40px;
}
.v-search__input{
  width: 100%;
  height: 100%;
  border: 1px solid #00aeff;
  border-radius: 6px;
  outline: none;
  background: transparent;
  font-size: 18px;
  padding: 0.5em;
}
</style>

