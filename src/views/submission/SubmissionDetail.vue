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
                    <!-- <el-icon id="hidden" v-if="!scope.row.isPublic && !isContest">
                        <Hide />
                    </el-icon> -->
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
            <el-table-column prop="createTime" label="提交时间" min-width="13%" />
        </el-table>
    </el-row>



    <el-row style="text-align: center; margin: 0 auto; max-width: 1250px; min-width: 600px;">
        <el-col :span="24" style="min-width: 400px;margin: 0 auto;">
            <el-card class="box-card" shadow="hover">
                <template #header>
                    <div class=" card-header">
                        代码
                        <!-- <el-button-group>
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

                        </el-button-group> -->
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
                <!-- <el-table
                    :data="submissionInfo?.submissionResult" height="auto" 
                    :row-class-name="tableRowClassName"
                    :cell-style="cellStyle" :header-cell-style="{ textAlign: 'center' }">


                    <el-table-column prop="caseId" label="#" min-width="10%" />
                    <el-table-column prop="subtaskId" label="子任务" min-width="10%" />
                    <el-table-column prop="judgeResult" label="结果" min-width="40%">
                        <template #default="scope">
                            <span> {{ scope.row.submissionStatus }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" label="用时" min-width="20%">
                        <template #default="scope">
                            <span> {{ Math.floor(scope.row.submissionResult.totalTime) }} ms</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="memory" label="内存" min-width="20%">
                        <template #default="scope">
                            <span> {{ scope.row.submissionResult.memoryUsed }} </span>
                        </template>
                    </el-table-column>
                </el-table> -->
                <!-- v-show="submissionInfo?.submissionResult.statusDescription === 'Compile Error'
                     || submissionInfo?.submissionResult.statusDescription === 'System Error'" -->
                <CaseDisplay  v-if="submissionInfo" 
                :judgeResults="submissionInfo?.submissionResult?.judgeCaseResults || []" />
                <v-md-preview :text="submissionInfo?.submissionResult?.compileErrorMessage" />
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, } from "vue";
import type { SubmissionVO } from "../../api/submission/types";
import { useRoute, useRouter } from "vue-router";
import { getSubmissionById } from "../../api/submission";
import { ElMessage } from "element-plus";
import { resColor, scoreColor } from '../../assets/common'
import { useUserStore } from "../../store/user";
import CaseDisplay from "./caseDisplay.vue"



const submissionList = ref<SubmissionVO[]>([])
const submissionInfo = ref<SubmissionVO>()
const submissionId = ref(0)
const mounted = ref(false)
const judged = ref(false)
const hasTaken = ref(false)
const submittedSince = ref<number | null>(null)
const route = useRoute()
const userStore = useUserStore()


async function loadSubmission() {
    const res = await getSubmissionById(submissionId.value);
    if (res.code  == 200) {
        submissionList.value = [res.data]
        submissionInfo.value = res.data
        hasTaken.value = true
        console.info(res.data)
        ElMessage.success('success to load submission')
        
        const status = submissionInfo.value?.submissionResult.statusDescription
        if (status === 'Submitted' || status === 'Pending' || status === 'Compiling' || status === 'Judging') {
            if (status === 'Submitted') {
                if (submittedSince.value === null) {
                    submittedSince.value = Date.now()
                } else if (Date.now() - submittedSince.value > 10000) {
                    ElMessage.warning('提交状态超时，停止轮询')
                    return
                }
            } else {
                submittedSince.value = null
            }
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