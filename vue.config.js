module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/ICS4U/Circuits/'
    : '/',
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/assets/styles/mixins.scss";`
      }
    }
  }
}
