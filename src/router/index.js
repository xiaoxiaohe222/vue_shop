import VueRouter from 'vue-router'
import Vue from "vue"
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login/Login";
import Welcome from "@/pages/Home/Welcome/Welcome";
import Users from "@/pages/Home/Users/Users";
import Roles from "@/pages/Home/Roles/Roles";
import Rights from "@/pages/Home/Rights/Rights";
import GoodCategory from "@/pages/Home/GoodCategory/GoodCategory";

import store from "@/vuex/store";

Vue.use(VueRouter)


let router = new VueRouter({
    mode:'history',
    routes: [
        { name: "home",path: "/home", component: Home,redirect: "/home/welcome",
            children:[
                { path:"welcome", component:Welcome },
                { path:"users", component:Users },
                { path:"roles", component:Roles },
                { path:"rights", component:Rights },
                { path:"categories", component:GoodCategory },
            ]
        },
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
