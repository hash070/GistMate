import {reactive} from 'vue'
import {MaybeRef} from "naive-ui/es/discrete/src/interface";
import {darkTheme, lightTheme} from "naive-ui";

export const store = reactive({
    configProviderPropsRef: {
        theme: lightTheme,
    }, messageProviderProps: {
        placement: "bottom",
        duration: 1500,
        max: 2
    }
} as MaybeRef<any> | undefined)