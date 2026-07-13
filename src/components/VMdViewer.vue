<template>
  <v-md-preview
    :text="text"
    @copy-code-success="handleCopyCodeSuccess"
  />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';

withDefaults(
  defineProps<{
    text?: string;
  }>(),
  {
    text: '',
  }
);

const handleCopyCodeSuccess = () => {
  ElMessage.success('复制成功');
};
</script>

<style scoped>
.v-md-editor__preview {
  font-size: 16px;
}

.v-md-editor__editor.cm-s-github {
  font-size: 16px;
}
</style>
