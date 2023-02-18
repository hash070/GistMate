import {createDiscreteApi, NIcon} from 'naive-ui'
import {store} from "../store"
import {i18n} from "../main";
import {Component, h} from "vue";

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