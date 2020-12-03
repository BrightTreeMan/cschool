<template>
  <div id='loginLog' v-cloak>
    <el-container>
      <el-main style='height: 76vh;padding:15px 0 0 0; '>
        <!-- 查询表单-->
        <el-col :span='24' class='searchForm'>
          <el-form :inline='true' :model='loginLogSearchForm' class='demo-form-inline'>
            <el-form-item label='登录用户' prop='userName'>
              <el-select v-model='loginLogSearchForm.userName' placeholder='请选择' :clearable='true'>
                <el-option v-for='user in userList' :key='user.userName' :label='user.nickName' :value='user.userName'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='登陆时间'>
              <el-date-picker v-model='loginLogSearchForm.scopeDate' type='datetimerange' :picker-options='pickerOptions' range-separator='至' start-placeholder='开始日期' end-placeholder='结束日期'>
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type='primary' icon='el-icon-search' @click='getLoginLogPage()'>查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 表体内容-->
        <el-table ref='multipleTable' :data='page.records' tooltip-effect='dark' border  >
          <el-table-column align='center' prop='loginLogId' label='日志ID' min-width='100'></el-table-column>
          <el-table-column align='center' prop='loginResult' label='结果' min-width='100'></el-table-column>
          <el-table-column align='center' prop='loginDesc' label='描述' min-width='300'></el-table-column>
          <el-table-column align='center' prop='loginIp' label='登录IP' min-width='100'></el-table-column>
          <el-table-column align='center' prop='nickName' label='登录用户' min-width='100'></el-table-column>
          <el-table-column align='center' label='登录时间' min-width='150'>
            <template slot-scope='scope'>{{ scope.row.loginDate | longToDateStr('yyyy-MM-dd hh:mm:ss') }}</template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer style='height: 7vh;padding: 0;'>
        <!--分页插件-->
        <el-col :span='24' class='toolbar'>
          <el-pagination  background layout='total,sizes,prev,pager,next,jumper' :total='page.total'
                          :page-size='page.size' :current-page='page.current'
                          @size-change='handleSizeChange' @current-change='handleCurrentChange'></el-pagination>
        </el-col>
      </el-footer>
    </el-container>

  </div>
</template>
<script>
export default {
  name: 'loginLog',
  data () {
    return {
      page: '',
      loginLogSearchForm: {
        userName: '',
        scopeDate: null
      },
      userList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    handleSizeChange: function (val) {
      const self = this
      self.getLoginLogPage(self.page.current, val)
    },
    handleCurrentChange: function (val) {
      const self = this
      self.getLoginLogPage(val, self.page.size)
    },
    init: function () {
      this.getLoginLogPage()
      this.getUserList()
    },
    getLoginLogPage: function (current, size) {
      const self = this
      current = current || 1
      size = size || 10
      let param = new URLSearchParams()
      param.append('current', current)
      param.append('size', size)
      param.append('userName', self.loginLogSearchForm.userName)
      param.append('startDate', self.loginLogSearchForm.scopeDate ? self.loginLogSearchForm.scopeDate[0].getTime() : '')
      param.append('endDate', self.loginLogSearchForm.scopeDate ? self.loginLogSearchForm.scopeDate[1].getTime() : '')
      const url = 'loginLog/loginLogPage'
      self.axios.post(url, param).then(function (response) {
        if (response.data.success) {
          self.page = response.data.data
        }
      })
    },
    getUserList: function () {
      const self = this
      const url = 'user/userList'
      self.axios.get(url).then(function (response) {
        if (response.data.success) {
          self.userList = response.data.data
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

</style>
