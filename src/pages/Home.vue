<template>
  <div>
    home组件
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
import store from "@/vuex/store";
import {SAVE_TOKEN} from "@/vuex/mutations_type";

export default {
  name: "Home",
  methods:{
    logout(){
      localStorage.removeItem("token")
      store.commit(SAVE_TOKEN,"")
      this.$router.replace("/login")
    }
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>