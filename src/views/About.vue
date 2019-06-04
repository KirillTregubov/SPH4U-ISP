<template>
  <div id="about">
    <h1>Current Version: 1.0 release (alpha)</h1>
    <h1>Professor Circuit was created by <span>Kirill Tregubov</span>, and is the final project for his high school physics course (SPH4U)</h1>
  </div>
</template>

<style lang="scss" scoped>
span {
  color: var(--primary)
}
#about {
  @include container(var(--black));
  width: 90%;
  font-size: 0.75em;
  line-height: 3em;
  margin: 0 auto;
}

@media only screen and (max-width: 1019px) {
  #about {
     margin: 40px auto;
  }
}
</style>
