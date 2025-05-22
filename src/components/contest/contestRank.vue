<template>
  <el-table :data="response?.data" height="600px"
   :header-cell-style="{ textAlign: 'center' }" :cell-style="CellStyle"
    :row-style="{ height: '50px' }" :row-class-name="tableRowClassName" 
                          :cell-class-name="cellClassName"
    v-loading="!finished">

    <el-table-column fixed="left" max-width="10%" min-width="60px">
      <template #header>
        <el-button circle @click="all" color="#626aef" plain>
          <el-icon>
            <Refresh />
          </el-icon>
        </el-button>
      </template>
      <template #default="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>

    <el-table-column label="用户名" fixed="left" max-width="15%" min-width="150px">
      <template #default="scope">
        <router-link class="rlink" :to="'/user/' + scope.row.userId">
          {{ scope.row.userName }}
        </router-link>
      </template>
    </el-table-column>

    <el-table-column label="总分" fixed="left" max-width="10%" min-width="100px">
      <template #default="scope">
        <div class="totScore" v-show="scope.row.submitted">{{ scope.row.totalScore }}</div>
        <div class="attach" v-show="scope.row.submitted">({{ scope.row.usedTime }} ms)</div>
        <span v-show="!scope.row.submitted"> / </span>
      </template>
    </el-table-column>

    <el-table-column v-for="(problem, pindex) in response?.problem"
     :key="pindex" max-width="10%" min-width="100px">

      <template #header>
        <router-link class="rlink" :to="'/contest/' + cid + '/problem/' + pindex"> 
          {{ String.fromCharCode(Number(pindex) + 65) }}
        </router-link>
        <div class="attach"> ({{ problem }})</div>
      </template>

      <template #default="scope">
        <div v-if="scope.row.problemDetails[pindex]" 
        :style="getScoreStyle(scope.row.problemDetails[pindex], problem)">
          {{ scope.row.problemDetails[pindex] ? scope.row.problemDetails[pindex].gainScore : '/' }}
          </div>
        <div v-if="scope.row.problemDetails[pindex]" class="attach">
          ({{ scope.row.problemDetails[pindex].timeUsed }} ms)
        </div>
      </template>
    </el-table-column>
    
  </el-table>

 
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { resColor, scoreColor } from '../../assets/common'
import {getRankByContestId} from  '../../api/contest/index';
import { Rank } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../store/user';
import { RankResponse, RankItem } from '../../api/contest/types';
const route = useRoute();
const userStore = useUserStore();
const finished = ref(false);
const response = ref<RankResponse>();
// const rankList = ref<RankItem[]>([]);
const isProblem = ref(false)
const dialogVisible = ref(false)

const cid = ref('')

const all = async () => {
  finished.value = false;
  const res = await getRankByContestId(cid.value);
  if (res.code === 200) {
    // ElMessage.success(res.message);
    // console.log("🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣" + res.message);
    response.value = res.data;
    // rankList.value = res.data.data;

    // console.log("rankList:", rankList.value?.data);

    finished.value = true;
  } else {
    ElMessage.error(res.message);
  }

}
const getScoreStyle = (cur:any, total:number) => {
  if (!cur)
    return {};
  else {
    let style = {};
    style["line-height"] = "1.2em";
    style["font-size"] = "15px";
    style["font-weight"] = 800;
    style["color"] = scoreColor[Math.floor(cur.gainScore * 10 / total)];
    return style;
  }
}
const CellStyle = ({ row, columnIndex}:any) => {
  let style = {};
  if (columnIndex === 2 && row.submitted || columnIndex > 2 && row['problemDetails'][columnIndex - 2]) {
    style['cursor'] = 'pointer';
  }
  style['text-align'] = 'center';
  // if (row['problemDetails'][columnIndex - 2] && ('firstBlood' in row['problemDetails'][columnIndex - 2])) {
  //   style['background'] = '#d9ecff';
  // }
  return style;
}
const tableRowClassName =(obj:any)=> {
  return (obj.row.userId === userStore.user.userId ? 'success' : '');
}
const cellClassName = ({ column, columnIndex }:any) =>{
  column.index = columnIndex;
}
onMounted(()=>{
  cid.value = route.params.id;
  all();
}
);
</script>

<style scoped>
.attach {
  line-height: 1em;
  font-size: 12px;
  color: var(--el-table-header-text-color);
  font-weight: 400;
}

.totScore {
  line-height: 1.2em;
  font-size: 15px;
  font-weight: 500;
}
</style>