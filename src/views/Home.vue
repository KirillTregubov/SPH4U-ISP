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
  @include container(var(--black));
  width: 90%;
  font-size: 0.75em;
  line-height: 3em;
  margin: 40px auto;
}

@media only screen and (min-width: 1019px) {
  #mobile-warning {
    display: none;
  }
}
</style>
