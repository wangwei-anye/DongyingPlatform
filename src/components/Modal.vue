<template>
  <div class="v-modal" v-transfer-dom="'#app'" v-show="value" @click.self="close">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'v-modal',
  props: {
    value: Boolean,
    default: false
  },
  data () {
    return {

    }
  },
  methods: {
    close () {
      this.$emit('input', false);
      this.$emit('on-close');
    }
  }
}
</script>
<style>
.v-modal{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .4);
  z-index: 10;
}
</style>

