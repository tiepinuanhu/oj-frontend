import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VChart from 'vue-echarts';

// 引入 ECharts 核心模块
import * as echarts from 'echarts/core';
// 引入需要的图表类型和组件
import { BarChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册 ECharts 组件
echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, BarChart, LineChart, CanvasRenderer]
);



// markdown预览器
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';


// highlightjs 核心代码
import hljs from 'highlight.js/lib/core';
// 按需引入语言包
import cpp from 'highlight.js/lib/languages/cpp';
// codemirror 编辑器的相关资源
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
// style
import 'codemirror/lib/codemirror.css';
hljs.registerLanguage('cpp', cpp);
VMdEditor.Codemirror = Codemirror;

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

// 解决根号渲染问题
VMdEditor.xss.extend({
  // 扩展白名单
  whiteList: {
    // preserveAspectRatio 注意要小写
    svg: ['preserveaspectratio']
  }
});
VMdPreview.xss.extend({
  whiteList: {
    svg: ['preserveaspectratio']
  }
});

// VMdEditor.Codemirror = Codemirror;
VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

const app = createApp(App)

import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';
VMdEditor.use(createKatexPlugin()).use(createCopyCodePlugin());
VMdPreview.use(createKatexPlugin()).use(createCopyCodePlugin());


app.use(VMdPreview)
app.use(VMdEditor)



const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.component('VChart', VChart);

app.mount('#app')
