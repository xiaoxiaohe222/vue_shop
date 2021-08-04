<template>
  <div id="loginContainer">
    <div class="login_box">
      <div class="avatar_box">

      </div>
      <!--      表单区域-->
      <el-form ref="loginFormRef" class="loginForm" :rules="loginRules" :model="loginRuleForm">
        <el-form-item prop="username">
          <el-input
              v-model="loginRuleForm.username"
              prefix-icon="iconfont icon-user">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              v-model="loginRuleForm.password"
              prefix-icon="iconfont icon-lock"></el-input>
        </el-form-item>
        <!--        按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="toLogin">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>

      </el-form>


    </div>
  </div>
</template>

<script>
import {Form, FormItem, Input ,Message} from "element-ui"
import {SAVE_TOKEN, SAVE_USERNAME} from "@/vuex/mutations_type";

export default {
  name: "Login",
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input
  },
  data() {
    return {
      loginRuleForm: {
        username: 'admin',
        password:'123456'

      },
      loginRules:{
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    toLogin(){
      this.$refs.loginFormRef.validate(async (isSuccess)=>{
        if (!isSuccess){
          alert("输入有误")
          this.resetLoginForm()
        }else {
          //发起后台登录请求
           const  result =  await this.$API.reqLogin(this.loginRuleForm)
          if (result.meta.status === 200){
            //说明登录成功
            Message.success("登录成功")
            this.$store.commit(SAVE_TOKEN,result.data.token)
            this.$store.commit(SAVE_USERNAME,result.data.username)
            localStorage.setItem("token",result.data.token)
            this.$router.replace("/home")
          }else {
            this.resetLoginForm()
            Message.error("登录失败")
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
#loginContainer
  position relative
  width 100%
  height 100%
  background-color: #2b4b6b;

  .login_box
    position: absolute;
    left 50%
    top 50%
    transform translate(-50%, -50%)
    width 450px
    height 300px
    background-color: #fff;
    border-radius 3px

    .avatar_box
      border 10px solid #fff
      background-color: #eee;
      border-radius 50%
      position: absolute;
      top 0
      left 50%
      transform translate(-50%, -50%)
      width 130px
      height 130px
      background-image url(../../assets/logo.png)
      background-size 100% 100%
      background-repeat no-repeat
      background-clip border-box;
      box-shadow: 0 0 5px #fff;

    .loginForm
      position: absolute;
      left 0
      bottom 0
      width 100%
      padding 0 20px
      box-sizing border-box

      .btns
        display flex
        justify-content flex-end
</style>