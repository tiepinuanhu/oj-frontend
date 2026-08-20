<template>
  <div style="text-align: center; margin: 0 auto; max-width: 1300px">

    <el-card class="box-card" shadow="hover">
      <!-- 😍😍😍😍标签顶部😍😍😍😍 -->
      <template #header>
        <div class="card-header">
          题目列表
          <el-pagination  @current-change="handleCurrentChange" :background="true"
           v-model:current-page="current" v-model:page-size="pageSize"
            layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
          <el-button-group>
            <span>
              <!-- <el-popconfirm  confirm-button-text="确认"
              cancel-button-text="取消" title="确认添加题目?"
                >
                <template #reference>
                  
                </template>
              </el-popconfirm> -->
              <el-button v-if="userStore.user.userRole >= 1" @click="addProblem" type="success">
                <el-icon class="el-icon--left">
                  <Plus />
                </el-icon>
                添加题目
              </el-button>
              <el-button type="primary" @click="loadData()">
                <el-icon class="el-icon--left">
                  <Refresh />
                </el-icon>
                刷新
              </el-button>
            </span>
          </el-button-group>
        </div>
      </template>


      <!-- 😍😍😍😍😍筛选搜索😍😍😍😍😍😍 -->
      <div style="display: inline-flex; align-items: flex-start;">
        <el-form :inline="true" :model="searchParams" >
          <el-form-item>
            <el-input
              v-model="searchParams.id"
              clearable
              placeholder="题目编号"
              style="width: 120px;"
              :disabled="!!searchText?.trim()"
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="searchText"
              clearable
              placeholder="关键词搜索（标题 / 题面）"
              style="width: 280px;"
              :disabled="!!searchParams.id"
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchParams.level" placeholder="难度评级" 
            style="width: 120px;" :disabled="!!searchText?.trim()" @change="loadData">
              <el-option v-for="it in levels" :key="it.index" :label="it.label" 
              :value="it.index" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchParams.tags" multiple filterable clearable placeholder="题目标签" style="width: 300px;"
              :disabled="!!searchText?.trim()" @change="loadData">
              <el-option v-for="tag in tagList" :key="tag.name" 
              :label="tag.name" :value="tag.id">
                  <el-tag type="info" :color="tag.color">
                  <span class="tag-text">{{ tag.name }} </span>
                  </el-tag>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="clear">
            显示全部
          </el-button>
      </div>

      <!-- 😍😍😍😍数据表格😍😍😍😍 -->
      <el-table :data="problems" height="535px" :header-cell-style="{ textAlign: 'center' }"
       :cell-style="cellStyle" v-loading="loading">
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
                <router-link class="rlink" :to="'/problem/' + scope.row?.id">
                  {{ scope.row?.title }}
                </router-link>
                <el-icon id="hidden" v-if="!scope.row?.isPublic">
                  <Hide />
                </el-icon>
              </div>
              <div class="tags-right">
                <el-tag v-show="tagVisible && scope.row?.tags" type="info" v-for="tag in scope.row?.tags" 
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
            <span> {{ scope.row?.acceptedNum }} / {{ scope.row?.submittedNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="120px" />
        <el-table-column prop="publisherName" label="出题人" width="160px">
          <template #default="scope">
            <router-link class="rlink" :to="'/user/' + scope.row.publisherId">
              {{ scope.row.publisherName }}
            </router-link>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { listProblemVOByPage, searchProblemByEs } from '../../api/problem';
import type { ProblemQueryRequest, ProblemVO } from '../../api/problem/types';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { getAllTags, type Tag } from '../../api/tag';
import { useUserStore } from '../../store/user';
import { RouterLink } from 'vue-router';
import qs from 'qs';
import { useRoute, useRouter } from 'vue-router';


const userStore = useUserStore()  
const route = useRoute();
const router = useRouter();
/**
 * 组件数据
 */
const problems = ref<ProblemVO[]>([])
const total = ref(0);
const current = ref(1);
const pageSize = ref(12);
const tagVisible = ref(false);
const finished = ref(false);
const loading = ref(false);
const tagList = ref<Tag[]>([]);
/** ES 关键词（有值时走全文检索，忽略难度/标签筛选） */
const searchText = ref('');
const searchParams = reactive<ProblemQueryRequest>({
  id:  undefined,
  title: undefined,
  tags: undefined,
  userId: userStore.user.userId,
  level: undefined
});

/**
 * 请求后端题目数据：有关键词走 ES，否则走原列表筛选
 * URL路径参数展示页号，修改url可以实现换页
 */
async function loadData() {
  loading.value = true;
  finished.value = false;

  // 有题目编号时走精确 id 筛选，不再走 ES 关键词
  const problemId = normalizeProblemId(searchParams.id);
  searchParams.id = problemId;
  const keyword = problemId ? '' : searchText.value?.trim();
  if (problemId) {
    searchText.value = '';
  }

  const param: Record<string, any> = {};
  if (problemId) param.id = problemId;
  if (keyword) param.searchText = keyword;
  if (!keyword && searchParams.level !== null && searchParams.level !== undefined) {
    param.level = searchParams.level;
  }
  if (!keyword && searchParams.tags && searchParams.tags.length > 0) {
    param.tags = searchParams.tags;
  }
  param.current = current.value;

  const qsStr = qs.stringify(param);
  const url = `${route.path}?${qsStr}`;
  history.replaceState(history.state, null, url);

  try {
    const res = keyword
      ? await searchProblemByEs({
          searchText: keyword,
          userId: userStore.user.userId,
          current: current.value,
          pageSize: pageSize.value,
        })
      : await listProblemVOByPage({
          ...searchParams,
          id: problemId,
          current: current.value,
          pageSize: pageSize.value,
        });

    if (res.code === 200) {
      problems.value = res.data.records;
      total.value = Number(res.data.total);
      finished.value = true;
    } else {
      ElMessage.warning(res.message || 'failed to load data');
    }
  } catch (e) {
    ElMessage.error('加载题目失败');
  } finally {
    loading.value = false;
  }
}

/** 题目编号：空串转 undefined，非数字丢弃 */
function normalizeProblemId(id: string | undefined): string | undefined {
  if (id === null || id === undefined) return undefined;
  const trimmed = String(id).trim();
  if (!trimmed) return undefined;
  if (!/^\d+$/.test(trimmed)) {
    ElMessage.warning('题目编号须为数字');
    return undefined;
  }
  return trimmed;
}

/** 关键词搜索：回到第一页再拉取 */
const handleSearch = () => {
  current.value = 1;
  searchParams.current = 1;
  loadData();
};

const handleCurrentChange = (val: number) => {
  current.value = val;
  searchParams.current = val;
  loadData();
}
const switchTag = () => {
  tagVisible.value = !tagVisible.value;
  userStore.tagVisible = tagVisible.value;
};
const cellStyle = (columnIndex ) => {
  return { textAlign: columnIndex === 1 ? 'left' : 'center' };
};
const clear = () => {
  searchText.value = '';
  searchParams.id = undefined;
  searchParams.title = undefined;
  searchParams.tags = undefined;
  searchParams.level = undefined;
  current.value = 1;
  searchParams.current = 1;
  loadData();
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
const addProblem =  () => {
  router.push('/problem/add');
};
onMounted(() => {
  // 刷新页面后标签的可见性不变
  if (userStore.tagVisible !== null) {
    tagVisible.value = userStore.tagVisible === false;
  }
  loadTags();
  const query = route.query;
  if (query.current) {
    current.value = parseInt(query.current as string);
    searchParams.current = current.value;
  }
  if (query.id) {
    searchParams.id = String(query.id);
  }
  if (query.searchText) {
    searchText.value = query.searchText as string;
  }
  if (query.level !== undefined) {
    searchParams.level = Number(query.level);
  }
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