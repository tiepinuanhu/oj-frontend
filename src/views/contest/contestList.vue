<template>
    <div style="text-align: center; margin: 0 auto; max-width: 1400px">
        <el-card class="box-card" shadow="hover">
            <template #header>
                <div class="card-header">
                    比赛列表
                    <el-pagination @current-change="handleCurrentChange"
                     :current-page="current" :page-size="pageSize"
                        layout="total, prev, pager, next" :total="total">
                    </el-pagination>
                    <el-button-group>
                        <span>
                            <el-popconfirm v-if="userStore.user.userRole >= 1" confirm-button-text="确认"
                                cancel-button-text="取消" title="确认添加比赛?" @confirm="addContest">
                                <template #reference>
                                    <el-button type="success">
                                        <el-icon class="el-icon--left">
                                            <Plus />
                                        </el-icon>
                                        添加比赛
                                    </el-button>
                                </template>
                            </el-popconfirm>
                            <el-button type="primary" @click="load_contestList">
                                <el-icon class="el-icon--left">
                                    <Refresh />
                                </el-icon>
                                刷新
                            </el-button>
                        </span>

                    </el-button-group>
                </div>
            </template>
            <el-table :data="contestList" height="608px" :header-cell-style="{ textAlign: 'center' }"
                :cell-style="{ textAlign: 'center' }" v-loading="!finished">
                <el-table-column prop="id" label="#" min-width="10%">
                    <template #default="scope">
                        {{ scope.row.id }}
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" min-width="25%">
                    <template #default="scope">
                        <router-link class="rlink" :to="'/contest/' + scope.row.id">
                            {{ scope.row.title }}
                        </router-link>
                        <el-tag style="margin-left: 10px;" size="small" 
                            :type="tagType[status2Str(scope.row.status)]">
                            {{ status2Str(scope.row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="start" label="开始时间" min-width="15%">
                    <template #default="scope">
                        <span> {{ scope.row.startTime }} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="length" label="时长" min-width="12%">
                    <template #default="scope">
                        <span> {{ Math.floor(scope.row.duration / 60) }} min </span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" min-width="7%">
                    <template #default="scope">
                        <span> OI </span>
                    </template>
                </el-table-column>
                <el-table-column prop="isPublic" label="是否公开" min-width="15%">
                    <template #default="scope">
                        <el-switch v-model="scope.row.isPublic" size="small" disabled active-text="公开"
                            inactive-text="私有" />
                    </template>
                </el-table-column>
                <el-table-column prop="playerCount" label="参赛人数" min-width="10%">
                    <template #default="scope">
                        <router-link class="rlink" :to="'/contest/player/' + scope.row.id">
                            <el-icon id="picon" size="13">
                                <UserFilled />
                            </el-icon>
                            × {{ scope.row.playerCount }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="host" label="举办者" min-width="15%">
                    <template #default="scope">
                        <router-link class="rlink" :to="'/user/' + scope.row.hostId">
                            {{ scope.row.hostName }}
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getContestList } from '../../api/contest';
import { ElMessage } from 'element-plus';
import { pa } from 'element-plus/es/locales.mjs';
import { useUserStore } from '../../store/user';

const userStore = useUserStore()

const contestList = ref([])
const total = ref(0)
const finished = ref(false)
const current = ref(1)
const pageSize = ref(9)
const tagType = {
    '未开始': 'primary',
    '正在进行': 'success',
    '等待测评': 'success',
    '已结束': 'danger',
}
const status2Str = (status: number) => {
    if (status === 0) return '未开始'
    else if (status === 1) return '正在进行'
    return '已结束'
}
const load_contestList = async () => {
    finished.value = false;
    const res = await getContestList({
        current: current.value,
        pageSize: pageSize.value,
    })
    if (res.code === 200) {
        contestList.value = res.data.records;
        total.value = Number(res.data.total);
        finished.value = true;
    } else {
        ElMessage.error(res.message);
    }
}
const handleCurrentChange = (val: number) => {
    current.value = val;
    load_contestList();
}
const addContest = () => {

}
onMounted(() => {
    load_contestList();
})
</script>

<style scoped>
.box-card {
    margin: 10px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
}

#picon {
    vertical-align: -2px;
}
</style>