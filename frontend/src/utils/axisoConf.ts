import axios from "axios";
import {i18n} from "../main";
import {errorLoadingBar, finishLoadingBar, iT, startLoadingBar} from "./util";

axios.defaults.baseURL = "https://api.github.com";
// github api version
// I don't know why when I added this header, the request would fail (CORS error)
// This is a bug of github api: https://github.com/community/community/discussions/40619
// axios.defaults.headers.common['X-GitHub-Api-Version'] = '2022-11-28'
// add accept header
axios.defaults.headers.common['Accept'] = 'application/vnd.github+json'


axios.interceptors.request.use(
    config => {
        // before request is sent
        config.headers.set('Authorization', "Bearer " + localStorage.getItem('gistKey'))
        console.log('URL:', config.url)

        //get proxy settings
        if (localStorage.getItem('proxy') === 'true'){
            //base: https://api.github.com
            config.url = '/api/proxy/ghapi?url=' + config.url
        }

        startLoadingBar()
        return config
    },
    error => {
        // on request error
        errorLoadingBar()
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    function (response) {
        // http code in range 2xx will trigger this function
        // successMsg(i18n.global.t('hint.network_success'))
        console.log(iT('hint.network_success'))
        if (response.headers){
            // log x-ratelimit-limit
            console.log('x-ratelimit-limit:', response.headers['x-ratelimit-limit'])
            // log x-ratelimit-used
            console.log('x-ratelimit-used:', response.headers['x-ratelimit-used'])
            // log x-ratelimit-remaining
            console.log('x-ratelimit-remaining:', response.headers['x-ratelimit-remaining'])
            // log x-ratelimit-reset
            console.log('x-ratelimit-reset:', response.headers['x-ratelimit-reset'])
            // log time of reset date
            console.log('reset date:', new Date(response.headers['x-ratelimit-reset'] * 1000))
        }

        finishLoadingBar()
        return response
    },
    function (error) {
        // http code over range 2xx will trigger this function
        console.log('error:', error, i18n.global.t('hint.network_error'))
        errorLoadingBar()
        return Promise.reject(error)
    }
)
