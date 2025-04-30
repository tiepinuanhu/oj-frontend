<template>
<v-md-preview
    :text="text"
    @copy-code-success="handleCopyCodeSuccess"
></v-md-preview>
</template>

<script>
import { ElMessage } from 'element-plus';


export default {
data() {
    return {
    text: "",
    };
},
methods: {
    handleCopyCodeSuccess(code) {
        ElMessage.success("复制成功");
    },
},
};
</script>

<style scoped>
/* 针对预览区域 */
.v-md-editor__preview {
  font-size: 16px; /* 调整为合适大小，如 14px、16px */
}

/* 针对编辑区域（若编辑时字体也大） */
.v-md-editor__editor.cm-s-github {
  font-size: 16px;
}
</style>
