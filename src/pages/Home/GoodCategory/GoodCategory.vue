<template>
  <div id="goodCategoryContainer">
    <!--  面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
<!--卡片区域-->
    <el-card style="margin-top: 15px">
    <el-row>
      <el-col>
        <el-button @click="toAddCate" type="primary">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表哥展示区域  -->
      <zk-table
          style="margin: 15px 0"
      :data="cateList"
      :columns="columns"
      border
      show-index
      index-text="#"
      :selection-type="false"
      :expand-type="false"
      >
        <!--是否有效-->
        <template slot="isok" slot-scope="scope">
          <i style="color:lightgreen" v-if="scope.row['cat_deleted'] === false" class="el-icon-success"></i>
          <i style="color:darkred" v-else class="el-icon-error"></i>
        </template>

        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>

        </template>

        <!--操作-->
        <template slot="opt" >
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>

        </template>
      </zk-table>
<!--      分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

<!--添加分类弹出框-->
    <el-dialog
        @close="closeDialog"
        title="添加分类"
        :visible.sync="isAddCateVisible"
        width="50%"
         >
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateForm" label-width="100px" >
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" >
          <!--级联选择框-->
          <el-cascader
              change-on-select
              clearable
              style="width: 100%"
              v-model="selectedValue"
              :options="options"
              :props="cascaderProps"
              @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="isAddCateVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmAddCate">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "GoodCategory",
  data(){
    return {
      cateList:[],  //商品分类数据
      total:0,    //数据总共有多少条
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      isAddCateVisible:false, //添加分类是否可见的标识
      addCateForm:{
        cat_name:"",
        cat_pid:0,   //父id
        cat_level:0,  //层级0代表1级  可选0 1 2
      },
      addCateRules:{
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
      },
      options:[

      ],
      selectedValue:[],
      cascaderProps:{
        expandTrigger: 'hover',
        children:'children',
        value:'cat_id',
        label:'cat_name',
      }


    }
  },
  methods:{

    confirmAddCate(){
      this.$confirm('此操作将永久添加分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
    const result = await  this.$API.reqAddCate(this.addCateForm)
        if (result.meta.status === 201){
          this.$message({ type: 'success',message: '添加成功!'});
          this.isAddCateVisible = false

          this.getCateList()
        }else {
          this.$message.error(result.meta.msg)
        }



      }).catch(() => {
        this.$message({type: 'info',message: '已取消'});
      });




    },



    closeDialog(){
      this.$refs.addCateForm.resetFields()//重置表单数据
      this.addCateForm.cat_level=0
      this.addCateForm.cat_pid=0
      this.selectedValue.splice(0)

    },

    //级联选择里面的change事件
    handleChange(value){
      if (value.length === 1){
        //说明我添加的是2级分类 上面有一级分类
        this.addCateForm.cat_pid = value[0]
        this.addCateForm.cat_level = 1
      }else
      if (value.length === 2){
        //说明我addCateForm.添加的是2级分类 上面有一级分类
        this.addCateForm.cat_pid = value[1]
        this.addCateForm.cat_level = 2
      }else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }

    },

  async  toAddCate(){
//获取所有分类列表
   const result = await  this.$API.reqGetCateList({type:2})
    if (result.meta.status===200){
      console.log(result.data);
      this.options = result.data
      this.value = result.data
    }else {
      this.$message.error(result.meta.msg)
    }

      this.isAddCateVisible = true;
    },

  async  getCateList(){
     const result = await this.$API.reqGetCateList(this.queryInfo)
     if (result.meta.status === 200){
       //console.log(result.data);
       this.cateList = result.data.result;
       this.total = result.data.total;
     }else {
       this.$message.error(result.meta.msg)
     }
    },

  //  分页相关的函数
    handleSizeChange(size){
    console.log(size);
    },
    handleCurrentChange(current){
     this.queryInfo.pagenum = current;
     this.getCateList(this.queryInfo)
    },


  },
  mounted() {
    this.getCateList(this.queryInfo)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>