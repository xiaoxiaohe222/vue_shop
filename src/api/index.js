import ajax from './myAxios'
//登录请求
export  const reqLogin = ({username,password}) => ajax({
    url:'login',
    method:'post',
    data:{
        username,
        password
    }
})

//获取导航列表数据
export  const reqNavList = ()   => ajax({
    url:'menus'
})

//获取所有用户信息
export  const  reqUsers = ({query,pagenum,pagesize}) => ajax.get('users',{params:{query,pagenum,pagesize}})

//修改用户状态
export const reqUpdateUserStatus = ({uId,type}) => ajax.put(`users/${uId}/state/${type}`)