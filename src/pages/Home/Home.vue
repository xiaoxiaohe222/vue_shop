<template>
  <el-container class="homeContainer">
    <!--    home的头部区域-->
    <el-header>
      <div class="logo">
        <img src="./images/heima.png" alt="logo">
        <span>电商后台管理系统</span>
      </div>
<!--退出登录按钮-->
<!--      <el-popconfirm
          confirm-button-text='确定'
          cancel-button-text='取消'
          icon="el-icon-info"
          icon-color="red"
          title="确定退出吗?"
      >
        <el-button type="info" @click="logout">退出</el-button>
      </el-popconfirm>-->

   <el-button type="info" @click="logout">退出</el-button>

    </el-header>
    <!--    home的主体区域-->
    <el-container class="homeMainContainer" >
      <!--      home的主体里面的左边导航区域-->
      <el-aside :width="isCollapse ?'64px':'200px'">
        <div @click="isCollapse = !isCollapse" class="collapse">| | |</div>
        <el-menu
            router
            :default-active="defaultActive"
            :collapse="isCollapse"
            :collapse-transition="false"
            class="el-menu-vertical-demo"
            background-color="#313642"
            text-color="#fff"
            unique-opened
            active-text-color="#4991DC">
          <el-submenu :index="nav.id+''" v-for="(nav,index) in navList" :key="nav.id">
            <template slot="title">
              <i :class="[navIcons[index]]"></i>
              <span>{{nav.authName}}</span>
            </template>
            <el-menu-item :key="subNav.id" v-for="subNav in nav.children"
                          :index="subNav.path+''"
                @click="defaultActive = subNav.path+''">
              <i class="el-icon-menu"></i>
              {{subNav.authName}}
            </el-menu-item>

          </el-submenu>

        </el-menu>


      </el-aside>


      <!--      home的主体里面的main区域-->
      <el-main>

        <router-view></router-view>

      </el-main>
    </el-container>
  </el-container>
  <!--  <div>
      home组件
      <el-button type="info" @click="logout">退出</el-button>
      <i class="el-icon-share"></i>
    </div>-->
</template>

<script>
import store from "@/vuex/store";
import {SAVE_TOKEN} from "@/vuex/mutations_type";

export default {
  name: "Home",
  data(){
    return {
      navList:[] ,  //左侧导航区域的列表数据
      navIcons:['el-icon-s-custom','el-icon-s-ticket','el-icon-s-goods','el-icon-s-order','el-icon-pie-chart'],
      isCollapse:false,  //左侧区域是否 折叠
      defaultActive:this.$route.path.split("/")[2]//默认选中的子菜单
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token")
      store.commit(SAVE_TOKEN, "")
      this.$router.replace("/login")
    }
  },
  async mounted() {


     const result = await  this.$API.reqNavList()
    if (result.meta.status === 200){
      this.navList = result.data
    }else {
      this.$message.error(result.meta.msg)
    }
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
//home最外层盒子
.homeContainer
  height 100%
//home的头部
  .el-header
    background-color: #353C3F;
    display flex
    justify-content space-between
    align-items center
    padding-left 0
    .logo
      display flex
      align-items center
      color #fff
      font-size 20px
      img
        margin-right 10px
//home的主体内容
  .homeMainContainer
    //home的主体左边的导航区域
   .el-aside
      background-color: #313642;
      .collapse
        text-align center
        line-height 30px
        color #fff
        background-color: #475062;
        cursor pointer
      .el-menu
        border-right none
        .el-submenu
          i
            margin-right 10px
  //home的主体对应的内容区域
    .el-main
      background-color: #E9EDF0;
</style>