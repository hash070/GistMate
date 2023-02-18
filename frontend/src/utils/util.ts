import {createDiscreteApi, NIcon} from 'naive-ui'
import {store} from "../store"
import {i18n} from "../main";
import {Component, h} from "vue";

const {message, notification, dialog, loadingBar} = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    {
        configProviderProps: store.configProviderPropsRef,
        messageProviderProps: store.messageProviderProps
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

export const iT = (key: string) => {
    return i18n.global.t(key)
}

export const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, {default: () => h(icon)})
}