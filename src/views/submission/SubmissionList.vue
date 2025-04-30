<template>
  <div style="text-align: center; margin: 0 auto; max-width: 1300px">

    <el-card class="box-card" shadow="hover">
      <!-- 😍😍😍😍标签顶部😍😍😍😍 -->
      <template #header>
        <div class="card-header">
          评测列表
          <el-pagination @current-change="handleCurrentChange" :current-page="current" 
          :page-size="pageSize"
            layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
          <el-button-group>
            <!-- <el-button type="success" @click="mySub">
              <el-icon class="el-icon--left">
                <UserFilled />
              </el-icon>
              我的提交
            </el-button> -->
            <el-button type="primary" @click="loadData">
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
        <el-form :inline="true" :model="filter">
          <el-form-item>
            <el-input v-model="filter.problemId" type="text" placeholder="题目编号" style="width: 100px;"
              @keyup.enter="loadData" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="filter.JudgeResult" placeholder="评测结果" style="width: 200px;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filter.language" placeholder="提交语言" style="width: 160px;">
              <!-- <el-option v-for="l in $store.state.langList" :key="l.id" :label="l.des" :value="l.id" /> -->
            </el-select>
          </el-form-item>
        </el-form>
        <el-button-group>
          <el-button type="primary" @click="loadData">
            筛选记录
          </el-button>
          <el-button type="success" @click="clear">
            显示全部
          </el-button>
        </el-button-group>
      </div>

      <!-- 😍😍😍😍数据表格😍😍😍😍 -->
      <el-table :data="submissionList" height="605px" 
      :header-cell-style="{ textAlign: 'center' }"
        :cell-style="cellStyle" v-loading="!finished">

        <el-table-column prop="id" label="#" width="120px" />

        <el-table-column prop="problemTitle" label="题目" min-width="200px">
          <template #default="scope">
            <router-link class="rlink" :to="'/problem/' + scope.row.problemId">
              {{ scope.row.problemTitle }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="userAccount" label="提交者" width="150px">
          <template #default="scope">
            <router-link class="rlink" :to="'/user/' + scope.row.userId">
              {{ scope.row.userAccount }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="SubmissionResult" label="评测状态" width="160px">
          <template #default="scope">
            <span >
              {{ scope.row.submissionStatus }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="submissionResult" label="分数" width="80px">
          <template #default="scope">
            <span style="cursor: pointer;" @click="lookSubmissionDetail(scope)"> 
              {{ scope.row.submissionResult.score }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="submissionResult" label="总用时" width="100px">
          <template #default="scope">
            <span> {{ scope.row.submissionResult.totalTime }}ms</span>
          </template>
        </el-table-column>
        <el-table-column prop="submissionResult" label="内存" width="100px">
          <template #default="scope">
            <span> {{ scope.row.submissionResult.memoryUsed / 1024}}KB </span>
          </template>
        </el-table-column>
        <el-table-column prop="submissionResult" label="语言 / 代码长度" width="150px">
          <template #default="scope">
            <!-- <span>{{ $store.state.langList[scope.row.lang].des }} / {{ scope.row.codeLength }} B </span> -->
             {{scope.row.submissionResult.codeLength}}B
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="提交时间" fixed="right" width="160px" />

      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { listProblemVOByPage } from '../../api/problem';
import type { ProblemQueryRequest, ProblemVO } from '../../api/problem/types';
import { ElMessage } from 'element-plus';
import { getAllTags, type Tag } from '../../api/tag';
import { useUserStore } from '../../store/user';
import { RouterLink, useRouter } from 'vue-router';
import qs from 'qs';
import { useRoute } from 'vue-router';
import type { SubmissionQueryDTO, SubmissionVO } from '../../api/submission/types';
import { getSubmissions } from '../../api/submission';
import { resColor, scoreColor } from '../../assets/common'

/**
 * 组件数据
 */
const submissionList = ref<SubmissionVO[]>([])

const options = [{
  value: -1,
  label: '不限结果',
}, {
  value: 4,
  label: 'Accepted',
}, {
  value: 5,
  label: 'Wrong Answer',
}, {
  value: 6,
  label: 'Time Limit Exceeded',
}, {
  value: 7,
  label: 'Memory Limit Exceeded',
}, {
  value: 8,
  label: 'Runtime Error',
}, {
  value: 9,
  label: 'Segmentation Fault',
}, {
  value: 3,
  label: 'Compilation Error',
}, {
  value: 10,
  label: 'Output Limit Exceeded',
}, {
  value: 0,
  label: 'Waiting',
}, {
  value: 1,
  label: 'Pending',
}, {
  value: 2,
  label: 'Rejudging',
}, {
  value: 11,
  label: 'Dangerous System Call',
}, {
  value: 12,
  label: 'System Error',
}, {
  value: 13,
  label: 'Canceled',
}];
const total = ref(0);
const current = ref(1);
const pageSize = ref(9);

const finished = ref(false);

const filter = ref({
  problemId: undefined,
  userId: undefined,
  JudgeResult: undefined,
  language: undefined,
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore()

/**
 * 请求后端题目数据
 * URL路径参数展示页号，修改url可以实现换页
 */
async function loadData() {
  finished.value = false;

  const param: Record<string, any> = {};
  if (filter.value.userId !== null && filter.value.userId !== undefined) param.level = filter.value.userId;
  if (filter.value.problemId !== null && filter.value.problemId !== undefined) param.level = filter.value.problemId;
  if (filter.value.language !== null && filter.value.language !== undefined) param.level = filter.value.language;
  if (filter.value.JudgeResult !== null && filter.value.JudgeResult !== undefined) param.level = filter.value.JudgeResult;

  param.current = current.value;

  const qsStr = qs.stringify(param); // 使用 qs 库拼接查询参数
  const url = `${route.path}?${qsStr}`;
  history.replaceState(history.state, null, url);

  ElMessage.info('正在加载数据...')
  /**
   * 💕💕💕...是展开语法
   */
  const res = await getSubmissions({
    current: current.value,
    pageSize: pageSize.value
  });
  if (res.code === 200) {
    ElMessage.success('success to load data')
    submissionList.value = res.data.records
    total.value = Number(res.data.total);
    finished.value = true;
  } else {
    ElMessage.warning('failed to load data')
  }
}

const lookSubmissionDetail = (scope : any) => {
  router.push('/submission/' + scope.row.id)
}
const handleCurrentChange = (val: number) => {
  current.value = val;
  loadData();
}
const cellStyle = ({ row, columnIndex }) => {
  let style = {};
  style['textAlign'] = 'center';
  if (columnIndex === 3) {
    style['font-weight'] = '500';
    style['color'] = resColor[row.submissionStatus];
  }
  if (columnIndex === 4) {
    style['font-weight'] = '500';
    console.info(row)
    style['color'] = scoreColor[Math.floor(row.submissionResult.score / 10)];
  }
  return style;
}
const clear = () => {
  filter.value.problemId = undefined;
  filter.value.userId = undefined;
  filter.value.JudgeResult = undefined;
  filter.value.language = undefined;
  loadData();
};
onMounted(() => {
  const query = route.query;
  if (query.current) {
    current.value = parseInt(query.current as string);
    current.value = current.value;
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