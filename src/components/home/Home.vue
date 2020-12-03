<template>
  <div id='home'>
    <!-- 头部 -->
    <el-row>
      <el-col :span='24' class='header'>
        <el-col :span='20' >
          <div style='display: inline-block' :class='collapsed?"logo-collapse-width":"logo-width"'>
            {{collapsed?'&nbsp;':'欢迎使用测试系统'}}
          </div>
          <div style='display: inline-block'>
            <i class='el-icon-s-fold' @click='changeCollapsed()'></i>
          </div>
        </el-col>
        <el-col :span='3' class='user-info'>
          <el-dropdown style='vertical-align: middle;font-size: 16px;' trigger='click' @command='handleCommand'>
            <span class='el-dropdown-link'>
<!--              <i class='el-icon-user-solid'></i>-->
              <el-avatar  style='vertical-align: middle;' :size='22' :src='circleUrl'></el-avatar>
              &nbsp;{{userName}}
              <i class='el-icon-arrow-down'></i>
            </span>
            <el-dropdown-menu slot='dropdown' placement='bottom'>
              <el-dropdown-item command='changePwd'>修改密码</el-dropdown-item>
<!--              <el-dropdown-item command='setting'>设置</el-dropdown-item>-->
              <el-dropdown-item command='logout'>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span='1'></el-col>
      </el-col>
    </el-row>

    <el-row>
      <el-container>
        <!--菜单栏-->
        <el-aside  :width='collapsed?"66px":"230px"' style='background-color: #09192A;'>
          <el-menu style='height: 100%;' background-color='#09192A' text-color='#838CA1' active-text-color='#fff' :default-active='selectMenuId' :collapse='collapsed' :collapse-transition='false'>
            <el-submenu :index='""+menu.menuId' v-for='(menu,index) in menuList' :key='menu.menuId'>
              <template slot='title'>
                <i :class='menu.iconType'></i>
                <span>{{menu.menuName}}</span>
              </template>
              <el-menu-item @click='openTab(menu3)' :index='""+menu3.menuId' v-for='(menu3,index3) in menu.level3MenuList' :key='menu3.menuId'>
                <i :class='menu3.iconType'></i>
                <span>{{menu3.menuName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!--主要内容区-->
        <el-main>
<!--          tab页-->
          <el-tabs  :tab-position='tabPosition' v-model='editableTabsValue' type='card' @tab-click='changeTab' @tab-remove='removeTab'>
            <el-tab-pane v-for='(item, index) in editableTabs' :key='item.name' :label='item.title' :name='item.name' :closable='item.closable' :title='item.content'></el-tab-pane>
          </el-tabs>
              <router-view v-if='routerState'></router-view>
        </el-main>
      </el-container>
    </el-row>

    <!--修改密码-->
    <el-dialog title='修改密码' :visible.sync='changePwdVisible' :show-close='false' :close-on-click-modal='false'>
      <el-form :model='changePwdForm' :rules='changePwdRules' label-position='right' label-width='80px' ref='changePwdForm'>
        <el-form-item label='原密码' prop='oldPassword'>
          <el-input v-model='changePwdForm.oldPassword' autocomplete='off' :show-password='true'></el-input>
        </el-form-item>
        <el-form-item label='修改密码' prop='password'>
          <el-input v-model='changePwdForm.password' autocomplete='off' :show-password='true'></el-input>
        </el-form-item>
        <el-form-item label='重复密码' prop='rePassword'>
          <el-input v-model='changePwdForm.rePassword' autocomplete='off' :show-password='true'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='cancelChange()'>取消</el-button>
        <el-button type='info' @click='resetChange()'>重置</el-button>
        <el-button type='primary' @click='submitChange()'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'home',
    data () {
      const checkPass = (rule, value, callback) => {
        const self = this
        if(self.changePwdForm.rePassword!=''){
          self.$refs.changePwdForm.validateField('rePassword')
        }
        callback()
      }
      const checkRePass = (rule, value, callback) => {
        const self = this
        if(self.changePwdForm.password!=''){
          if(self.changePwdForm.password != self.changePwdForm.rePassword){
            callback(new Error('两次输入的密码不一样，请修改!'))
          }
        }
        callback()
      }

      return {
        tabPosition:'bottom',
        transitionName:'',
        selectMenuId:'',
        menuList:[],
        collapsed:false,
        editableTabs:[],
        userName:'',
        editableTabsValue: '2',
        changePwdVisible:false,
        changePwdForm:{
          oldPassword:'',
          password:'',
          rePassword:''
        },
        changePwdRules:{
          oldPassword:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
            { validator: checkPass, trigger: 'blur' }
          ],
          rePassword:[
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
            { validator: checkRePass, trigger: 'blur' }
          ],
        },
        circleUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        routerState:true
      }
    },
    methods:{
      reload:function(){
        const self = this
        self.routerState = false
        self.$nextTick(() => {
          self.routerState = true
        })
      },
      init:function(){
        const self = this
        if(!window.sessionStorage.getItem('token')){
          self.$router.push({name:'/err',params:{msg:'登录状态已失效'}})
          return
        }
        //获取菜单
        self.userName = window.sessionStorage.userName
        self.getMenuList()
        //增加首页选项卡
        const option={
          name:'0',
          title:'首页',
          content:'/welcome',
          closable:false
        }
        self.addTab(option)
      },
      changeCollapsed:function(){
        const self = this
        self.collapsed = !self.collapsed

      },
      getMenuList:function(){
        const self = this
        const url = 'menu/menuList/'+self.userName
        self.axios.get(url).then(function(response){
          if (response.data.success) {
            self.menuList = response.data.data
          }
        })
      },
      addTab:function(option) {
        const self = this
        self.editableTabs.push(option)
        self.editableTabsValue = option.name
        self.$router.push({path:option.content})
      },
      openTab:function(menu){
        const self = this
        //保存激活的菜单值
        self.selectMenuId = '' + menu.menuId
        const option = {
          title: menu.menuName,
          name: '' +menu.menuId,
          closable:true,
          content:menu.url
        }
        let flag = false
        self.editableTabs.forEach(function(item){
          if(item.title == option.title){
            flag = true
          }
        })
        if(flag){
          //已存在,跳转 同一个的话刷新
          if(self.$route.path === option.content){
            self.reload()
          }else{
            self.editableTabsValue = option.name
            self.$router.push({path:option.content})
          }
        }else{
          //不存在,新建
          self.addTab(option)
        }
      },
      changeTab:function(tab,event){
        const self = this
        self.selectMenuId = ''+event.target.getAttribute('id').split('-')[1]
        const content = document.getElementById('pane-'+self.selectMenuId).getAttribute('title')
        if(self.$route.path === content){
          self.reload()
        }else{
          self.$router.push(document.getElementById('pane-'+self.selectMenuId).getAttribute('title'));
        }
      },
      removeTab:function(targetName) {
        const self = this
        let tabs = self.editableTabs
        let activeName = self.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach(function(item, index){
            if (item.name == targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
                self.selectMenuId =activeName
                self.$router.push(document.getElementById('pane-'+self.selectMenuId).getAttribute('title'));
              }
            }
          })
        }

        self.editableTabsValue = activeName
        self.editableTabs = tabs.filter(function(item){
          return item.name != targetName
        })
      },
      handleCommand:function(command){
        const self = this
        if('logout' === command){
          window.sessionStorage.removeItem('token')
          window.sessionStorage.removeItem('userName')
          self.$router.push('/')
        }else if('changePwd' === command){
          self.changePwdVisible = true
        }
      },
      resetChange:function(){
        this.$refs['changePwdForm'].resetFields()
      },
      cancelChange:function(){
        const self = this
        self.resetChange()
        self.changePwdVisible = false
      },
      submitChange:function(){
        const self = this
        const url = 'user/changePwd/' + self.userName + '/' + self.changePwdForm.password + '/' + self.changePwdForm.oldPassword
        self.$refs['changePwdForm'].validate(function(valid) {
          if (valid) {
            self.axios.put(url).then(function(response){
              if(response.data.success){
                if(response.data.data === 0){
                  self.changePwdVisible = false
                  self.resetChange()
                  self.$alert('密码修改成功，请使用新密码重新登陆本系统','提示',{
                    callback:action => {
                      window.sessionStorage.removeItem('token')
                      window.sessionStorage.removeItem('userName')
                      self.$router.push('/')
                    },
                  })
                }else{
                  self.$alert('原密码不正确，请修改','提示')
                }
              }
            })
          } else {
            return false
          }
        })
      },
    },
    mounted:function(){
      this.init()
    }
  }
</script>

<style scoped>
  .logo-width{
    width:229px !important;
    border-color: rgba(238,241,146,0.3);
    border-right-width: 1px;
    border-right-style: solid;
    text-align:center;
    padding: 20px 0;
  }
  .logo-collapse-width{
    width:65px !important;
    border-color: rgba(238,241,146,0.3);
    border-right-width: 1px;
    border-right-style: solid;
    padding: 20px 0;
  }
  .header{
    background: #09192A;
    color:#fff;
    font-size: 22px;

  }
  .user-info {
    text-align: right;
    padding: 20px 0;
  }

  .user-info span {
    color:#E3E6ED;
  }

  .blink{
    animation: blink 1s linear infinite;
    /* 其它浏览器兼容性前缀 */
    -webkit-animation: blink 1s linear infinite;
    -moz-animation: blink 1s linear infinite;
    -ms-animation: blink 1s linear infinite;
    -o-animation: blink 1s linear infinite;
  }
  @-webkit-keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 1; }
    50.01% { opacity: 0; }
    100% { opacity: 0; }
  }
</style>
