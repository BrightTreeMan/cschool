<template>
  <div id='sysLog' v-cloak>
    <el-container>
      <el-main style='height: 76vh;padding:15px 0 0 0; '>
        <!-- 查询表单-->
        <el-col :span='24' class='searchForm'>
          <el-form :inline='true' :model='sysLogSearchForm' class='demo-form-inline'>
            <el-form-item label='操作用户' prop='userName'>
              <el-select v-model='sysLogSearchForm.userName' placeholder='请选择' :clearable='true'>
                <el-option v-for='item in userList' :key='item.userName' :label='item.nickName' :value='item.userName'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='操作类型' prop='userName'>
              <el-select v-model='sysLogSearchForm.operation' placeholder='请选择' :clearable='true'>
                <el-option v-for='item in operationList' :key='item.operation' :label='item.operation' :value='item.operation'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='操作时间'>
              <el-date-picker v-model='sysLogSearchForm.scopeDate' type='datetimerange' :picker-options='pickerOptions' range-separator='至' start-placeholder='开始日期' end-placeholder='结束日期'>
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type='primary' icon='el-icon-search' @click='getSysLogPage()'>查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 表体内容-->
        <el-table ref='multipleTable' :data='page.records' tooltip-effect='dark' >
          <el-table-column align='center' prop='sysLogId' label='日志ID' min-width='100'></el-table-column>
          <el-table-column align='center' prop='operation' label='操作类型' min-width='100'></el-table-column>
          <el-table-column align='center' prop='operationResult' label='操作结果' min-width='100'></el-table-column>
          <el-table-column align='center' prop='operationDesc' label='描述' min-width='300'></el-table-column>
          <el-table-column align='center' prop='ip' label='操作IP' min-width='100'></el-table-column>
          <el-table-column align='center' prop='nickName' label='操作用户' min-width='100'></el-table-column>
          <el-table-column align='center' label='操作时间' min-width='150'>
            <template slot-scope='scope'>{{ scope.row.date | longToDateStr('yyyy-MM-dd hh:mm:ss') }}</template>
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
  name: 'sysLog',
  data () {
    return {
      page: '',
      sysLogSearchForm: {
        userName: '',
        operation: '',
        scopeDate: null
      },
      userList: [],
      operationList: [],
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
      self.getSysLogPage(self.page.current, val)
    },
    handleCurrentChange: function (val) {
      const self = this
      self.getSysLogPage(val, self.page.size)
    },
    init: function () {
      this.getSysLogPage()
      this.getUserList()
      this.getOperationList()
    },
    getSysLogPage: function (current, size) {
      const self = this
      current = current || 1
      size = size || 10
      let param = new URLSearchParams()
      param.append('current', current)
      param.append('size', size)
      param.append('userName', self.sysLogSearchForm.userName)
      param.append('startDate', self.sysLogSearchForm.scopeDate ? self.sysLogSearchForm.scopeDate[0].getTime() : '')
      param.append('endDate', self.sysLogSearchForm.scopeDate ? self.sysLogSearchForm.scopeDate[1].getTime() : '')
      param.append('operation', self.sysLogSearchForm.operation)
      const url = 'sysLog/sysLogPage'
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
    },
    getOperationList: function () {
      const self = this
      const url = 'sysLog/operationList'
      self.axios.get(url).then(function (response) {
        if (response.data.success) {
          self.operationList = response.data.data
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
