<template>
  <div class="home">
    <!-- <h1>Circuit Professor</h1> -->
   <div id="mobile-warning">
      <h1>This website doesn't work on mobile! Please open it on a desktop computer.</h1>
    </div>
    <DisplayArea/>
  </div>
</template>

<script>
import DisplayArea from '@/components/DisplayArea.vue'

export default {
  name: 'Home',
  components: {
    DisplayArea
  }
}
</script>

<style lang="scss">
#mobile-warning {
  width: 70%;
  font-size: 1em;
  margin: 0 auto;
}

@media only screen and (min-width: 1020px) {
  #mobile-warning {
    display: none;
  }
}
</style>
