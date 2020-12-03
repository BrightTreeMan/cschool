<template>
  <div id='user' v-cloak>
    <el-container >
      <el-main style='height: 76vh;padding:15px 0 0 0; '>
        <!-- 查询表单-->
        <el-col :span='24' class='searchForm'>
          <el-form :inline='true' :model='userSearchForm' class='demo-form-inline'>
            <el-form-item label='账户'>
              <el-input v-model='userSearchForm.userName' placeholder='账户'></el-input>
            </el-form-item>
            <el-form-item label='部门'>
              <el-select v-model='userSearchForm.deptId' placeholder='请选择' :clearable='true'>
                <el-option v-for='dept in deptList' :key='dept.deptId' :label='dept.deptName' :value='dept.deptId'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type='primary' icon='el-icon-search' @click='getUserPage()'>查询</el-button>
              <el-button type='primary' icon='el-icon-document-add' @click='userAdd()'>新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 表体内容-->
        <el-table  :data='page.records' tooltip-effect='dark' border >
          <el-table-column align='center' prop='userName' label='账户' min-width='80'></el-table-column>
          <el-table-column align='center' prop='deptName' label='部门' min-width='80'></el-table-column>
          <el-table-column align='center' prop='nickName' label='用户名称' min-width='80'></el-table-column>
          <el-table-column align='center' prop='phone' label='联系方式' min-width='100'></el-table-column>
          <el-table-column align='center' label='状态' min-width='80'>
            <template slot-scope='scope'>
              <span>{{scope.row.stateName}}</span>
              <a href='javascript:void(0);' @click='userLock(scope.row)'>
                <i class='el-icon-lock' v-if='scope.row.state == 0'></i>
                <i class='el-icon-unlock' v-if='scope.row.state != 0'></i>
              </a>
            </template>
          </el-table-column>
          <el-table-column align='center' prop='addUserName' label='创建人' min-width='100'></el-table-column>
          <el-table-column align='center' label='创建日期' min-width='100'>
            <template slot-scope='scope'>{{ scope.row.addDate | longToDateStr('yyyy-MM-dd hh:mm:ss') }}</template>
          </el-table-column>
          <el-table-column align='center' prop='modUserName' label='修改人' min-width='100'></el-table-column>
          <el-table-column align='center' label='修改日期' min-width='100'>
            <template slot-scope='scope'>{{ scope.row.modDate | longToDateStr('yyyy-MM-dd hh:mm:ss') }}</template>
          </el-table-column>
          <el-table-column align='center' label='操作' min-width='200'>
            <template slot-scope='scope'>
              <el-button type='text' icon='el-icon-switch-button' @click='resetPwd(scope.row)'>重置密码</el-button>
              <el-button type='text' icon='el-icon-s-check' @click='userRole(scope.row)'>分配角色</el-button>
              <el-button type='text' icon='el-icon-edit' @click='userEdit(scope.row)'>编辑</el-button>
              <el-button type='text' icon='el-icon-delete' @click='userDel(scope.row)'>删除</el-button>
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
    <el-dialog title='新增用户' :visible.sync='userAddVisible' :show-close='false' :close-on-click-modal='false'>
      <el-form :model='userAddForm' :rules='userAddRules' label-position='right' label-width='80px' ref='userAddForm'>
        <el-row>
          <el-col :span='10' :offset='1'>
              <el-form-item label='账户' prop='userName'>
                <el-input v-model.trim='userAddForm.userName' autocomplete='off'></el-input>
              </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='用户名称' prop='nickName'>
              <el-input v-model.trim='userAddForm.nickName' autocomplete='new-password' ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='密码' prop='password'>
              <el-input v-model.trim='userAddForm.password' autocomplete='new-password' :show-password='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='重复密码' prop='rePassword'>
              <el-input v-model.trim='userAddForm.rePassword' autocomplete='off' :show-password='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='手机号码' prop='phone'>
              <el-input v-model='userAddForm.phone' autocomplete='off'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='部门' prop='deptId'>
              <el-select v-model='userAddForm.deptId' placeholder='请选择' :clearable='true' style='width:100%;'>
                  <el-option v-for='dept in deptList' :key='dept.deptId' :label='dept.deptName' :value='dept.deptId'></el-option>
              </el-select>
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
    <el-dialog title='修改用户' :visible.sync='userEditVisible' v-if='userEditVisible' :show-close='false' :close-on-click-modal='false'>
      <el-form :model='userEditForm' :rules='userEditRules' label-position='right' label-width='80px' ref='userEditForm'>
        <el-row>
          <el-col :span='10' :offset='1'>
            <el-form-item label='账户' prop='userName'>
              <el-input v-model='userEditForm.userName' autocomplete='off' :readonly='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='用户名称' prop='nickName'>
              <el-input v-model.trim='userEditForm.nickName' autocomplete='off'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='手机号码' prop='phone'>
              <el-input v-model='userEditForm.phone' autocomplete='off'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='10' :offset='1'>
            <el-form-item label='部门' prop='deptId'>
              <el-select v-model='userEditForm.deptId' placeholder='请选择' :clearable='true'  style='width:100%;'>
                <el-option v-for='dept in deptList' :key='dept.deptId' :label='dept.deptName' :value='dept.deptId'></el-option>
              </el-select>
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

    <!--分配角色-->
    <el-dialog title='分配角色' :visible.sync='userRoleVisible' v-if='userRoleVisible' :show-close='false' :close-on-click-modal='false'>
      <el-form :model='userRoleForm' label-position='right' label-width='80px' ref='userRoleForm'>
        <el-form-item label='账户' prop='userName' style='vertical-align:middle;'>
          <el-input v-model='userRoleForm.userName' autocomplete='off' :readonly='true'></el-input>
        </el-form-item>
        <el-form-item label='角色' prop='userRoleId'  style='vertical-align:middle;'>
          <div style='border: 1px solid #EBEEF5;height:150px;overflow: auto;padding: 0 30px;'>
            <el-checkbox-group v-model='userRoleForm.userRoleId'>
              <el-checkbox v-for='role in roleList' :label='role.roleId' :key='role.roleId'>{{role.roleName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='cancelRole()'>取消</el-button>
        <el-button type='info' @click='resetRole()'>重置</el-button>
        <el-button type='primary' @click='submitRole()'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'user',
  data () {
    const checkPhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号码!'))
        }
      }
      callback()
    }
    const checkUserName = (rule, value, callback) => {
      const self = this
      const url = 'user/userCheck/' + value
      self.axios.get(url).then(function (response) {
        if (response.data.success) {
          if (response.data.data === '0') {
            callback(new Error('账户已存在，请更换!'))
          } else {
            callback()
          }
        }
      })
    }
    const checkPass = (rule, value, callback) => {
      const self = this
      if (self.userAddForm.rePassword !== '') {
        self.$refs.userAddForm.validateField('rePassword')
      }
      callback()
    }
    const checkRePass = (rule, value, callback) => {
      const self = this
      if (self.userAddForm.password !== '') {
        if (self.userAddForm.password !== self.userAddForm.rePassword) {
          callback(new Error('两次输入的密码不一样，请修改!'))
        }
      }
      callback()
    }

    return {
      page: '',
      userSearchForm: {
        userName: '',
        deptId: ''
      },
      userAddVisible: false,
      userAddForm: {
        userName: '',
        password: '',
        rePassword: '',
        deptId: '',
        nickName: '',
        phone: ''
      },
      userAddRules: {
        userName: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
          { validator: checkUserName, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
          { validator: checkPass, trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
          { validator: checkRePass, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        deptId: [

        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      userEditRules: {
        userName: [
        ],
        nickName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        deptId: [

        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      deptList: [],
      userEditForm: '',
      userEditVisible: false,
      userRoleForm: {
        userId: '',
        userName: '',
        userRoleId: []
      },
      userRoleVisible: false,
      roleList: []
    }
  },
  methods: {
    handleSizeChange: function (val) {
      const self = this
      self.getUserPage(self.page.current, val)
    },
    handleCurrentChange: function (val) {
      const self = this
      self.getUserPage(val, self.page.size)
    },
    init: function () {
      this.getUserPage()
      this.getDeptList()
    },
    getUserPage: function (current, size) {
      const self = this
      current = current || 1
      size = size || 10
      const url = 'user/userPage'
      let param = new URLSearchParams()
      param.append('userName', self.userSearchForm.userName)
      param.append('deptId', self.userSearchForm.deptId)
      param.append('current', current)
      param.append('size', size)
      self.axios.post(url, param).then(function (response) {
        if (response.data.success) {
          self.page = response.data.data
        }
      })
    },
    userAdd: function () {
      const self = this
      self.userAddVisible = true
    },
    resetAdd: function () {
      const self = this
      self.$refs['userAddForm'].resetFields()
    },
    cancelAdd: function () {
      const self = this
      self.resetAdd()
      self.userAddVisible = false
    },
    submitAdd: function () {
      const self = this
      const url = 'user/userAdd'
      self.$refs['userAddForm'].validate(function (valid) {
        if (valid) {
          let param = new URLSearchParams()
          param.append('userName', self.userAddForm.userName)
          param.append('password', self.userAddForm.password)
          param.append('deptId', self.userAddForm.deptId)
          param.append('nickName', self.userAddForm.nickName)
          param.append('phone', self.userAddForm.phone)
          self.axios.post(url, param).then(function (response) {
            if (response.data.success) {
              self.userAddVisible = false
              self.resetAdd()
              self.getUserPage(self.page.current, self.page.size)
            }
          })
        } else {
          return false
        }
      })
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
    userDel: function (row) {
      const self = this
      const url = 'user/userDel/' + row.userId
      self.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.axios.delete(url).then(function (response) {
          if (response.data.success) {
            self.getUserPage(self.page.current, self.page.size)
          }
        })
      })
    },
    userEdit: function (row) {
      const self = this
      self.userEditForm = self.$global.copyDeep(row)
      self.userEditVisible = true
    },
    resetEdit: function () {
      this.$refs['userEditForm'].resetFields()
    },
    cancelEdit: function () {
      const self = this
      self.resetEdit()
      self.userEditVisible = false
    },
    submitEdit: function () {
      const self = this
      const url = 'user/userEdit/' + self.userEditForm.userId + '/' + self.userEditForm.deptId + '/' + self.userEditForm.nickName + '/' + self.userEditForm.phone
      self.$refs['userEditForm'].validate(function (valid) {
        if (valid) {
          self.axios.put(url).then(function (response) {
            if (response.data.success) {
              self.userEditVisible = false
              self.getUserPage(self.page.current, self.page.size)
            }
          })
        } else {
          return false
        }
      })
    },
    resetPwd: function (row) {
      const self = this
      const url = 'user/resetPwd/' + row.userId
      self.$confirm('此操作将重置该用户密码，重制后密码为‘111111’, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.axios.put(url).then(function (response) {
          if (response.data.success) {
            self.$alert('密码重置成功！', '提示')
          }
        })
      })
    },
    userLock: function (row) {
      const self = this
      const url = 'user/userLock/' + row.userId + '/' + row.state
      const msg = row.state === '0' ? '此操作将锁定该用户,锁定后该用户无法进行任何操作，是否继续?' : '此操作将解锁该用户,解锁后该用户恢复使用功能，是否继续?'
      self.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.axios.put(url).then(function (response) {
          if (response.data.success) {
            self.getUserPage(self.page.current, self.page.size)
          }
        })
      })
    },
    userRole: function (row) {
      const self = this
      const url = 'user/userRoleList'
      self.userRoleForm.userName = row.userName
      self.userRoleForm.userId = row.userId
      self.userRoleForm.userRoleId = row.userRoleId
      self.axios.get(url).then(function (response) {
        if (response.data.success) {
          self.roleList = response.data.data
          self.userRoleVisible = true
        }
      })
    },
    resetRole: function () {
      this.$refs['userRoleForm'].resetFields()
    },
    cancelRole: function () {
      const self = this
      self.resetRole()
      self.userRoleVisible = false
    },
    submitRole: function () {
      const self = this
      const url = 'user/userRole/' + self.userRoleForm.userId + '/' + self.userRoleForm.userRoleId
      self.$refs['userRoleForm'].validate(function (valid) {
        if (valid) {
          self.axios.put(url).then(function (response) {
            if (response.data.success) {
              self.userRoleVisible = false
              self.getUserPage(self.page.current, self.page.size)
            }
          })
        } else {
          return false
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
