<template>
  <el-row>
    <el-input v-model="addpid" style="width: 150px;" placeholder="添加题目pid" @keyup.enter="addProblem" />
    <el-button-group style="margin: 5px;">
      <span>
        <el-button type="success" :disabled="!addpid.length" @click="addProblem">
          <el-icon class="el-icon--left">
            <Plus />
          </el-icon>
          添加
        </el-button>
        <el-button type="danger" @click="updateContestProblem">
          保存修改
        </el-button>
      </span>
    </el-button-group>
    <el-divider />
    <div class="draggable">
      <draggable :list="problemList" itemKey="pid" ghost-class="ghost" chosen-class="chosenClass" animation="300">
        <template #item="{ element }">
          <div class="item">
            #{{ element.problemId }}、{{ element.title }}
          </div>
        </template>
      </draggable>
    </div>

  </el-row>
  <el-row>
    <el-table style="margin-left: 30px;min-height: 600px;" :data="problemList" min-height="600px"
        :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">

        <el-table-column prop="problemId" label="pid" min-width="10%" />

        <el-table-column prop="title" label="标题" min-width="25%">
          <template #default="scope">
            <router-link class="rlink" :to="'/problem/' + scope.row.problemId">
              {{ scope.row.title }}
            </router-link>
            <el-icon id="hidden" v-if="!scope.row.isPublic">
              <Hide />
            </el-icon>
          </template>
        </el-table-column>

        <el-table-column prop="problemIndex" label="顺序" min-width="15%">
          <template #default="scope">
            <el-input v-model="scope.row.problemIndex" style="height:25px; width: 30px;" />
          </template>
        </el-table-column>

        <el-table-column prop="fullScore" label="满分" min-width="17%">
          <template #default="scope">
            <el-input v-model="scope.row.fullScore" style="height:25px; width: 50px;" />
          </template>
        </el-table-column>



        <el-table-column prop="createTime" label="发布时间" min-width="20%" />

        <el-table-column label="出题人" min-width="18%">
          <template #default="scope">
            <router-link class="rlink" :to="'/user/' + scope.row.publisherId">
              {{ scope.row.publisherName }}
            </router-link>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="删除" min-width="10%">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="problemList.splice(scope.$index, 1)">
              <el-icon>
                <CloseBold />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  </el-row>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { AddingProblem, ContestProblemVO, ContestProblemSimpleVO } from '../../api/contest/types'
import { checkProblemCanUsedInContest, getProblemById } from '../../api/problem/index'
import { updateContestProblems, getContestProblemss, } from '../../api/contest/index'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../store/user'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore();

const problemList = ref<ContestProblemSimpleVO[]>([])
// const problemAddList = reactive<AddingProblem[]>([])
const total = ref(0)
const cid = ref("")
const currentPage = ref(1)
const addpid = ref('')
const addProblem = async () => {
  ElMessage.info('添加题目pid')
  // 检验题目是否已经添加过
  for (let i = 0; i < problemList.value.length; i++) {
    if (problemList.value[i].problemId === addpid.value) {
      ElMessage.error('题目已存在');
      addpid.value = '';
      return;
    }
  }
  // 验证题目是否存在
  const res = await checkProblemCanUsedInContest(cid.value, addpid.value);
  if (res.code === 200) {
    problemList.value.push(res.data);
    addpid.value = '';
    ElMessage.success('添加成功');
  } else {
    ElMessage.error('题目不存在');
  }
}
const updateContestProblem = async () => {
  const res = await updateContestProblems({
    contestId: cid.value,
    problems: problemList.value
  });
  if (res.code === 200) {
    ElMessage.success('修改成功');
  } else {
    ElMessage.error('修改失败');
  }
  all()

}
const all = async () => {
  const res = await getContestProblemss(cid.value);
  if (res.code === 200) {
    problemList.value = res.data;
    ElMessage.success('获取题目成功');
  } else {
    ElMessage.error('获取题目失败');
  }
}

onMounted(() => {
  cid.value = route.params.id;
  all();
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.draggable {
  /* width: 300px; */
  display: flex;
}

.draggable>div:nth-of-type(1) {
  flex: 1;
}

.draggable>div:nth-of-type(2) {
  width: 270px;
  padding-left: 20px;
}

.item {
  border: solid 1px #eee;
  padding: 6px 10px;
  text-align: left;
}

.item:hover {
  cursor: move;
}

.item+.item {
  margin-top: 10px;
}

.ghost {
  border: solid 1px rgb(19, 41, 239);
}

.chosenClass {
  background-color: #f1f1f1;
}
</style>