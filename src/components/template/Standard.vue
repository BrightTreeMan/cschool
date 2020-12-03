<template>
  <div id='standard' v-cloak>
    <el-container>
      <el-main style='height: 76vh;padding:15px 0 0 0; '>
        <!-- 查询表单-->
        <el-col :span='24' class='searchForm'>
          <el-form :inline='true' :model='standardSearchForm' class='demo-form-inline'>
            <el-form-item label='角色ID'>
              <el-input v-model='standardSearchForm.standardId' placeholder='角色ID'></el-input>
            </el-form-item>
            <el-form-item label='角色名称'>
              <el-input v-model='standardSearchForm.standardName' placeholder='角色名称'></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type='primary' icon='el-icon-search' @click='getstandardPage()'>查询</el-button>
              <el-button type='primary' icon='el-icon-document-add' @click='standardAdd()'>新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 表体内容-->
        <el-table ref='multipleTable' :data='page.records' tooltip-effect='dark' border  >
          <el-table-column align='center' prop='standardId' label='角色ID' min-width='80'></el-table-column>
          <el-table-column align='center' prop='standardName' label='角色名称' min-width='200'></el-table-column>
          <el-table-column align='center' prop='standardDesc' label='角色描述' min-width='290'></el-table-column>
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
              <el-button type='text' icon='el-icon-edit' @click='standardEdit(scope.row)'>编辑</el-button>
              <el-button type='text' icon='el-icon-delete' @click='standardDel(scope.row)'>删除</el-button>
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
    <el-dialog title='新增角色' :visible.sync='standardAddVisible' :show-close='false' :close-on-click-modal='false'>
      <el-form :model='standardAddForm' label-position='right' label-width='80px' :rules='standardAddRules' ref='standardAddForm'>
        <el-form-item label='角色名称' prop='standardName'>
          <el-input v-model.trim='standardAddForm.standardName' autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='standardDesc' style='vertical-align:middle;'>
          <el-input type='textarea' v-model='standardAddForm.standardDesc' autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item label='菜单权限' prop='standardMenuId'  style='vertical-align:middle;'>
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
                  <el-checkbox-group v-model='standardAddForm.standardMenuId'>
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
    <el-dialog title='修改角色' :visible.sync='standardEditVisible' v-if='standardEditVisible' :show-close='false' :close-on-click-modal='false'>
      <el-form :model='standardEditForm' label-position='right' label-width='80px' :rules='standardAddRules' ref='standardEditForm'>
        <el-form-item label='角色名称' prop='standardName'>
          <el-input v-model.trim='standardEditForm.standardName' autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='standardDesc'>
          <el-input type='textarea' v-model='standardEditForm.standardDesc' autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item label='菜单权限' prop='standardMenuId'>
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
                  <el-checkbox-group v-model='standardEditForm.standardMenuId'>
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
  name: 'standard',
  data () {
    return {
      checkedCities: [],
      page: '',
      standardSearchForm: {
        standardId: '',
        standardName: ''
      },
      standardAddVisible: false,
      standardAddForm: {
        standardName: '',
        standardDesc: '',
        standardMenuId: []
      },
      menuList: [],
      props: { multiple: true },
      standardAddRules: {
        standardName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        standardDesc: [
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ]
      },
      standardEditForm: '',
      standardEditVisible: false,
      activeName: []
    }
  },
  methods: {
    handleSizeChange: function (val) {
      const self = this
      self.getstandardPage(self.page.current, val)
    },
    handleCurrentChange: function (val) {
      const self = this
      self.getstandardPage(val, self.page.size)
    },
    init: function () {
      this.getstandardPage()
      this.getMenuList()
    },
    getstandardPage: function (current, size) {
      const self = this
      current = current || 1
      size = size || 10
      const url = 'standard/standardPage'
      let param = new URLSearchParams()
      param.append('current', current)
      param.append('size', size)
      param.append('standardId', self.standardSearchForm.standardId)
      param.append('standardName', self.standardSearchForm.standardName)
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
    standardAdd: function () {
      const self = this
      self.standardAddVisible = true
    },
    resetAdd: function () {
      this.$refs['standardAddForm'].resetFields()
    },
    cancelAdd: function () {
      const self = this
      self.resetAdd()
      self.standardAddVisible = false
    },
    submitAdd: function () {
      const self = this
      const url = 'standard/standardAdd'
      self.$refs['standardAddForm'].validate(function (valid) {
        if (valid) {
          let param = new URLSearchParams()
          param.append('standardName', self.standardAddForm.standardName)
          param.append('standardDesc', self.standardAddForm.standardDesc)
          param.append('standardMenuId', self.standardAddForm.standardMenuId)

          self.axios.post(url, param).then(function (response) {
            if (response.data.success) {
              self.standardAddVisible = false
              self.resetAdd()
              self.getstandardPage(self.page.current, self.page.size)
            }
          })
        } else {
          return false
        }
      })
    },
    resetEdit: function () {
      this.$refs['standardEditForm'].resetFields()
    },
    cancelEdit: function () {
      const self = this
      self.resetEdit()
      self.standardEditVisible = false
    },
    submitEdit: function () {
      const self = this
      const url = 'standard/standardEdit/' + self.standardEditForm.standardId + '/' + self.standardEditForm.standardName + '/' + self.standardEditForm.standardDesc + '/' + self.standardEditForm.standardMenuId
      self.$refs['standardEditForm'].validate(function (valid) {
        if (valid) {
          self.axios.put(url).then(function (response) {
            if (response.data.success) {
              self.standardEditVisible = false
              self.getstandardPage(self.page.current, self.page.size)
            }
          })
        } else {
          return false
        }
      })
    },
    standardEdit: function (row) {
      const self = this
      self.standardEditForm = self.$global.copyDeep(row)
      self.standardEditVisible = true
    },
    chooseAddAll: function (index) {
      const self = this
      self.menuList[index].children.forEach(function (item) {
        if (self.standardAddForm.standardMenuId.indexOf(item.value) === -1) {
          self.standardAddForm.standardMenuId.push(item.value)
        }
      })
    },
    clearAddAll: function (index) {
      const self = this
      self.standardAddForm.standardMenuId = self.standardAddForm.standardMenuId.filter(function (item) {
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
        if (self.standardEditForm.standardMenuId.indexOf(item.value) === -1) {
          self.standardEditForm.standardMenuId.push(item.value)
        }
      })
    },
    clearEditAll: function (index) {
      const self = this
      self.standardEditForm.standardMenuId = self.standardEditForm.standardMenuId.filter(function (item) {
        let flag = true
        self.menuList[index].children.forEach(function (temp) {
          if (temp.value === item) {
            flag = false
          }
        })
        return flag
      })
    },
    standardDel: function (row) {
      const self = this
      const url = 'standard/standardDel/' + row.standardId
      self.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.axios.delete(url).then(function (response) {
          if (response.data.success) {
            self.getstandardPage(self.page.current, self.page.size)
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
