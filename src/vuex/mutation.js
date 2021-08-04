import {SAVE_TOKEN} from "@/vuex/mutations_type";

export default {

    //保存token的mutation
    [SAVE_TOKEN](state, token) {
        state.token = token
    }


}