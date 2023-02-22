import {createDiscreteApi, NIcon} from 'naive-ui'
import {store} from "../store"
import {i18n} from "../main";
import {Component, h} from "vue";
import {BookOutline as BookIcon, LibraryOutline as LibraryIcon} from "@vicons/ionicons5";
import {IconFilePlus, IconTrashX} from '@tabler/icons-vue';
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
    } catch (err) {
        console.log(err);
        errorMsg(iT('hint.save_failed'));
    }
};

//delete gist func
export const deleteGist = (gistId: string) => {
    axios.delete(`https://api.github.com/gists/${gistId}`)
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
    //403 forbidden
    if (err.response.status === 403) {
        errorMsg(iT('login.failed'))
        localStorage.removeItem('gistKey')
        store.app.isKeyInputModalShow = true
        return
    }
    //other error
    errorMsg(iT('hint.unknown_error'))
}