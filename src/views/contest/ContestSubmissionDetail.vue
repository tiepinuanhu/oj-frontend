<template>
    <el-row style="min-width: 600px;max-width: 1250px; margin: 0 auto;">
        <el-table :data="submissionList" style="margin-bottom:10px;" :header-cell-style="{ textAlign: 'center' }"
            :cell-style="cellStyle2">
            <el-table-column prop="id" label="#" min-width="15%" />
            <el-table-column prop="problemTitle" label="题目" min-width="10%">
                <template #default="scope">
                    <router-link class="rlink" :to="/problem/ + scope.row.problemId">
                        {{ scope.row.problemTitle }}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="userAccount" label="提交者" min-width="8%">
                <template #default="scope">
                    <router-link class="rlink" :to="'/user/' + scope.row.userId">
                        {{ scope.row.userAccount }}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="submissionResult" label="评测状态" min-width="12%">
                <template #default="scope">
                    <span>
                        {{ scope.row.submissionResult.statusDescription }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="submissionResult" label="分数" min-width="5%">
                <template #default="scope">
                    <span> {{ scope.row.submissionResult.score }}</span>
                </template>
            </el-table-column>
            <el-table-column label="总用时" min-width="8%">
                <template #default="scope">
                    <span> {{ scope.row.submissionResult.totalTime }} ms</span>
                </template>
            </el-table-column>
            <el-table-column label="内存" min-width="8%">
                <template #default="scope">
                    <span> {{ scope.row.submissionResult.memoryUsed / 1024 }} KB </span>
                </template>
            </el-table-column>
            <el-table-column prop="codeLength" label="语言 / 代码长度" min-width="12%">
                <template #default="scope">
                    <span>{{ scope.row.language }} / {{ scope.row.codeLength }} B </span>
                </template>
            </el-table-column>
            <el-table-column prop="submissionTime" label="提交时间" min-width="13%" />
        </el-table>
    </el-row>



    <el-row style="text-align: center; margin: 0 auto; max-width: 1250px; min-width: 600px;">
        <el-col :span="24" style="min-width: 400px;margin: 0 auto;">
            <el-card class="box-card" shadow="hover">
                <template #header>
                    <div class=" card-header">
                        代码
                        <el-button-group>
                            <span>
                                <el-popconfirm v-if="userStore.user.userRole >= 1" confirm-button-text="确认"
                                    cancel-button-text="取消" title="确认取消成绩?">
                                    <template #reference>
                                        <el-button type="warning">
                                            <el-icon class="el-icon--left">
                                                <CloseBold />
                                            </el-icon>
                                            取消成绩
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                                <el-popconfirm v-if="userStore.user.userRole >= 1" confirm-button-text="确认"
                                    cancel-button-text="取消" title="确认重新测评?">
                                    <template #reference>
                                        <el-button type="danger">
                                            <el-icon class="el-icon--left">
                                                <Refresh />
                                            </el-icon>
                                            重新测评
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                            </span>

                        </el-button-group>
                    </div>
                </template>

                <monacoEditor v-if="submissionInfo" :value="submissionInfo?.sourceCode" :readOnly="true" />
            </el-card>
        </el-col>
    </el-row>
    <el-row style="text-align: center; margin: 0 auto; max-width: 1250px; min-width: 600px;">
        <el-col :span="24" style="min-width: 400px">
            <el-card class="box-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        测试点详情
                    </div>
                </template>
                <CaseDisplay  v-if="submissionInfo" 
                :judgeResults="submissionInfo?.submissionResult?.judgeCaseResults || []" />
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, } from "vue";
import { useRoute} from "vue-router";
import { getSubmissionInContestById } from "../../api/contest/index";
import { ElMessage } from "element-plus";
import { resColor, scoreColor } from '../../assets/common'
import { useUserStore } from "../../store/user";
import CaseDisplay from "../submission/CaseDisplay.vue"
import type { ContestSubmissionVO } from "../../api/contest/types";



const submissionList = ref<ContestSubmissionVO[]>([])
const submissionInfo = ref<ContestSubmissionVO>()
const submissionId = ref(0)
const mounted = ref(false)
const judged = ref(false)
const hasTaken = ref(false)
const route = useRoute()
const userStore = useUserStore()


async function loadSubmission() {
    const res = await getSubmissionInContestById(submissionId.value);
    if (res.code  == 200) {
        submissionList.value = [res.data]
        submissionInfo.value = res.data
        hasTaken.value = true
        console.info(res.data)
        ElMessage.success('success to load submission')
        
        if (submissionInfo.value?.submissionResult.statusDescription === 'Pending' ||
          submissionInfo.value?.submissionResult.statusDescription === 'Compiling' 
          || submissionInfo.value?.submissionResult.statusDescription === 'Judging') {
            setTimeout(() => {
              loadSubmission();
            }, 1000)
          }
    } 
    else {
        ElMessage.error(res.message)
    }
    mounted.value = true

}
const tableRowClassName = (obj : any) => {
    return (obj.row.result == 'Accepted' ? 'success' : '');
}
const cellStyle = ({ row, columnIndex } : any) =>{
    let style = {} as any;
    style['textAlign'] = 'center';
    if (columnIndex === 2) {
    style['font-weight'] = 500;
    style['color'] = resColor[row.result];
    }
    return style;
}
const cellStyle2 = ({ row, columnIndex } : any) => {
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
    mounted.value = false
    hasTaken.value = false
    submissionId.value = route.params.id
    loadSubmission()
})
</script>

<style scoped>
.box-card {
    margin: 10px;
    text-align: left;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
}

.sub {
    padding: 15px;
    border-style: solid;
    border-radius: 5px;
}
</style>