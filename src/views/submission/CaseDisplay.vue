<template>
  <div>
    <el-collapse v-if="judgeResults.length > 0">
      <el-collapse-item  v-for="caseResult in judgeResults" :key="caseResult.index">
        <template #title>

          <el-col :span="6">
            <span class="tag">
              Case #{{ caseResult.index }}
            </span>
          </el-col>

          <el-col :span="4">
            <span class="tag" :style="{ 'color': resColor[caseResult.judgeResult] }">
              {{ caseResult.judgeResult }}
            </span>
          </el-col>

          <el-col :span="5">
            <span class="tag" >
              得分：{{ caseResult.gainScore }} / {{ caseResult.fullScore }}
            </span>
          </el-col>
          <el-col :span="5">
            <span class="tag">
              time: {{ caseResult.timeCost }} ms
            </span>
          </el-col>

          <el-col :span="5">
            <span class="tag">
              memory: {{ caseResult.memoryUsed / 1024}}KB
            </span>
          </el-col>
        </template>
        <div class="sub" :style="{ 'color': resColor[caseResult.judgeResult] }">
          <span class="tag">
            input
          </span>
          <pre>{{ caseResult.input }}</pre>
          <span class="tag">
            output
          </span>
          <pre>{{ caseResult.output }}</pre>
          <span class="tag">
            ans
          </span>
          <pre>{{ caseResult.ans }}</pre>
          <!-- <span class="tag">
            checker
          </span> -->
          <!-- <pre>{{ caseResult.compareResult }}</pre> -->
        </div>


      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { resColor } from '@/assets/common'
import { onMounted } from 'vue';

const props = defineProps({
  judgeResults: {
    type: Array as () => JudgeCaseResult[],
    required: true
  }
});

onMounted(() => {
  console.log("❗❗❗❗❗❗"+props.judgeResults)
})
</script>

<style scoped>
pre {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  display: block;
  max-height: 160px;
  overflow: auto;
  padding: 10px;
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 400;
  line-height: 1;
  word-break: break-all;
  word-wrap: break-word;
  color: #333;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.el-collapse {
  --el-collapse-header-height: 40px;
}

.el-collapse :deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

.sub {
  padding: 15px;
  border-style: solid;
  border-radius: 5px;
  border-width: 1.5px;
}

.tag {
  align-items: center;
  display: flex;
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-weight: 600;
  font-size: 13.5px;
  font-feature-settings: "liga" 0, "calt" 0;
  font-variation-settings: normal;
  line-height: 18px;
  letter-spacing: 0px;
  color: #606266;
}

:deep(.el-icon) {
  margin-right: 5px;
}
</style>