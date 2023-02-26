import {createDiscreteApi, NIcon} from 'naive-ui'
import {store} from "../store"
import {i18n} from "../main";
import {Component, h} from "vue";
import {IconBook2, IconFile, IconFilePlus, IconTrashX} from '@tabler/icons-vue';
import axios from "axios";
import {DialogApiInjection} from "naive-ui/es/dialog/src/DialogProvider";

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
    if (!store.app.silentMode) message.success(msg)
}

export const errorMsg = (msg: string) => {
    message.error(msg)
}

export const infoMsg = (msg: string) => {
    if (!store.app.silentMode) message.info(msg)
}

//start loading bar
export const startLoadingBar = () => {
    if (!store.app.silentMode) loadingBar.start()
}

//finish loading bar
export const finishLoadingBar = () => {
    if (!store.app.silentMode) loadingBar.finish()
}

//error loading bar
export const errorLoadingBar = () => {
    if (!store.app.silentMode) loadingBar.error()
}

//info notification
export const infoNotification = (title: string, msg: string) => {
    if (!store.app.silentMode) notification.info({
        title: title,
        content: msg,
    })
}

//error notification
export const errorNotification = (title: string, msg: string) => {
    notification.error({
        title: title,
        content: msg,
    })
}

//get a dialog instance
export const getDialog = (): DialogApiInjection => {
    return dialog
}

export const iT = (key: string) => {
    return i18n.global.t(key)
}

export const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, {default: () => h(icon)})
}

//random string generator
export const randomString = (length: number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//load all gists data to menu
export const loadGistsDataToMenu = (silentUpdate?: boolean) => {
    //activate menu loading spin if quietUpdate is false or undefined
    //menu sequence will be not updated
    if (!silentUpdate) {
        store.loading.menu = true
    }
    //get gist data, add time_stamp to avoid cache
    axios.get('/gists' + '?time_stamp=' + new Date().getTime())
        .then((res) => {
            if (!silentUpdate) successMsg(iT('login.success'))
            console.log('Load gist data to menu action:', res)
            //store all gist data into store.gistsData
            store.gistsData = res.data
            // process data (array) and push into store.menuOptions
            setMenuOptionsFromAxiosResponse(res)
            //TODO: set activeKey when silentUpdate is true
        })
        .catch((err) => {
            handleAxiosError(err)
        })
        .finally(() => {
            //deactivate menu loading spin
            if (!silentUpdate) {
                store.loading.menu = false
            } else {
                //TODO: don't know why the menu sequence will not updated if the menu loading status was not changed
                store.loading.menu = true
                store.loading.menu = false
            }
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
    console.log('setMenuOptionsFromAxiosResponse action:', res.data)
    res.data
        .sort((a: any, b: any) => b.updated_at.localeCompare(a.updated_at)) // Sort the array by updated_at in descending order
        .map((gist: any) => {
            //if the description is "", set it to 'Untitled'
            if (gist.description === "") {
                gist.description = iT('gist.untitled')
            }

            //if the description is "img" or "pic" or "i" or "p", don't show it in menu
            if (gist.description === "img" || gist.description === "pic" || gist.description === "i" || gist.description === "p") {
                if (localStorage.getItem('imgRepo') === null || localStorage.getItem('imgRepo') === "")//if imgRepo is not set, try to set it to the first gist with the related description
                {
                    localStorage.setItem('imgRepo', gist.id)
                    console.log('imgRepo detected:', localStorage.getItem('imgRepo'))
                }
                return
            }
            tempMenuOptions = [
                ...tempMenuOptions,
                {
                    label: gist.description,
                    key: gist.id,
                    icon: renderIcon(IconBook2),
                    //file is a object, not an array
                    //need to use Object.keys to get the keys
                    children: Object.keys(gist.files).map((child: any) => {
                        return {
                            label: gist.files[child].filename,
                            key: gist.files[child].raw_url,
                            icon: renderIcon(IconFile),
                            parentKey: gist.id,
                            isPublic: gist.public,
                            updatedAt: gist.updated_at,
                            // to: '/gist/'+gist.id+'/'+child.filename
                        }
                    }).concat({// Add the delete object to the end of children array
                        label: iT('gist.create_new_gist_file'),
                        key: 'newGist',
                        icon: renderIcon(IconFilePlus),
                        parentKey: gist.id,
                        isPublic: gist.public,
                        updatedAt: gist.updated_at,
                    }).concat({
                        label: iT('gist.delete_gist_collection'),
                        key: 'delete',
                        icon: renderIcon(IconTrashX),
                        parentKey: gist.id,
                        isPublic: gist.public,
                        updatedAt: gist.updated_at,
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


//get axios instance for lsky-pro
export const getLskyAxios = () => {
    //axios with interceptor for lsky
    let lskyAxios = axios.create()
    lskyAxios.defaults.headers.common['Content-Type'] = 'multipart/form-data'

    lskyAxios.interceptors.request.use(
        config => {
            // before request is sent
            config.headers.set('Authorization', "Bearer " + localStorage.getItem('lskyToken'))
            console.log("token:", localStorage.getItem('lskyToken'))
            console.log('URL:', config.url)
            startLoadingBar()
            return config
        },
        error => {
            // on request error
            errorLoadingBar()
            return Promise.reject(error)
        }
    )
    return lskyAxios
}

//update gist data
export const updateGistData = async (gistId: string, content: any) => {
    try {
        const res = await axios.patch(`/gists/${gistId}`, {
            files: {
                [store.editor.filename]: {
                    content: content
                }
            }
        });
        console.log(res);
        successMsg(iT('hint.save_success'));
        //restore the selected menu key
        store.menu.activeKey = res.data.files[store.editor.filename].raw_url
    } catch (err) {
        console.log(err);
        errorMsg(iT('hint.save_failed'));
    }
};

//delete gist func
export const deleteGist = (gistId: string) => {
    axios.delete(`/gists/${gistId}`)
        .then((res) => {
            infoMsg(iT('hint.delete_gist_collection_success'))
            loadGistsDataToMenu()
        })
        .catch((err) => {
            console.log(err);
            infoMsg(iT('hint.request_failed'))
        })
}

//handle error msg
export const handleAxiosError = (err: any) => {
    console.log(err)
    //network error
    if (err.response === undefined) {
        console.log('network error detected', err)
        errorMsg(iT('hint.network_error'))
        return
    }
    //403 forbidden or 401 unauthorized
    if (err.response.status === 403 || err.response.status === 401) {
        errorMsg(iT('login.failed'))
        localStorage.clear()
        store.app.isKeyInputModalShow = true
        return
    }
    //other error
    errorMsg(iT('hint.unknown_error'))
}