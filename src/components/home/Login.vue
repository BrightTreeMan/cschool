<template>
  <div id='login'>
    <el-form label-position='right' label-width='80px' :model='loginForm' class='login-container'>
      <el-form-item style='text-align:center'>
        <h1>测试系统</h1>
      </el-form-item>
      <el-form-item label='账户'>
        <el-input v-model.trim ='loginForm.userName' id='userName'></el-input>
      </el-form-item>
      <el-form-item label='密码'>
        <el-input v-model.trim='loginForm.password' :show-password='true' id='password'></el-input>
      </el-form-item>
      <el-form-item label='验证码'>
        <el-col :span='11'>
          <el-input v-model.trim='loginForm.code' id='code'></el-input>
        </el-col>
        <el-col :span='11' :offset='2'>
          <div >
            <el-image style='width:170px;height:40px;' :src='codeUrl' @click='getCode()' lazy></el-image>
          </div>
        </el-col>
      </el-form-item>
      <el-form-item style='text-align:center'>
        <el-button type='info' @click='reset()'>重置</el-button>
        <el-button type='primary' @click='login()'>登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      verifyCode: '',
      loginForm: {
        userName: '',
        password: '',
        code: ''
      },
      codeUrl:'',
      curTime: ''
    }
  },
  methods: {
    init:function(){
      const self = this
      self.curTime = new Date().getTime()
      self.codeUrl = self.axios.defaults.baseURL + 'authCodeImage/'+self.curTime
    },
    getCode:function(){
      const self = this
      self.curTime = new Date().getTime()
      self.codeUrl = self.axios.defaults.baseURL + 'authCodeImage/'+self.curTime
    },
    reset: function () {
      const self = this
      self.loginForm.code = ''
      self.loginForm.userName = ''
      self.loginForm.password = ''
    },
    login: function () {
      const self = this
      if (self.loginForm.userName === '') {
        self.$alert('请输入用户名', '提示')
        document.getElementById('userName').focus()
        return
      }
      if (self.loginForm.password === '') {
        self.$alert('请输入密码', '提示')
        document.getElementById('password').focus()
        return
      }
      if (self.loginForm.code === '') {
        self.$alert('请输入验证码', '提示')
        document.getElementById('code').focus()
        return
      }

      const url = 'login'
      let param = new URLSearchParams()
      param.append('userName', self.loginForm.userName)
      param.append('password', self.loginForm.password)
      param.append('code', self.loginForm.code)
      param.append('curTime', self.curTime)
      self.axios.post(url, param).then(function (response) {
        if (response.data.success) {
          if(response.data.data === '0'){
            window.sessionStorage.setItem('token', response.headers['x-auth-token'])
            window.sessionStorage.setItem('userName', self.loginForm.userName)
            self.$router.push('/home')
          }else if(response.data.data === '1'){
            self.$alert('账号或密码不正确', '提示')
            reset()
            self.getCode()
          }else if(response.data.data === '2'){
            self.$alert('验证码输入不正确', '提示')
            self.getCode()
            self.loginForm.code = ''
          }
        }
      })
    }

  },
  mounted: function () {
    this.init()
  }
}
</script>

<style scoped>
  .login-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -80%);
    width: 450px;
    padding: 35px 65px 35px 5px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
</style>
