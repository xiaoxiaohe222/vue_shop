import VueRouter from 'vue-router'
import Vue from "vue"
import Home from "@/pages/Home";
import Login from "@/pages/Login/Login";
import store from "@/vuex/store";

Vue.use(VueRouter)


let router = new VueRouter({
    mode:'history',
    routes: [
        { name: "home",path: "/home", component: Home },
        { name: "login",path: "/login",component: Login},
        {path: "/",redirect:"/login"}
    ]
})

//配置路由导航守卫
router.beforeEach((to, from, next) => {
    //如果用户没有登录则跳转登录页面
    if (to.path === '/login'){
        next()
    }else {
        if (!localStorage.getItem("token") && !store.state.token){
            next("/login")
        }else {
            next();   //暂时不做任何检查 直接放行
        }
    }





})


export default router;
