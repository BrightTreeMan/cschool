<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    beforeCreate () {
      document.querySelector('body').setAttribute('style', 'margin:0;padding:0 ;overflow:hidden;')
    }
  }


</script>

<style>
  /*防止抖动*/
  .el-popup-parent--hidden{
    padding-right:0 !important;
  }
</style>
