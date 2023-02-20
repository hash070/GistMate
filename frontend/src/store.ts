import {reactive} from 'vue'
import {MaybeRef} from "naive-ui/es/discrete/src/interface";
import {lightTheme, MenuOption} from "naive-ui";

export const store = reactive({
    provider: {
        configProviderPropsRef: {
            theme: lightTheme,
        },
        messageProviderProps: {
            placement: "bottom",
            duration: 1500,
            max: 2
        },
    } as MaybeRef<any> | undefined,
    menuOptions: [] as MenuOption[],
    gistsData: null as object | null,
    loading: {
        menu: false
    }
})