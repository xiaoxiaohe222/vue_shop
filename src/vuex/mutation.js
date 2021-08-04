import {SAVE_TOKEN,SAVE_USERNAME} from "@/vuex/mutations_type";

export default {

    //保存token的mutation
    [SAVE_TOKEN](state, token) {
        state.token = token
    },
    //保存用户名
    [SAVE_USERNAME](state,username){
        state.username=username;
    }


}