import ajax from './myAxios'

export  const reqLogin = ({username,password}) => ajax({
    url:'login',
    method:'post',
    data:{
        username,
        password
    }
})