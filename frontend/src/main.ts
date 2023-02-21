import {createApp} from 'vue'
import "./style.scss"
import App from './App.vue'
import router from "./AppRouter";
import {createI18n} from 'vue-i18n'
import "./utils/axisoConf"
// import VueI18n from 'vue-i18n'
import en_US from "./locale/en-US.json";
import ja_JP from "./locale/ja-JP.json";
import zh_CN from "./locale/zh-CN.json";
// @ts-ignore
import {VMdEditor, VMdPreview} from "./utils/mdEditor";

export const i18n = createI18n({
    legacy: false,
    locale: 'en-US', // set default locale
    fallbackLocal: 'en-US', // set fallback locale
    messages: {
        "en-US": en_US,
        "ja-JP": ja_JP,
        "zh-CN": zh_CN
    }
})

createApp(App)
    .use(i18n)
    .use(router)
    .use(VMdEditor)
    .use(VMdPreview)
    .mount('#app')
