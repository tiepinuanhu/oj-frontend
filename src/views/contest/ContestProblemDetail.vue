<template>
  <div class="problem-detail">
    <el-tabs tab-position="top" v-model="activeTab">
      <el-tab-pane label="题目" name="problemInfo">
        <template #label>
          <el-icon style="margin: 4px;">
              <Document />
            </el-icon>
            题目详情
          </template>
        <el-row style="margin: auto;max-width: 1500px; min-width: 600px;">
          <el-col :xs="30" :sm="30" :md="18">
            <el-card class="box-card" shadow="hover">
              <template #header>
                <div class="card-header" style="height: 25px;">
                  <p class="title">
                    {{ String.fromCharCode(problemData?.pindex  + 65)  }}.            {{ problemData?.title }}
                  </p>
                </div>
              </template>
              <v-md-preview :text="problemData?.content"></v-md-preview>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6">
            <el-card class="box-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <div class="stat-item clickable">
                    <div class="stat-number">{{ problemData?.acceptedNum }}</div>
                    <div class="stat-label">通过</div>
                  </div>
                  <div class="stat-divider"></div>
                  <div class="stat-item clickable">
                    <div class="stat-number">{{ problemData?.submittedNum }}</div>
                    <div class="stat-label">提交</div>
                  </div>
                </div>
              </template>
              <el-descriptions direction="vertical" :column="1" border>
                <el-descriptions-item label="时间限制"> {{ problemData?.judgeConfig?.timeLimit }}
                  ms</el-descriptions-item>
                <el-descriptions-item label="空间限制"> {{ problemData?.judgeConfig?.memoryLimit }}
                  MB</el-descriptions-item>
                <el-descriptions-item label="比对方式"> 传统文本比对 </el-descriptions-item>
                <el-descriptions-item label="发布时间"> {{ problemData?.createTime }} </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="提交" name="submit">
        <template #label>
        <el-icon style="margin: 4px;">
            <Upload />
          </el-icon>
          提交代码
          </template> 
        <div>
          <div style="margin: 10px;">
            选择语言：
            <el-select v-model="submitLang" placeholder="选择语言" style="width: 160px;">
              <el-option v-for="l in langList" :key="l" :label="l" :value="l" />
            </el-select>
          </div>
          <el-divider />
            <monacoEditor :value="code" @update:value="code = $event" />
          <el-divider />

          <div style="text-align: center;">
            <el-button type="primary" @click="submit">
              <el-icon class="el-icon--left">
                <Upload />
              </el-icon>
              确认提交
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>



</template>

<script setup lang="ts">
import { getProblemInContest } from '../../api/contest/index'
import type { ProblemVO } from '../../api/problem/types';
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import VMdViewer from '../../components/VMdViewer.vue';
import { addSubmissionInContest } from '../../api/contest';
import { ElMessage } from 'element-plus';
import router from '../../router';
import type { ContestProblemVO } from '../../api/contest/types';
import { useUserStore } from '../../store/user';



const problemData = ref<ContestProblemVO | null>(null);
const code = ref('')
const activeTab = ref('problemInfo');
const contestId = ref("")
const problemIndexInContest = ref(0)
const langList = ref(['cpp', 'python', 'java'])
const submitLang = ref()
const route = useRoute()

/**
 * 根据cid和idx获取题目信息
 */
async function getProblemInfo() {
  const cid = route.params.cid
  const idx = route.params.idx
  contestId.value = cid
  problemIndexInContest.value = idx
  const res = await getProblemInContest(contestId.value, problemIndexInContest.value)
  if (res.code === 200) {
    ElMessage.success('获取题目信成功')
    problemData.value = res.data
    console.log(res.data)
  } else {
    console.log(res.message)
  }

}
const userStore = useUserStore()
const submit = async () => { 
  const res = await addSubmissionInContest({
    contestId:  contestId.value,
    problemId: problemData.value?.id,
    sourceCode: code.value,
    language: submitLang.value,
    userId: userStore.user.userId
  })
  if (res.code == 200) {
    ElMessage.success('提交成功')
    router.push('/contest/' + contestId.value);
  } else {
    ElMessage.error('提交失败')
  }
}

onMounted(() => {
  getProblemInfo()
}
)
</script>

<style scoped>
.problem-detail {
  width: 85%;
  margin: 0 auto
}

.box-card {
  margin: 10px;
  text-align: left;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.clickable {
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 5px;
}

.clickable:hover {
  background-color: #f5f7fa;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 3px;
}

.stat-divider {
  width: 1px;
  height: 60px;
  background-color: #e0e0e0;
  margin: 0 20px;
}

.title {
  margin: 0;
  font-size: 25px;
}

.el-tag {
  cursor: pointer;
  margin-right: 5px;
}

.tag-text {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

#hidden {
  vertical-align: -4px;
  color: #312b2b;
}
</style>