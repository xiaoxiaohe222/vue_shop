<template>
  <div>
    欢迎你'''''''
    <h1>{{username}}</h1>
  </div>
</template>

<script>
import {mapState} from "vuex"

export default {
  name: "Welcome",
  computed:{
    ...mapState(['username'])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>