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

//添加用户
export  const reqAddUser = ({username,password,email,mobile}) => ajax({
    url:'users',
    method:'post',
    data:{
        username,
        password,
        email,
        mobile
    }
})

//修改用户
export  const reqUpdateUser = ({id,email,mobile}) => ajax.put(`users/${id}`,{
        email,
        mobile
})
//根据用户id查询数据
export const reqUserById = (id) => ajax(`users/${id}`)

//根据id删除用户
export  const reqDelUserById = (id) => ajax.delete(`users/${id}`)