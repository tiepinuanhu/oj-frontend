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
                    #{{ problemData?.id }}、{{ problemData?.title }}
                    <el-icon id="hidden" v-if="!problemData?.isPublic">
                      <Hide />
                    </el-icon>
                  </p>
                </div>
              </template>
              <v-md-preview :text="problemData?.content" />
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
                <el-descriptions-item label="题目标签">
                  <el-tag type="info" v-for="tag in problemData?.tags" :key="tag.id" :color="tag.color">
                    <span class="tag-text">{{ tag.name }} </span>
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="难度评级">
                  <el-button size="small" :color="levels[problemData?.level]?.color ?? '#BFBFBF'" :dark="true">
                    <span style="color: white; font-weight: 600; font-size: 14px;">
                      {{ levels[problemData?.level]?.label ?? '未知难度' }} </span>
                  </el-button>
                </el-descriptions-item>
                <el-descriptions-item label="出题人">
                  <router-link class="rlink" :to="'/user/' + problemData?.publisherId">
                    {{ problemData?.publisherName }}
                  </router-link>
                </el-descriptions-item>
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
          <monacoEditor v-if="activeTab === 'submit'" :value="code" @update:value="code = $event" />
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
      <el-tab-pane label="题目管理" name="problemEdit" v-if="userStore.user.userRole >= 1">
        <template #label>
          <el-icon style="margin: 4px;">
            <SetUp />
          </el-icon>
          题目管理
        </template>
        <ProblemEdit />
      </el-tab-pane>
      <el-tab-pane label="样例管理" name="TestCaseManage">
        <template #label>
          <el-icon style="margin: 4px;">
            <Files />
          </el-icon>
          样例管理
        </template>
         <el-upload
        ref="uploadRef"
        class="upload-demo"
        multiple
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :auto-upload="false"
      >
        <template #trigger>
          <el-button type="primary">select file</el-button>
        </template>

        <el-button class="ml-3" type="success" @click="submitUpload">
          upload to server
        </el-button>

      </el-upload>
      </el-tab-pane>



      <el-tab-pane label="数据统计" name="statistic">
        <template #label>
          <el-icon style="margin: 4px;">
            <Histogram />
          </el-icon>
          数据统计
        </template>
        <ProblemStatistic />
      </el-tab-pane>

      <!-- <el-tab-pane label="题解评论" name="solution">
        <template #label>
          <el-icon style="margin: 4px;">
            <ChatLineSquare />
          </el-icon>
          题解评论
        </template>
        <ProblemSolution />
      </el-tab-pane> -->
    </el-tabs>
  </div>



</template>

<script setup lang="ts">
import { getProblemById, uploadFiles } from '../../api/problem';
import type { ProblemVO } from '../../api/problem/types';
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router';
import { addSubmission } from '../../api/submission';
import { ElMessage } from 'element-plus';
import router from '../../router';
import { useUserStore } from '../../store/user';
import ProblemEdit from './problemEdit.vue';
import type { UploadInstance } from 'element-plus'
import instance from '../../axios/request';
import ProblemStatistic from './ProblemStatistic.vue';
import ProblemSolution from './ProblemSolution.vue';

const problemData = ref<ProblemVO>();
const code = ref('')
const activeTab = ref('problemInfo');
const currentProblemId = ref('')
const langList = ref(['cpp', 'python', 'java'])
const submitLang = ref()
const route = useRoute()
const userStore = useUserStore()

const selectedFiles = ref<File[]>([]);

const levels = [
  {
    label: '暂未评级',
    color: '#BFBFBF'
  },
  {
    label: '入门',
    color: '#FE4C61'
  },
  {
    label: '普及',
    color: '#FFC116'
  },
  {
    label: '提高',
    color: '#52C41A'
  },
  {
    label: '省选',
    color: '#3498DB'
  },
  {
    label: 'NOI / NOI+',
    color: '#0E1D69'
  },

]
const getAuthHeaders = computed(() => {
  return {
    'Authorization': `Bearer ${userStore.token}`
  };
});

const handleHttpRequest = (options: any) => {

};


// 处理上传结果
const handleSuccess = (response: any) => {
  ElMessage.success('上传成功');
  console.log('上传成功:', response);
};

const handleError = (error: any) => {
  ElMessage.error('上传失败');
  console.error('上传失败:', error);
};


async function getProblemInfo() {
  const pid = route.params.id as string
  currentProblemId.value = pid
  const res = await getProblemById(pid)
  if (res.code === 200) {
    ElMessage.success('题目获取成功')
    problemData.value = res.data
  } else {
    ElMessage.error('题目获取失败')
  }

}
const submit = async () => {
  const res = await addSubmission({
    userId: userStore.user.userId,
    problemId: currentProblemId.value,
    sourceCode: code.value,
    language: submitLang.value
  })
  if (res.code == 200) {
    ElMessage.success('提交成功')
    router.push('/submission/' + res.data.id)
  } else {
    ElMessage.error('提交失败')
  }
}
const uploadRef = ref<UploadInstance>()

const submitUpload = () => {
  uploadRef.value!.submit()
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
  font-size: 30px;
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