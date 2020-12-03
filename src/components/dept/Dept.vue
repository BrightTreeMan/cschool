<template>
  <div id='dept' v-cloak>
    <el-container>
      <el-main style='height: 76vh;padding:15px 0 0 0; '>
        <!-- 查询表单-->
        <el-col :span='24' class='searchForm'>
          <el-form :inline='true' :model='deptSearchForm' class='demo-form-inline'>
            <el-form-item label='部门ID'>
              <el-input v-model='deptSearchForm.deptId' placeholder='部门ID'></el-input>
            </el-form-item>
            <el-form-item label='部门名称'>
              <el-input v-model='deptSearchForm.deptName' placeholder='部门名称'></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type='primary' icon='el-icon-search' @click='getDeptPage()'>查询</el-button>
              <el-button type='primary' icon='el-icon-document-add' @click='deptAdd()'>新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 表体内容-->
        <el-table ref='multipleTable' :data='page.records' tooltip-effect='dark' border >
          <el-table-column align='center' prop='deptId' label='部门ID' min-width='80'></el-table-column>
          <el-table-column align='center' prop='deptName' label='部门名称' min-width='200'></el-table-column>
          <el-table-column align='center' prop='parentDeptId' label='上级部门ID' min-width='80'></el-table-column>
          <el-table-column align='center' prop='parentDeptName' label='上级部门名称' min-width='200'></el-table-column>
          <el-table-column align='center' prop='addUserName' label='创建人' min-width='80'></el-table-column>
          <el-table-column align='center' label='创建日期' min-width='100'>
            <template slot-scope='scope'>{{ scope.row.addDate | longToDateStr('yyyy-MM-dd hh:mm:ss') }}</template>
          </el-table-column>
          <el-table-column align='center' prop='modUserName' label='修改人' min-width='80'></el-table-column>
          <el-table-column align='center' label='修改日期' min-width='100'>
            <template slot-scope='scope'>{{ scope.row.modDate | longToDateStr('yyyy-MM-dd hh:mm:ss') }}</template>
          </el-table-column>
          <el-table-column align='center' label='操作' min-width='100'>
            <template slot-scope='scope'>
              <el-button type='text' icon='el-icon-edit' @click='deptEdit(scope.row)'>编辑</el-button>
              <el-button type='text' icon='el-icon-delete' @click='deptDel(scope.row)'>删除</el-button>
            </template>
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

    <!--新增表单-->
    <el-dialog title='新增部门' :visible.sync='deptAddVisible' :show-close='false' :close-on-click-modal='false'>
      <el-form :model='deptAddForm' :rules='deptAddRules' label-position='right' label-width='80px' ref='deptAddForm'>
        <el-row>
          <el-col :span='10' :offset='1'>
            <el-form-item label='部门ID' prop='deptId'>
            <el-input v-model.trim='deptAddForm.deptId' autocomplete='off'></el-input>
          </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='部门名称' prop='deptName'>
              <el-input v-model.trim='deptAddForm.deptName' autocomplete='off'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='上级部门' prop='parentDeptId'>
              <el-select v-model='deptAddForm.parentDeptId' placeholder='请选择' :clearable='true' style='width: 100%;' @change='handleOrderAdd'>
                <el-option v-for='item in deptList' :key='item.deptId' :label='item.deptName' :value='item.deptId' ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='排序等级' prop='listOrder'>
              <el-input-number v-model='deptAddForm.listOrder' style='width: 100%;' :min='1' :max='20' label='排序等级'></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='cancelAdd()'>取消</el-button>
        <el-button type='info' @click='resetAdd()'>重置</el-button>
        <el-button type='primary' @click='submitAdd()'>确定</el-button>
      </div>
    </el-dialog>

    <!--修改表单-->
    <el-dialog title='修改部门' :visible.sync='deptEditVisible' :show-close='false' :close-on-click-modal='false'>
      <el-form :model='deptEditForm' :rules='deptEditRules' label-position='right' label-width='80px' ref='deptEditForm'>
        <el-row>
          <el-col :span='10' :offset='1'>
            <el-form-item label='部门ID' prop='deptId'>
              <el-input v-model='deptEditForm.deptId' autocomplete='off' :readonly='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='部门名称' prop='deptName'>
              <el-input v-model.trim='deptEditForm.deptName' autocomplete='off'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='上级部门' prop='parentDeptId'>
              <el-select v-model='deptEditForm.parentDeptId' placeholder='请选择' :clearable='true' style='width: 100%;' @change='handleOrderEdit'>
                <el-option v-for='item in deptList' :key='item.deptId' :label='item.deptName' :value='item.deptId' ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='排序等级' prop='listOrder'>
              <el-input-number v-model='deptEditForm.listOrder' style='width: 100%;' :min='1' :max='20' label='排序等级'></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='cancelEdit()'>取消</el-button>
        <el-button type='info' @click='resetEdit()'>重置</el-button>
        <el-button type='primary' @click='submitEdit()'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'dept',
  data () {
    const deptCheck = (rule, value, callback) => {
      const self = this
      const url = 'dept/deptCheck/' + value
      self.axios.get(url).then(function (response) {
        if (response.data.success) {
          if (response.data.data === 0) {
            callback(new Error('部门ID已存在，请更换!'))
          } else {
            callback()
          }
        }
      })
    }
    return {
      page: '',
      deptList: [],
      deptSearchForm: {
        deptId: '',
        deptName: ''
      },
      deptAddVisible: false,
      deptAddForm: {
        deptId: '',
        deptName: '',
        parentDeptId: '',
        listOrder: ''
      },
      deptAddRules: {
        deptId: [
          { required: true, message: '请输入部门ID', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          { validator: deptCheck, trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        parentDeptId: [

        ],
        listOrder: [

        ]
      },
      deptEditForm: {
        deptId: '',
        deptName: '',
        parentDeptId: '',
        listOrder: ''
      },
      deptEditRules: {
        deptId: [
        ],
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        parentDeptId: [

        ],
        listOrder: [

        ]
      },
      deptEditVisible: false
    }
  },
  methods: {
    handleSizeChange: function (val) {
      const self = this
      self.getDeptPage(self.page.current, val)
    },
    handleCurrentChange: function (val) {
      const self = this
      self.getDeptPage(val, self.page.size)
    },
    init: function () {
      this.getDeptPage()
      this.getDeptList()
    },
    getDeptPage: function (current, size) {
      const self = this
      current = current || 1
      size = size || 10
      let param = new URLSearchParams()
      param.append('current', current)
      param.append('size', size)
      param.append('deptId', self.deptSearchForm.deptId)
      param.append('deptName', self.deptSearchForm.deptName)
      const url = 'dept/deptPage'
      self.axios.post(url, param).then(function (response) {
        if (response.data.success) {
          self.page = response.data.data
        }
      })
    },
    deptAdd: function () {
      const self = this
      self.deptAddVisible = true
    },
    getDeptList: function () {
      const self = this
      const url = 'dept/deptList'
      self.axios.get(url).then(function (response) {
        if (response.data.success) {
          self.deptList = response.data.data
        }
      })
    },
    resetAdd: function () {
      this.$refs['deptAddForm'].resetFields()
    },
    cancelAdd: function () {
      const self = this
      self.resetAdd()
      self.deptAddVisible = false
    },
    submitAdd: function () {
      const self = this
      const url = 'dept/deptAdd'
      self.$refs['deptAddForm'].validate(function (valid) {
        if (valid) {
          let param = new URLSearchParams()
          param.append('deptId', self.deptAddForm.deptId)
          param.append('deptName', self.deptAddForm.deptName)
          param.append('parentDeptId', self.deptAddForm.parentDeptId)
          param.append('listOrder', self.deptAddForm.listOrder)
          self.axios.post(url, param).then(function (response) {
            if (response.data.success) {
              self.deptAddVisible = false
              self.resetAdd()
              self.getDeptPage(self.page.current, self.page.size)
            }
          })
        } else {
          return false
        }
      })
    },
    handleOrderAdd: function (val) {
      const self = this
      if (val === '') {
        return
      }
      const url = 'dept/deptOrder/' + val
      self.axios.get(url).then(function (response) {
        if (response.data.success) {
          self.deptAddForm.listOrder = response.data + 1
        }
      })
    },
    handleOrderEdit: function (val) {
      const self = this
      if (val === '') {
        return
      }
      const url = 'dept/deptOrder/' + val
      self.axios.get(url).then(function (response) {
        if (response.data.success) {
          self.deptEditForm.listOrder = response.data.data + 1
        }
      })
    },
    resetEdit: function () {
      this.$refs['deptEditForm'].resetFields()
    },
    cancelEdit: function () {
      const self = this
      self.resetEdit()
      self.deptEditVisible = false
    },
    submitEdit: function () {
      const self = this
      const url = 'dept/deptEdit/' + self.deptEditForm.deptId + '/' + self.deptEditForm.deptName + '/' + self.deptEditForm.parentDeptId + '/' + self.deptEditForm.listOrder + '/'
      self.$refs['deptEditForm'].validate(function (valid) {
        if (valid) {
          self.axios.put(url).then(function (response) {
            if (response.data.success) {
              self.deptEditVisible = false
              self.getDeptPage(self.page.current, self.page.size)
            }
          })
        } else {
          return false
        }
      })
    },
    deptEdit: function (row) {
      const self = this
      self.deptEditForm = self.$global.copyDeep(row)
      if (!isNaN(parseInt(self.deptEditForm.parentDeptId))) {
        self.deptEditForm.parentDeptId = parseInt(self.deptEditForm.parentDeptId)
      }
      self.deptEditVisible = true
    },
    deptDel: function (row) {
      const self = this
      const url = 'dept/deptDel/' + row.deptId
      self.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.axios.delete(url).then(function (response) {
          self.getDeptPage(self.page.current, self.page.size)
        })
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
