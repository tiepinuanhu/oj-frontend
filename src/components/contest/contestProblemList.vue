<template>
  <el-table :data="problemList" height="600px" :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }" v-loading="!finished">

    <el-table-column type="index" min-width="10%">
      <template  #header>
        <el-button circle @click="load_problemList" color="#626aef" plain>
          <el-icon>
            <Refresh />
          </el-icon>
        </el-button>
      </template>
      <template #default="scope"> 
        <span >{{ String.fromCharCode(scope.row.pindex  + 65) }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="title" label="标题" min-width="50%">
      <template #default="scope">
        <router-link v-if="contestInfo?.status == 1" class="rlink" :to="'/contest/' + cid + '/problem/' + scope.row.pindex">
          {{ scope.row.title }}
        </router-link>
        <router-link v-if="contestInfo?.status == 2" class="rlink" :to="'/problem/' +  scope.row.id">
          {{ scope.row.title }}
        </router-link>
      </template>
    </el-table-column>
    <el-table-column prop="gainScore" label="得分" min-width="15%" />
    <el-table-column prop="fullScore" label="满分" min-width="15%" />
  </el-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getProblemsInContest } from '../../api/contest'
import { useRoute } from 'vue-router'
import type { ContestProblemVO,ContestVO } from '../../api/contest/types'
import { getContest } from '../../api/contest'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../store/user'


const route = useRoute()
const problemList = ref<ContestProblemVO[]>([])
const cid = ref('')
const contestInfo = ref<ContestVO>()
const finished = ref(false)

const userStore = useUserStore()

const load_problemList = async () => {

  const res = await getProblemsInContest(cid.value, userStore.user.userId)
  if (res.code === 200) {
    problemList.value = res.data
    finished.value = true
  } else {

  }
}
const load_contestInfo = async () => {
  const res = await getContest(cid.value)
  if (res.code === 200) {
    contestInfo.value = res.data
  } else {
    ElMessage.error('获取比赛信息失败')
  }
}
onMounted(()=>{
  cid.value = route.params.id
  load_contestInfo()
  load_problemList()
})
</script>
