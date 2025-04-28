<template>
  <div style="text-align: center; margin: 0 auto; max-width: 1300px">

    <el-card class="box-card" shadow="hover">
      <!-- 😍😍😍😍标签顶部😍😍😍😍 -->
      <template #header>
        <div class="card-header">
          题目列表
          <el-pagination  @current-change="handleCurrentChange" :background="true"
           v-model:current-page="current" v-model:page-size="pageSize"
            layout="prev, pager, next, jumper" :total="total">
          </el-pagination>

          <el-button-group>
            <el-button type="primary" @click="loadData()">
              <el-icon class="el-icon--left">
                <Refresh />
              </el-icon>
              刷新
            </el-button>
          </el-button-group>
        </div>
      </template>


      <!-- 😍😍😍😍😍筛选搜索😍😍😍😍😍😍 -->
      <div style="display: inline-flex;">
        <el-form :inline="true" :model="searchParams" >
          <el-form-item>
            <el-input v-model="searchParams.title" type="text" placeholder="题目标题或内容" 
            style="width: 280px;" @keyup.enter="loadData" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchParams.level" placeholder="难度评级" 
            style="width: 120px;" @change="loadData">
              <el-option v-for="it in levels" :key="it.index" :label="it.label" 
              :value="it.index" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchParams.tags" multiple filterable clearable placeholder="题目标签" style="width: 300px;"
              @change="loadData">
              <el-option v-for="tag in tagList" :key="tag" :label="tag" :value="tag">
                <el-tag v-show="tagVisible" type="info" :color="getTagColor(tag)">
                  <span class="tag-text">{{ tag }} </span>
                </el-tag>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 😍😍😍😍数据表格😍😍😍😍 -->
      <el-table :data="problems" height="535px" :header-cell-style="{ textAlign: 'center' }"
       :cell-style="cellStyle" v-loading="!finished">
        <el-table-column prop="id" label="#" width="100px" />
        <el-table-column prop="title" width="auto" label="标题">
          <template #header>
            <div class="title-container">
              <div class="title-left">标题</div>
              <div class="tags-right">
                <el-button plain size="small" round @click="switchTag">
                  {{ tagVisible ? '隐藏标签' : '显示标签' }}
                </el-button>
              </div>
            </div>
          </template>
          <template #default="scope">
            <div class="title-container">
              <div class="title-left">
                <router-link class="rlink" :to="'/problem/' + scope.row.id">
                  {{ scope.row.title }}
                </router-link>
                <!-- <el-icon id="hidden" v-if="!scope.row.isPublic">
                  <Hide />
                </el-icon> -->
              </div>
              <div class="tags-right">
                <el-tag v-show="tagVisible" type="info" v-for="tag in scope.row.tags" 
                :key="tag.id"
                  :color="tag.color">
                  <span class="tag-text">{{ tag.name }} </span>
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="level" label="难度评级" width="150px">
          <template #default="scope">
            <el-button size="small" :color="levels[scope.row.level]?.color ?? '#BFBFBF'" :dark="true">
              <span class="tag-text"> {{ levels[scope.row.level]?.label ?? '未知难度' }} </span>
            </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="AC/提交" width="120px">
          <template #default="scope">
            <span> {{ scope.row.acceptedNum }} / {{ scope.row.submittedNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="120px" />
        <el-table-column prop="userVO" label="出题人" width="160px">
          <template #default="scope">
            <router-link class="rlink" :to="'/user/' + scope.row.userVO.id">
              {{ scope.row.userVO.userName }}
            </router-link>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive,ref,onMounted } from 'vue';
import { listProblemVOByPage } from '../../api/problem';
import type { ProblemQueryRequest, ProblemVO } from '../../api/problem/types';
import { ElMessage } from 'element-plus';
import { getAllTags, type Tag } from '../../api/tag';
import { useUserStore } from '../../store/user';
import { RouterLink } from 'vue-router'
const problems = ref<ProblemVO[]>([])
const total = ref(0);
const current = ref(1);
const pageSize = ref(12);
const tagVisible = ref(true);
const finished = ref(false);
const tagList = ref([]);
const searchParams = reactive<ProblemQueryRequest>({
  pageSize: 12,
  current: 1,
  id:  undefined,
  title: undefined,
  tags: undefined,
  userId: undefined,
  level: undefined
});
const tagColorList =  [
  '#2d8cf0',
  '#3f51b5',
  '#9c27b0',
  '#009688',
  '#19be6b',
  '#689f38',
  '#ff9900',
  '#E91E63',
  '#ed4014'
]

async function loadData() {
  finished.value = false;
  let url = location.pathname;
  if (current.value > 1) {
    searchParams.current = current;
  }
  const res = await listProblemVOByPage(
    searchParams
  );
  if (res.code === 200) {
    // ElMessage.success('success to load data')

    problems.value = res.data.records
    total.value = Number(res.data.total);
    finished.value = true;
  } else {
    ElMessage.warning('failed to load data')
  }
}
const hash = (str : string) => {
  let t = 0;
  for (let i = 0; i < str.length; i++)
    t = 31 * t + str.charCodeAt(i);
  return t;
}
const getTagColor = (tag : string) => {
  return tagColorList[hash(tag) % tagColorList.length];
}

const handleCurrentChange = (val: number) => {
  searchParams.current = val;
  loadData();
}
const userStore = useUserStore()  
const switchTag = () => {
  tagVisible.value = !tagVisible.value;
  userStore.tagVisible = tagVisible.value;
};
const cellStyle = (columnIndex ) => {
  return { textAlign: columnIndex === 1 ? 'left' : 'center' };
};
async function loadTags() {
  const res = await getAllTags();
  if (res.code === 200)  {
    // ElMessage.success('success to load tags')
    tagList.value = res.data;
  } else {
    ElMessage.error('failed to load tags')
  }
}
onMounted(() => {
  // 刷新页面后标签的可见性不变
  if (userStore.tagVisible !== null) {
    tagVisible.value = userStore.tagVisible === true;
  }
  loadTags();
  loadData();
});

const levels = [
{
  index: 0,
  label: '暂未评级',
  color: '#BFBFBF'
},
{
  index: 1,
  label: '入门',
  color: '#FE4C61'
},
{
  index: 2,
  label: '普及',
  color: '#FFC116'
},
{
  index: 3,
  label: '提高',
  color: '#52C41A'
},
{
  index: 4,
  label: '省选',
  color: '#3498DB'
},
{
  index: 5,
  label: 'NOI / NOI+',
  color: '#0E1D69'
},
{
  index: 6,
  label: '不限难度',
},
]
</script>

<style scoped>
.rlink:hover {
  color: #2d71d7;
}
.box-card {
  height: auto;
  margin: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-left {
  display: flex;
  align-items: center;
}

.tags-right {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.el-tag {
  cursor: pointer;
  margin-left: 5px;
}

.tag-text {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.el-form--inline .el-form-item {
  margin-right: 15px;
}
</style>