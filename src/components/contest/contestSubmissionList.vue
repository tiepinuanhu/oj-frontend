<template>
    <div class="header">
        <div class="left-controls">
            <el-checkbox v-model="selfOnly" label="只看自己" @change="loadData" />
        </div>
        <el-pagination v-if="!(selfOnly)" @current-change="handleCurrentChange" :current-page="current"
            :page-size="pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
        <el-button type="primary" @click="loadData">
            <el-icon class="el-icon--left">
                <Refresh />
            </el-icon>
            刷新
        </el-button>
    </div>

    <!-- 😍😍😍😍数据表格😍😍😍😍 -->
    <el-table :data="submissionList" height="605px" :header-cell-style="{ textAlign: 'center' }" :cell-style="cellStyle"
        v-loading="!finished">

        <el-table-column prop="id" label="#" width="120px" />
        <el-table-column prop="problemIndex" label="题号" widt21h="120px">
            <template #default="scope">
                {{ String.fromCharCode(scope.row.problemIndex + 65) }}
            </template>
        </el-table-column> 
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
                <span>
                    {{ scope.row.submissionResult.statusDescription }}
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
                <span> {{ scope.row.submissionResult.totalTime }} ms</span>
            </template>
        </el-table-column>
        <el-table-column prop="submissionResult" label="内存" width="100px">
            <template #default="scope">
                <span> {{ scope.row.submissionResult.memoryUsed / 1024 }} KB </span>
            </template>
        </el-table-column>
        <el-table-column prop="submissionResult" label="语言 / 代码长度" width="150px">
            <template #default="scope">
                <span>{{ scope.row.language }} / {{ scope.row.codeLength }} B </span>
            </template>
        </el-table-column>

        <el-table-column prop="submissionTime" label="提交时间" fixed="right" width="160px" />

    </el-table>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import type { ContestSubmissionVO } from '../../api/contest/types';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../store/user';
import { RouterLink, useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { getSubmissionsInContest } from '../../api/contest/index';
import { resColor, scoreColor } from '../../assets/common'

/**
 * 组件数据
 */
const submissionList = ref<ContestSubmissionVO[]>([])

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
const pageSize = ref(8);

const finished = ref(false);

const selfOnly = ref(false);

const route = useRoute();
const router = useRouter();
const userStore = useUserStore()
const cid = ref('')
/**
 * 请求后端题目数据
 * URL路径参数展示页号，修改url可以实现换页
 */
async function loadData() {
    finished.value = false;

    // ElMessage.info('正在加载数据...')
    /**
     * 💕💕💕...是展开语法
     */
    const res = await getSubmissionsInContest({
        current: current.value,
        pageSize: pageSize.value,
        contestId: cid.value,
        userId: userStore.user.userId,
        selfOnly: selfOnly.value
    });
    if (res.code === 200) {
        // ElMessage.success('success to load data ❗❗❗❗❗')
        submissionList.value = res.data.records
        total.value = Number(res.data.total);
        finished.value = true;
    } else {
        ElMessage.warning('failed to load data')
    }
}

const lookSubmissionDetail = (scope: any) => {
    router.push('/contest/submission/' + scope.row.id)
}
const handleCurrentChange = (val: number) => {
    current.value = val;
    loadData();
}
const cellStyle = ({ row, columnIndex }: any) => {
    let style = {} as any;
    style['textAlign'] = 'center';
    if (columnIndex === 3) {
        style['font-weight'] = '500';
        style['color'] = resColor[row.submissionResult.statusDescription];
    }
    if (columnIndex === 4) {
        style['font-weight'] = '500';
        console.info(row)
        style['color'] = scoreColor[Math.floor(row.submissionResult.score / 10)];
    }
    return style;
}
onMounted(() => {
    cid.value = route.params.id
    loadData();
});

</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.left-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>