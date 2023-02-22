// import Editor

/*// @ts-ignore
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor.js';
// import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
// @ts-ignore
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';*/

import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

// codemirror 编辑器的相关资源
// @ts-ignore
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// import style
import 'codemirror/lib/codemirror.css';
// import tip plugin
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index';
import '@kangc/v-md-editor/lib/plugins/tip/tip.css';
// import mermaid plugin
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';
import 'mermaid/dist/mermaid.min.js'
import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/npm';
// import todolist plugin
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
// import emoji plugin
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
// import katex plugin
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/npm';
import 'katex/dist/katex.min.js';
import 'katex/dist/katex.min.css';
// import highlight-lines plugin
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css';
// import copy-code plugin
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
// import align plugin
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';

// import languages
// enUS
import enUS from '@kangc/v-md-editor/lib/lang/en-US';
// zhCN
import zhCN from '@kangc/v-md-editor/lib/lang/zh-CN';

// import preview component
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';

VMdEditor.use(githubTheme, {
    Hljs: hljs
});

VMdPreview.use(githubTheme, {
    Hljs: hljs
});

//Load mermaid plugin
VMdEditor.use(createMermaidPlugin());
//Load emoji plugin
VMdEditor.use(createEmojiPlugin());
//Load katex plugin
VMdEditor.use(createKatexPlugin());
//Load tip plugin
VMdEditor.use(createTipPlugin());
//Load todolist plugin
VMdEditor.use(createTodoListPlugin());
//Load highlight-lines plugin
VMdEditor.use(createHighlightLinesPlugin());
//Load code-copy plugin
VMdEditor.use(createCopyCodePlugin());
//Load align plugin
VMdEditor.use(createAlignPlugin());

//Load all plugins into VMdPreview
VMdPreview.use(createMermaidPlugin());
VMdPreview.use(createEmojiPlugin());
VMdPreview.use(createKatexPlugin());
VMdPreview.use(createTipPlugin());
VMdPreview.use(createTodoListPlugin());
VMdPreview.use(createHighlightLinesPlugin());
VMdPreview.use(createCopyCodePlugin());
VMdPreview.use(createAlignPlugin());

//Load codemirror plugin
VMdEditor.Codemirror = Codemirror;

//change language function
export const changeMDELanguage = (lang) => {
    if (lang === 'en-US') {
        VMdEditor.lang.use('en-US', enUS);
        return;
    } else if (lang === 'zh-CN') {
        VMdEditor.lang.use('zh-CN', zhCN);
        return;
    }
    //fallback to en-US
    VMdEditor.lang.use('en-US', enUS);
}

export {VMdEditor, VMdPreview};

