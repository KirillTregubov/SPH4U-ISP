<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 298 298"
    enable-background="new 0 0 298 298"
    :width="size"
    :height="size"
    :style="style">
    <slot></slot>
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: [Number, String],
      default: 75
    },
    color: {
      type: String,
      default: 'white'
    }
  },
  computed: {
    style: function () {
      return {
        fill: 'var(--' + this.color + ')'
      }
    }
  }
}
</script>
