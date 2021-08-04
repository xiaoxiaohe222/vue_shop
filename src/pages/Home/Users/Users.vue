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
        <el-button type="primary">添加用户</el-button>
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
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-tooltip :enterable="false" effect="dark" content="设置重置" placement="top">
            <el-button type="danger" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>

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

  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      userList: [],   //所有用户的信息
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      total: 0

    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
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