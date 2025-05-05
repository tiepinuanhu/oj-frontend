<template>
  <el-table :data="problemList" height="600px" :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }" v-loading="!finished">

    <el-table-column type="index" min-width="10%">
      <template #header>
        <el-button circle @click="load_problemList" color="#626aef" plain>
          <el-icon>
            <Refresh />
          </el-icon>
        </el-button>
      </template>
    </el-table-column>

    <el-table-column prop="title" label="标题" min-width="50%">
      <template #default="scope">
        <router-link class="rlink" :to="'/contest/' + cid + '/problem/' + scope.row.pindex">
          {{ scope.row.title }}
        </router-link>
      </template>
    </el-table-column>
    <!-- <el-table-column v-if="ctype === 'IOI'" prop="score" label="得分" min-width="15%" /> -->
    <!-- <el-table-column prop="weight" label="满分" min-width="15%" /> -->
    <!-- <el-table-column prop="publisher" label="出题人" min-width="20%">
      <template #default="scope">
        <router-link class="rlink" :to="'/user/' + scope.row.publisherUid">
          {{ scope.row.publisher }}
        </router-link>
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getProblemsInContest } from '../../api/contest'
import { useRoute } from 'vue-router'
import type { ContestProblemVO } from '../../api/contest/types'
import { ElMessage } from 'element-plus'


const route = useRoute()
const problemList = ref<ContestProblemVO[]>([])
const cid = ref(0)
const finished = ref(false)



const load_problemList = async () => {
  ElMessage.info('获取题目ing')

  const res = await getProblemsInContest(cid.value)
  if (res.code === 200) {
    problemList.value = res.data
    finished.value = true
  } else {

  }
}
onMounted(()=>{
  const pid = route.params.id
  cid.value = pid
  load_problemList()
})
</script>
