<template>
  <div id="rolesContainer">
    <!--   面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    添加角色按钮-->
    <el-button style="margin: 20px 0" type="primary">添加角色</el-button>
    <!--角色列表展示区域-->
    <el-card class="box-card">
      <el-table
          :data="rolesList"
          border
          stripe
          style="width: 100%">
        <el-table-column type="expand">
          <template v-slot="scope">
            <!--            <pre>{{scope.row}}</pre>-->
            <el-row style="border-bottom:1px solid #eee;display:flex;align-items:center;"
                    v-for="(item1) in scope.row.children" :key="item1.id">
              <!--              左边5格用来放一级权限的区域-->
              <el-col :span="5">
                <el-tag style="margin: 15px 0">
                  {{ item1.authName }}
                </el-tag>
              </el-col>
              <!--              右侧19个格子用来放二级和三级权限-->
              <el-col :span="19">
                <!--                二级权限-->
                <el-row style="border-bottom:1px solid #eee;display:flex;align-items:center;"
                        v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag style="margin: 15px 0;" type='success'>
                      {{ item2.authName }}
                    </el-tag>
                  </el-col>
                  <!--                三级权限-->
                  <el-col :span="18">
                    <el-tag style="margin: 15px 5px" type="warning" closable v-for="item3 in item2.children"
                            :key="item3.id">
                      {{ item3.authName }}
                    </el-tag>

                  </el-col>
                </el-row>


              </el-col>
            </el-row>

          </template>
        </el-table-column>
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <!--          eslint-disable no-unused-->
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button stuyle="margin-left:5px;margin-right:5px;" size="mini" type="danger" icon="el-icon-delete">删除
            </el-button>
            <el-button @click="toDispatchRights(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限
            </el-button>
          </template>

        </el-table-column>

      </el-table>
    </el-card>


    <!--    点击分配权限展示区域-->
    <el-dialog
        title="提示"
        :visible.sync="dispatchRightVisible"
        width="50%"
    >
      <span>分配权限</span>
      <!--树形控件-->
      <el-tree
          ref="treeRef"
          :data="rightsList"
          :props="defaultProps"
          default-expand-all
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultCheckedKeys"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dispatchRightVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmDispatchRights">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],   //所有的角色列表数据
      //分配权限弹出区域是否可见
      dispatchRightVisible: false,
      rightsList: [],   //权限列表
      defaultProps: {
        label: 'authName',
        children: "children"
      },
      defaultCheckedKeys: [],   //默认哪些节点是被选中的
      roleId: ""


    }
  },
  methods: {
    async getRoles() {
      const result = await this.$API.reqGetRoles()
      if (result.meta.status === 200) {
        this.rolesList = result.data
      } else {
        this.$message.error(result.meta.msg)
      }
    },
    async toDispatchRights(row) {
      //console.log(row);
      this.roleId = row.id;
      let arr1 = []
      row.children.forEach((item1) => {
        item1.children.forEach((item2) => {
          item2.children.forEach((item3) => {
            arr1.push(item3.id)
          })
        })
      })
      this.defaultCheckedKeys = arr1; //进行对应角色的权限的数据回显


      const result = await this.$API.reqGetRights('tree')
      if (result.meta.status === 200) {
        this.rightsList = result.data;
      } else {
        this.$message.error(result.meta.msg)
      }

      this.dispatchRightVisible = true;

    },
    confirmDispatchRights(){
      this.$confirm('此操作将永久删除权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
 const result = await  this.$API.reqRoleRight(this.roleId,[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()])
        if (result.meta.status === 200){
          this.$message({ type: 'success', message: '修改成功!' });
          this.dispatchRightVisible=false;
          this.getRoles();
        }else {
          this.$message.error(result.meta.msg)
        }



      }).catch(() => {
        this.$message({ type: 'info',message: '已取消删除'});
      });
    }
  },
  mounted() {
    this.getRoles();
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">


</style>