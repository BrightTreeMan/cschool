<template>
  <div id='role' v-cloak>
    <el-container>
      <el-main style='height: 76vh;padding:15px 0 0 0; '>
        <!-- 查询表单-->
        <el-col :span='24' class='searchForm'>
          <el-form :inline='true' :model='roleSearchForm' class='demo-form-inline'>
            <el-form-item label='角色ID'>
              <el-input v-model='roleSearchForm.roleId' placeholder='角色ID'></el-input>
            </el-form-item>
            <el-form-item label='角色名称'>
              <el-input v-model='roleSearchForm.roleName' placeholder='角色名称'></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type='primary' icon='el-icon-search' @click='getRolePage()'>查询</el-button>
              <el-button type='primary' icon='el-icon-document-add' @click='roleAdd()'>新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 表体内容-->
        <el-table ref='multipleTable' :data='page.records' tooltip-effect='dark' border  >
          <el-table-column align='center' prop='roleId' label='角色ID' min-width='80'></el-table-column>
          <el-table-column align='center' prop='roleName' label='角色名称' min-width='200'></el-table-column>
          <el-table-column align='center' prop='roleDesc' label='角色描述' min-width='290'></el-table-column>
          <el-table-column align='center' prop='addUserName' label='创建人' min-width='80'></el-table-column>
          <el-table-column align='center' label='创建日期' min-width='110'>
            <template slot-scope='scope'>{{ scope.row.addDate | longToDateStr('yyyy-MM-dd hh:mm:ss') }}</template>
          </el-table-column>
          <el-table-column align='center' prop='modUserName' label='修改人' min-width='80'></el-table-column>
          <el-table-column align='center' label='修改日期' min-width='110'>
            <template slot-scope='scope'>{{ scope.row.modDate | longToDateStr('yyyy-MM-dd hh:mm:ss') }}</template>
          </el-table-column>
          <el-table-column align='center' label='操作' min-width='100'>
            <template slot-scope='scope'>
              <el-button type='text' icon='el-icon-edit' @click='roleEdit(scope.row)'>编辑</el-button>
              <el-button type='text' icon='el-icon-delete' @click='roleDel(scope.row)'>删除</el-button>
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
    <el-dialog title='新增角色' :visible.sync='roleAddVisible' :show-close='false' :close-on-click-modal='false'>
      <el-form :model='roleAddForm' label-position='right' label-width='80px' :rules='roleAddRules' ref='roleAddForm'>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model.trim='roleAddForm.roleName' autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='roleDesc' style='vertical-align:middle;'>
          <el-input type='textarea' v-model='roleAddForm.roleDesc' autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item label='菜单权限' prop='roleMenuId'  style='vertical-align:middle;'>
          <div style='border: 1px solid #EBEEF5;height:300px;overflow: auto;'>
            <el-collapse v-model='activeName'>
              <el-collapse-item v-for='(menu,index) in menuList' :name='index' :key='index'>
                <template slot='title'>
                  <div style='padding:30px; '>
                    {{menu.label}}
                  </div>
                  <el-button-group>
                    <el-button type='text' style='padding-right:10px;' @click.stop='chooseAddAll(index)'>全选</el-button>
                    <el-button type='text' @click.stop='clearAddAll(index)'>清除</el-button>
                  </el-button-group>
                </template>
                <div style='padding-left: 50px;'>
                  <el-checkbox-group v-model='roleAddForm.roleMenuId'>
                    <el-checkbox v-for='meunThree in menu.children' :label='meunThree.value' :key='meunThree.value'>{{meunThree.label}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='cancelAdd()'>取消</el-button>
        <el-button type='info' @click='resetAdd()'>重置</el-button>
        <el-button type='primary' @click='submitAdd()'>确定</el-button>
      </div>
    </el-dialog>

    <!--修改表单-->
    <el-dialog title='修改角色' :visible.sync='roleEditVisible' v-if='roleEditVisible' :show-close='false' :close-on-click-modal='false'>
      <el-form :model='roleEditForm' label-position='right' label-width='80px' :rules='roleAddRules' ref='roleEditForm'>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model.trim='roleEditForm.roleName' autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='roleDesc'>
          <el-input type='textarea' v-model='roleEditForm.roleDesc' autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item label='菜单权限' prop='roleMenuId'>
          <div style='border: 1px solid #EBEEF5;height:300px;overflow: auto;'>
            <el-collapse v-model='activeName'>
              <el-collapse-item v-for='(menu,index) in menuList' :name='index' :key='index'>
                <template slot='title'>
                  <div style='padding:30px; '>
                    {{menu.label}}
                  </div>
                  <el-button-group>
                    <el-button type='text' style='padding-right:10px;' @click.stop='chooseEditAll(index)'>全选</el-button>
                    <el-button type='text' @click.stop='clearEditAll(index)'>清除</el-button>
                  </el-button-group>
                </template>
                <div style='padding-left: 50px;'>
                  <el-checkbox-group v-model='roleEditForm.roleMenuId'>
                    <el-checkbox v-for='meunThree in menu.children' :label='meunThree.value' :key='meunThree.value'>{{meunThree.label}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form-item>
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
  name: 'role',
  data () {
    return {
      checkedCities: [],
      page: '',
      roleSearchForm: {
        roleId: '',
        roleName: ''
      },
      roleAddVisible: false,
      roleAddForm: {
        roleName: '',
        roleDesc: '',
        roleMenuId: []
      },
      menuList: [],
      props: { multiple: true },
      roleAddRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ]
      },
      roleEditForm: '',
      roleEditVisible: false,
      activeName: []
    }
  },
  methods: {
    handleSizeChange: function (val) {
      const self = this
      self.getRolePage(self.page.current, val)
    },
    handleCurrentChange: function (val) {
      const self = this
      self.getRolePage(val, self.page.size)
    },
    init: function () {
      this.getRolePage()
      this.getMenuList()
    },
    getRolePage: function (current, size) {
      const self = this
      current = current || 1
      size = size || 10
      const url = 'role/rolePage'
      let param = new URLSearchParams()
      param.append('current', current)
      param.append('size', size)
      param.append('roleId', self.roleSearchForm.roleId)
      param.append('roleName', self.roleSearchForm.roleName)
      self.axios.post(url, param).then(function (response) {
        self.page = response.data.data
      })
    },
    getMenuList: function () {
      const self = this
      const url = 'menu/menuListForChoose'
      self.axios.get(url).then(function (response) {
        if (response.data.success) {
          self.menuList = response.data.data
          self.menuList.forEach(function (item, index) {
            self.activeName.push(index)
          })
        }
      })
    },
    roleAdd: function () {
      const self = this
      self.roleAddVisible = true
    },
    resetAdd: function () {
      this.$refs['roleAddForm'].resetFields()
    },
    cancelAdd: function () {
      const self = this
      self.resetAdd()
      self.roleAddVisible = false
    },
    submitAdd: function () {
      const self = this
      const url = 'role/roleAdd'
      self.$refs['roleAddForm'].validate(function (valid) {
        if (valid) {
          let param = new URLSearchParams()
          param.append('roleName', self.roleAddForm.roleName)
          param.append('roleDesc', self.roleAddForm.roleDesc)
          param.append('roleMenuId', self.roleAddForm.roleMenuId)

          self.axios.post(url, param).then(function (response) {
            if (response.data.success) {
              self.roleAddVisible = false
              self.resetAdd()
              self.getRolePage(self.page.current, self.page.size)
            }
          })
        } else {
          return false
        }
      })
    },
    resetEdit: function () {
      this.$refs['roleEditForm'].resetFields()
    },
    cancelEdit: function () {
      const self = this
      self.resetEdit()
      self.roleEditVisible = false
    },
    submitEdit: function () {
      const self = this
      const url = 'role/roleEdit/' + self.roleEditForm.roleId + '/' + self.roleEditForm.roleName + '/' + self.roleEditForm.roleDesc + '/' + self.roleEditForm.roleMenuId
      self.$refs['roleEditForm'].validate(function (valid) {
        if (valid) {
          self.axios.put(url).then(function (response) {
            if (response.data.success) {
              self.roleEditVisible = false
              self.getRolePage(self.page.current, self.page.size)
            }
          })
        } else {
          return false
        }
      })
    },
    roleEdit: function (row) {
      const self = this
      self.roleEditForm = self.$global.copyDeep(row)
      self.roleEditVisible = true
    },
    chooseAddAll: function (index) {
      const self = this
      self.menuList[index].children.forEach(function (item) {
        if (self.roleAddForm.roleMenuId.indexOf(item.value) === -1) {
          self.roleAddForm.roleMenuId.push(item.value)
        }
      })
    },
    clearAddAll: function (index) {
      const self = this
      self.roleAddForm.roleMenuId = self.roleAddForm.roleMenuId.filter(function (item) {
        let flag = true
        self.menuList[index].children.forEach(function (temp) {
          if (temp.value === item) {
            flag = false
          }
        })
        return flag
      })
    },
    chooseEditAll: function (index) {
      const self = this
      self.menuList[index].children.forEach(function (item) {
        if (self.roleEditForm.roleMenuId.indexOf(item.value) === -1) {
          self.roleEditForm.roleMenuId.push(item.value)
        }
      })
    },
    clearEditAll: function (index) {
      const self = this
      self.roleEditForm.roleMenuId = self.roleEditForm.roleMenuId.filter(function (item) {
        let flag = true
        self.menuList[index].children.forEach(function (temp) {
          if (temp.value === item) {
            flag = false
          }
        })
        return flag
      })
    },
    roleDel: function (row) {
      const self = this
      const url = 'role/roleDel/' + row.roleId
      self.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.axios.delete(url).then(function (response) {
          if (response.data.success) {
            self.getRolePage(self.page.current, self.page.size)
          }
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
  .el-collapse{
    border:0 !important;
  }
</style>
