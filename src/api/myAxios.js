import axios from "axios";
import router from "@/router";
import store from "@/vuex/store";
import { Message } from 'element-ui'
const instance = axios.create({
    baseURL:'http://127.0.0.1:8888/api/private/v1/'
})

instance.interceptors.request.use((config)=>{

    if (router.currentRoute.path !== '/login'){ //如果不是登录请求则都需要携带上token
        let token  = localStorage.getItem("token") || store.state.token
        if (!token){
            throw "尚未登录,请先登录"
        }else {
            config.headers.authorization = token
        }
    }

    return config;
})


instance.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    console.dir(error);
    //统一处理失败的情况
    if (!error.response){
        //说明是发送请求前抛出的错误

        if (router.currentRoute.path!== '/login'){
            router.replace("/login")
        }
    }else {
        if (error.response.status === 401){
            //说明未登录
            if (router.currentRoute.path!== '/login'){
                router.replace("/login")
            }
        }else if (error.response.status === 403){
            alert("权限不够")
        }else if (error.response.status === 404){
            alert(error.response.statusText)
        }
        else {
            Message.error("请求出错")
        }

    }

    return new Promise(()=>{}); //返回一个pending状态的数据
});

export default instance;
