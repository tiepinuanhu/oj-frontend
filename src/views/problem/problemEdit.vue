<template>
  <el-row style="margin: auto;max-width: 1500px;min-width: 800px;">

    <el-col :xs="24" :sm="24" :md="17">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="card-header" style="height: 35px;">
            <p class="title">
              <span style="vertical-align: -3px;">#{{ problemEditReq.id }}、</span>

              <el-input size="large" v-model="problemEditReq.title" placeholder="请输入题目标题" style="width: 200px;" />

              <el-switch v-model="problemEditReq.isPublic" style="margin-left: 10px;" size="large" active-text="公开"
                inactive-text="隐藏" />
            </p>
          </div>
        </template>
        <v-md-editor height="600px" left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr 
          | link image code" :editable="true" v-model="problemEditReq.content">
        </v-md-editor>
      </el-card>
    </el-col>

    <el-col :xs="24" :sm="24" :md="7">
      <el-card class="box-card" shadow="hover">
        <!-- <template #header>
          <div class="card-header">
            <div class="stat-item clickable"
              @click="this.$router.push({ path: '/submission', query: { pid: pid, res: 4, queryAll: true } })">
              <div class="stat-number">{{ problemInfo.acCnt }}</div>
              <div class="stat-label">通过</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item clickable"
              @click="this.$router.push({ path: '/submission', query: { pid: pid, queryAll: true } })">
              <div class="stat-number">{{ problemInfo.submitCnt }}</div>
              <div class="stat-label">提交</div>
            </div>
          </div>
        </template> -->
        <el-descriptions direction="vertical" :column="1" border>
          <el-descriptions-item label="时间限制">
            <el-input v-model="problemEditReq.judgeConfig.timeLimit" style="width: 80px;" /> ms
          </el-descriptions-item>
          <el-descriptions-item label="空间限制">
            <el-input v-model="problemEditReq.judgeConfig.memoryLimit" style="width: 80px;" /> MB
          </el-descriptions-item>

          <el-descriptions-item label="题目标签">
            <el-select filterable multiple v-model="problemEditReq.tags">
              <el-option class="tag-text" v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id">
                <el-tag :color="tag.color">
                  <span>{{ tag.name }} </span>
                </el-tag>
              </el-option>
            </el-select>

            <!-- <el-input v-if="inputVisible" v-model="newTag" size="small" ref="inputRef"
             @keyup.enter="addTag"
              @blur="addTag" style="width: 80px;" /> -->
            <!-- <el-button v-else class="button-new-tag ml-1" size="small" 
            @click="showInput" style="width: 80px;">
              + New Tag
            </el-button> -->
          </el-descriptions-item>
          <el-descriptions-item label="难度评级">
            <el-select v-model="problemEditReq.level" placeholder="难度评级" style="width: 150px;">
              <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider style="margin-top: 20px; margin-bottom: 20px;" />

        <div style="text-align: center;">

          <!-- <el-button type="primary" @click="this.$router.push('/problem/' + problemInfo.pid)">
            <el-icon class="el-icon--left">
              <Back />
            </el-icon>
            返回题目
          </el-button> -->

          <!-- <el-upload  multiple action="/api/problem/uploadCase" :data="{ pid: pid }">

            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>

            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
            <el-button class="ml-3" type="success" @click="submitUpload">
              upload to server
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template>
          </el-upload> -->
          <el-upload 
            ref="uploadRef"
            class="upload-demo"
            action="/problem/uploadCase"
            multiple
            :auto-upload="false">
            <template #trigger>
              <el-button type="primary" >select file</el-button>
            </template>

              <el-button class="ml-3" type="success" @click="submitUpload">
                upload to server
              </el-button>

          
          </el-upload>
          <el-button type="danger" @click="submit">
            <el-icon class="el-icon--left">
              <CircleCheck />
            </el-icon>
            提交
          </el-button>

          <!-- <el-button type="success" @click="this.$router.push('/problem/case/' + problemInfo.pid)">
            <el-icon class="el-icon--left">
              <SetUp />
            </el-icon>
            管理数据
          </el-button> -->
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import { AddLocation } from '@element-plus/icons-vue'
import type { ProblemEditRequest } from '../../api/problem/types'
import { createProblem, getProblemById, listProblemVOByPage, editProblem } from '../../api/problem/index'
import type { Tag } from '../../api/tag/index'
import { getAllTags } from '../../api/tag/index'
import { ElMessage } from 'element-plus'
import type { UploadInstance } from 'element-plus'

const uploadRef = ref<UploadInstance>()
const submitUpload = () => {
  uploadRef.value!.submit()
}
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const problemEditReq = reactive<ProblemEditRequest>({
  id: "",
  title: "",
  content: "",
  tags: [],
  level: 0,
  judgeConfig: {
    memoryLimit: 128, // 128MB,
    timeLimit: 1000,
  },
  isPublic: false,
  userId: userStore.user.userId
})
const pid = ref('')
const tags = ref<Tag[]>([])
const levels = [
  {
    value: 0,
    label: '暂未评级',
  },
  {
    value: 1,
    label: '入门',
  },
  {
    value: 2,
    label: '普及',
  },
  {
    value: 3,
    label: '提高',
  },
  {
    value: 4,
    label: '省选',
  },
  {
    value: 5,
    label: 'NOI / NOI+',
  },
]
const submit = async () => {
  problemEditReq.isPublic ? problemEditReq.isPublic = 1 : problemEditReq.isPublic = 0;
  // console.log(problemAddReq.isPublic);
  const res = await editProblem(problemEditReq);
  if (res.code == 200) {
    ElMessage.success("提交成功");
    router.push('/problems');
  } else {
    ElMessage.error("提交失败" + res.message);
  }
};
const load_tags = async () => {
  const res = await getAllTags();
  if (res.code == 200) {
    tags.value = res.data;
  } else {
    ElMessage.error("加载标签失败");
  }
}
const load_problem = async () => {
  const res = await getProblemById(pid);
  if (res.code == 200) {
    problemEditReq.id = res.data.id
    problemEditReq.title = res.data.title;
    problemEditReq.content = res.data.content;
    problemEditReq.tags = res.data.tags;
    problemEditReq.level = res.data.level;
    problemEditReq.judgeConfig = res.data.judgeConfig;
  }
}
const handleUpload = ({ file }) => {
  // 创建 FormData 并添加文件
  const formData = new FormData();
  formData.append('file', file); // 键名需与后端一致
  
  // 发送请求（自动触发 axios 拦截器）
  axios.post('/api/problem/uploadCase', formData)
  .then((response) => {
    handleSuccess(response.data, file);
  })
  .catch((error) => {
    handleError(error, file);
  });
};
onMounted(() => {
  pid.value = route.params.pid;
  problemEditReq.id = pid.value
  load_problem();
  load_tags();
  ElMessage.success("❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗");
})
</script>

<style scoped>
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
</style>