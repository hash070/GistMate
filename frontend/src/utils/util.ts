import {createDiscreteApi, NIcon} from 'naive-ui'
import {store} from "../store"
import {i18n} from "../main";
import {Component, h} from "vue";
import {BookOutline as BookIcon, LibraryOutline as LibraryIcon} from "@vicons/ionicons5";
import {IconFilePlus} from '@tabler/icons-vue';
import axios from "axios";

//no interceptor axios
const noInterceptorAxios = axios.create()

const {message, notification, dialog, loadingBar} = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    {
        configProviderProps: store.provider.configProviderPropsRef,
        messageProviderProps: store.provider.messageProviderProps
    }
)

export const successMsg = (msg: string) => {
    message.success(msg)
}

export const errorMsg = (msg: string) => {
    message.error(msg)
}

export const infoMsg = (msg: string) => {
    message.info(msg)
}

//start loading bar
export const startLoadingBar = () => {
    loadingBar.start()
}

//finish loading bar
export const finishLoadingBar = () => {
    loadingBar.finish()
}

//error loading bar
export const errorLoadingBar = () => {
    loadingBar.error()
}

export const iT = (key: string) => {
    return i18n.global.t(key)
}

export const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, {default: () => h(icon)})
}

//load all gists data to menu
export const loadGistsDataToMenu = () => {
    //activate menu loading spin
    store.loading.menu = true
    //get gist data, add time_stamp to avoid cache
    axios.get('/gists' + '?time_stamp=' + new Date().getTime())
        .then((res) => {
            successMsg(iT('login.success'))
            console.log(res)
            //store all gist data into store.gistsData
            store.gistsData = res.data
            // process data (array) and push into store.menuOptions
            setMenuOptionsFromAxiosResponse(res)
        })
        .catch((err) => {
            console.log(err)
            errorMsg(iT('login.failed'))
            localStorage.removeItem('gistKey')
        })
        .finally(() => {
            //deactivate menu loading spin
            store.loading.menu = false
        })
}

//set store.menuOptions from axios response
export const setMenuOptionsFromAxiosResponse = (res: any) => {
    //init new gist menu label
    let tempMenuOptions: any = [{
        label: iT('gist.create_new_gist_collection'),
        key: 'create',
        icon: renderIcon(IconFilePlus),
    }]
    res.data.map((gist: any) => {
        //if the description is "", set it to 'Untitled'
        if (gist.description === "") {
            gist.description = iT('gist.untitled')
        }

        tempMenuOptions = [
            ...tempMenuOptions,
            {
                label: gist.description,
                key: gist.id,
                icon: renderIcon(LibraryIcon),
                //file is a object, not an array
                //need to use Object.keys to get the keys
                children: Object.keys(gist.files).map((child: any) => {
                    return {
                        label: gist.files[child].filename,
                        key: gist.files[child].raw_url,
                        icon: renderIcon(BookIcon),
                        parentKey: gist.id,
                        isPublic: gist.public,
                        updatedAt: gist.updated_at,
                        // to: '/gist/'+gist.id+'/'+child.filename
                    }
                })
            }
        ]
    })
    store.menuOptions = tempMenuOptions
}

//get new axios instance to bypass global interceptors
export const getNoInterceptorAxios = () => {
    return noInterceptorAxios
}

//update gist data
export const updateGistData = (gistId: string, content: any) => {
    axios.patch('/gists/' + gistId, {
        files: {
            [store.editor.filename]: {
                content: content
            }
        }
    }).then((res) => {
        console.log(res)
        successMsg(iT('hint.save_success'))
    }).catch((err) => {
        console.log(err)
        errorMsg(iT('hint.save_failed'))
    })
}