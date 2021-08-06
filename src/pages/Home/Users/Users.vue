<template>
  <div id="usersContainer">
    <!--  面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--   卡片区域-->
    <el-card class="box-card">
      <!--      input搜索区域-->
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query">
            <el-button @click="searchUsers" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
      </el-row>
      <!--列表数据显示区域-->
      <el-table
          stripe
          :data="userList"
          border
          style="width: 100%">
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <template v-slot="scope">
            <el-switch
                @change="changeStatus((scope.row))"
                v-model="scope.row.mg_state"
                active-color="#409EFF"
                inactive-color="#eee">
            </el-switch>

          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button @click="updateUser(scope.row)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" @click="openDel(scope.row.id)" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
              <el-button @click="dispatchRoles(scope.row)" type="danger" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>


        </el-table-column>
      </el-table>
      <!--      底部分页栏区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1,2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>


    <!--    添加用户弹出框显示区域-->
    <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="40%"
        @close="closeAddUserForm"
    >
      <!--      添加用户弹出框对应的表单区域-->
      <el-form :model="addUserRuleForm" :rules="addUserRules"
               ref="addUserRuleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="toAddUser">确 定</el-button>
  </span>
    </el-dialog>

    <!--    修改用户显示区域弹出框-->
    <el-dialog
        title="修改用户信息"
        :visible.sync="updateUserVisible"
        width="40%"
    >

      <!--      修改区域弹出的表单区域-->
      <el-form ref="updateUserForm"
               @close="closeUpdateUserForm"
               :rules="addUserRules" :model="updateUserForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled v-model="updateUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="updateUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>


      <span slot="footer">
    <el-button @click="updateUserVisible = false">取 消</el-button>
    <el-button type="primary" @click="toUpdateUser">确 定</el-button>
  </span>
    </el-dialog>

<!--分配角色弹出区域-->
    <el-dialog
        style="font-size: 12px"
        title="分配角色"
        :visible.sync="isDispatchRoles"
        width="30%"
        >
      <p>当前的用户: {{currentUser.username}}</p>
      <p style="margin: 10px 0">当前的角色: {{currentUser.role_name}}</p>
      <p>分配新角色:
        <el-select v-model="selectedId" placeholder="请选择">
          <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" >

    <el-button @click="isDispatchRoles = false">取 消</el-button>
    <el-button type="primary" @click="toConfirmDispatchUserRole">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    //自定义校验规则 校验邮箱
    const validateEmail = (rule, value, callback) => {
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (regEmail.test(value)) {
        callback()
      } else {
        callback(new Error("邮箱格式不正确"))
      }
    };
    //自定义校验规则校验手机号
    const validateMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        callback()
      } else {
        callback(new Error("手机格式不正确"))
      }
    };
    return {
      userList: [],   //所有用户的信息
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      dialogVisible: false,
      //添加用户对应的表单
      addUserRuleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: validateEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机', trigger: 'blur'},
          {validator: validateMobile, trigger: 'blur'}
        ]
      },
      updateUserVisible: false,
      updateUserForm: {},
      isDispatchRoles:false,
      currentUser:{},
      rolesList:[],
      selectedId:""
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {

    toConfirmDispatchUserRole(){

      this.$confirm('此操作将永久保存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
      const result = await  this.$API.reqDispatchUserRule(this.currentUser.id,this.selectedId)
        if (result.meta.status === 200){
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        }else {
          this.$message.error(result.meta.msg)
        }
        this.selectedId = ""
        this.isDispatchRoles=false
        this.getUsers()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },

    async getUsers() { //获取所有用户列表
      const result = await this.$API.reqUsers(this.queryInfo)
      if (result.meta.status !== 200) {
        this.$message.error("获取用户列表数据失败")
      } else {
        this.userList = result.data.users;
        this.total = result.data.total
      }
    },  //获取用户列表的方法
    handleSizeChange(newPageSize) { //当每页显示几条数据改变时
      this.queryInfo.pagesize = newPageSize
      this.getUsers()
    },
    handleCurrentChange(newCurrentNum) { //改变当前页码
      this.queryInfo.pagenum = newCurrentNum
      this.getUsers()
    },
    searchUsers() {
      this.getUsers()
      this.queryInfo.query = ""
    },
    async changeStatus({id, mg_state}) {
      let stateObj = {uId: id, type: mg_state}
      const result = await this.$API.reqUpdateUserStatus(stateObj)
      if (result.meta.status === 200) {
        this.$message.success("状态修改成功")
      } else {
        this.$message.error("状态修改失败,原因是:" + result.meta.msg)
      }
    },
    //关闭dialog对话框
    closeAddUserForm() {
      this.$refs.addUserRuleForm.resetFields()
    },
    //点击确定按钮去发送添加用户的请求
    toAddUser() {
      this.$refs.addUserRuleForm.validate(async (isSuccess) => {
        if (isSuccess) {
          this.dialogVisible = false
          const result = await this.$API.reqAddUser(this.addUserRuleForm)
          if (result.meta.status === 201) {
            this.$message.success(result.meta.msg)
            //重新获取列表数据
            this.getUsers()
          } else {
            this.$message.error("创建失败")
          }
        } else {
          this.$message.error("输入项有误,请先检查")
        }
      })
    },
    async updateUser(row) {
      this.updateUserVisible = true;
      const result = await this.$API.reqUserById(row.id)
      this.updateUserForm = result.data;
    },
    toUpdateUser() {
      this.$refs.updateUserForm.validate(async (isSuccess) => {
            if (isSuccess) {
              //第二次校验成功
              const result = await this.$API.reqUpdateUser(this.updateUserForm)
              if (result.meta.status === 200) {
                this.$message.success(result.meta.msg)
              } else {
                this.$message.error(result.meta.msg)
              }
              this.updateUserVisible = false
              this.getUsers()
            } else {
              this.$message.error("修改数据不符合规则,请重新输入")
            }
          }
      )

    },
    closeUpdateUserForm() {
      this.$refs.updateUserForm.resetFields()
    },
    //删除单个用户
    openDel(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await this.$API.reqDelUserById(id)
        if (result.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } else {
          this.$message.error(result.meta.msg)
        }

        this.getUsers()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //分配角色
   async dispatchRoles(currentUser){


     this.currentUser = currentUser

    const result =await  this.$API.reqGetRoles()
     if (result.meta.status===200){
       this.rolesList = result.data
     }


     this.isDispatchRoles = true;

    }

  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
#usersContainer
  .el-card
    margin-top 20px
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1)

    .el-table
      margin-top 15px

    .el-pagination
      margin-top 15px
      text-align center
</style>