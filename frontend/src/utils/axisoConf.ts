import axios from "axios";
import {i18n} from "../main";
import {iT} from "./util";

axios.defaults.baseURL = "https://api.github.com";
// github api version
// I don't know why when I added this header, the request would fail (CORS error)
// This is a bug of github api: https://github.com/community/community/discussions/40619
// axios.defaults.headers.common['X-GitHub-Api-Version'] = '2022-11-28'


axios.interceptors.request.use(
    config => {
        // before request is sent
        config.headers.set('Authorization', "Bearer " + localStorage.getItem('gistKey'))
        return config
    },
    error => {
        // on
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    function (response) {
        // http code in range 2xx will trigger this function
        // successMsg(i18n.global.t('hint.network_success'))
        console.log(iT('hint.network_success'))
        return response
    },
    function (error) {
        // http code over range 2xx will trigger this function
        console.log('error:', error, i18n.global.t('hint.network_error'))
        return Promise.reject(error)
    }
)
