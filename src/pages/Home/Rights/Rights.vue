<template>
  <div id="rightsContainer">
    <!--   面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--   权限列表区域-->
    <el-card class="box-card">
      <el-table
          :data="rightsList"
          border
          stripe
          style="width: 100%">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column  prop="authName"  label="权限名称"  > </el-table-column>
        <el-table-column prop="path" label="路径" > </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rightsList: [] ,  //权限列表数据
    }
  },
  mounted() {
    this.getRights()
  },
  methods: {
    async getRights() {

      const result = await this.$API.reqGetRights("list")
     if (result.meta.status === 200){
       this.rightsList = result.data
     }else {
       this.$message.error(result.meta.msg)
     }

    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
#rightsContainer
  .el-card
    margin-top 20px





</style>