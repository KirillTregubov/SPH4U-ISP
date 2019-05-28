<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
  >
    <Remove v-if="name === 'remove'"></Remove>
    <Add v-else-if="name === 'add'"></Add>
    <Both v-else></Both>
  </svg>
</template>

<script>
import Add from '@/components/icons/Add.vue'
import Remove from '@/components/icons/Remove.vue'
import Both from '@/components/icons/Both.vue'

export default {
  props: {
    size: {
      type: [Number, String],
      default: 25
    },
    name: {
      type: String,
      default: ''
    }
  },
  components: {
    Add,
    Remove,
    Both
  }
}
</script>

<style lang="scss">
.primary {
  fill: var(--white);
}

.secondary {
  fill: var(--black);
}
</style>
