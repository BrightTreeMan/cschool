<template>
  <div id='error'>
    <el-row>
      <el-col :span='8' :offset='8' style='text-align: center;padding-top: 200px;'>
        <h3>{{$route.params.msg}}，{{count}}秒钟后将会为您自动跳转到登录页面...</h3>
        <h4>您也可以<el-button type='text' @click='goHome()'>直接跳转</el-button></h4>
      </el-col>

    </el-row>


  </div>
</template>
<script>
  export default {
    name: 'error',
    data () {
      return {
        count:9,
        timer:''
      }
    },
    methods:{
      countTime:function(){
        const self = this
        self.count --
        if(self.count == -1){
          clearInterval(self.timer)
          self.goHome()
        }
      },
      goHome:function(){
        const self = this
        self.$router.push('/')
      }
    },
    mounted:function(){
      this.timer = setInterval(this.countTime, 1000);
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
</script>

<style scoped>

</style>
