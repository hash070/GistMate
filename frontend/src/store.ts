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
    app: {
        isKeyInputModalShow: false,
        isNewGistModalShow: false,
    },
    gistsData: [] as Array<object>,
    loading: {
        menu: false,
        editor: false
    },
    editor: {
        textVal: "",
        filename: "",
        openingFile: false,//is currently opening file
    }
})