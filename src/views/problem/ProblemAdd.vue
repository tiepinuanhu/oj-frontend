<template>
  <el-row style="margin: auto;max-width: 1500px;min-width: 800px;">

    <el-col :xs="24" :sm="24" :md="17">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="card-header" style="height: 35px;">
            <p class="title">

              <el-input size="large" v-model="problemAddReq.title"
               placeholder="请输入题目标题" style="width: 200px;" />

              <el-switch v-model="problemAddReq.isPublic" 
              style="margin-left: 10px;" size="large" active-text="公开"
                inactive-text="隐藏" />
            </p>
          </div>
        </template>
        <v-md-editor height="600px" left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr 
          | link image code" :editable="true" v-model="problemAddReq.content">
        </v-md-editor>
      </el-card>
    </el-col>

    <el-col :xs="24" :sm="24" :md="7">
      <el-card class="box-card" shadow="hover">
        <el-descriptions direction="vertical" :column="1" border>
          <el-descriptions-item label="时间限制">
            <el-input v-model="problemAddReq.judgeConfig.timeLimit" style="width: 80px;" /> ms
          </el-descriptions-item>
          <el-descriptions-item label="空间限制">
            <el-input v-model="problemAddReq.judgeConfig.memoryLimit" style="width: 80px;" /> MB
          </el-descriptions-item>

          <el-descriptions-item label="题目标签">

            <el-select filterable multiple v-model="problemAddReq.tags">
              <el-option class="tag-text" v-for="tag in tags" 
              :key="tag.id" :label="tag.name" :value="tag.id">
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
            <el-select v-model="problemAddReq.level" placeholder="难度评级" style="width: 150px;">
              <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider style="margin-top: 20px; margin-bottom: 20px;" />

        <div style="text-align: center;">
          <el-button type="danger" @click="submit">
            <el-icon class="el-icon--left">
              <CircleCheck />
            </el-icon>
            提交
          </el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import type { ProblemAddRequest} from '../../api/problem/types'
import { addProblem } from '../../api/problem/index'
import type { Tag } from '../../api/tag/index'
import { getAllTags } from '../../api/tag/index'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const problemAddReq = reactive<ProblemAddRequest>({
  title: "",
  content: "",
  tags: [],
  level: 0,
  judgeConfig: {
    memoryLimit: 128, 
    timeLimit: 1000,
  },
  isPublic: false,
  publisherId: userStore.user.userId
})
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

  const res = await addProblem(problemAddReq);
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
    ElMessage.success("加载标签成功");
    tags.value = res.data;
  } else {
    ElMessage.error("加载标签失败");
  }
}

onMounted(() => {
  load_tags();
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