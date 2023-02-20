import {createDiscreteApi, NIcon} from 'naive-ui'
import {store} from "../store"
import {i18n} from "../main";
import {Component, h} from "vue";
import {BookOutline as BookIcon, LibraryOutline as LibraryIcon} from "@vicons/ionicons5";

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

//set store.menuOptions from axios response
export const setMenuOptionsFromAxiosResponse = (res: any) => {
    /*          res.data.map((gist: any) => {
            store.menuOptions = [
              ...store.menuOptions,
              {
                label: gist.description,
                key: gist.id,
                icon: renderIcon(LibraryIcon),
                //file is a object, not an array
                //need to use Object.keys to get the keys
                children: Object.keys(gist.files).map((child: any) => {
                  return {
                    label: gist.files[child].filename,
                    key: gist.files[child].filename,
                    icon: renderIcon(BookIcon),
                    // to: '/gist/'+gist.id+'/'+child.filename
                  }
                })
              }
            ]
          })*/
    //I should set store.menuOptions after the loop
    let tempMenuOptions: any = []
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
                        key: gist.files[child].filename,
                        icon: renderIcon(BookIcon),
                        // to: '/gist/'+gist.id+'/'+child.filename
                    }
                })
            }
        ]
    })
    store.menuOptions = tempMenuOptions
}