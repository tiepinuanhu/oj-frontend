<template>
  <div style="margin: auto; max-width: 1500px;">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <p class="title">{{ contestInfo?.title }}
                <el-button v-show="canRegistered && !isRegistered" type="danger"
                 plain @click="regContest">点击报名</el-button>
                <el-button v-show="canRegistered && isRegistered" type="info" disabled>
                已报名</el-button>
              </p>
            </div>
          </template>
          <el-descriptions :column="6" size="large">
            <el-descriptions-item label="开始时间">{{ contestInfo?.startTime }}</el-descriptions-item>
            <el-descriptions-item label="结束时间">{{ contestInfo?.endTime }}</el-descriptions-item>
            <el-descriptions-item label="比赛时长">{{ Math.floor(contestInfo?.duration) }} min</el-descriptions-item>
            <el-descriptions-item label="比赛类型">OI</el-descriptions-item>
            <el-descriptions-item label="比赛状态">
              <el-tag style="margin-left: 10px;" :type="tagType[status2Str(contestInfo?.status)]">
                {{ status2Str(contestInfo?.status) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="参赛人数">
              <router-link class="rlink" :to="'/contest/player/' + contestInfo?.id">
                <el-icon id="picon" size="13">
                  <UserFilled />
                </el-icon>
                × {{ contestInfo?.playerCount }}
              </router-link>
            </el-descriptions-item>
          </el-descriptions>
          <el-progress :text-inside="true" :stroke-width="16"
           :percentage="percentage" status="success"
            style="margin: 5px;" />







            
          <el-tabs v-model="activeName" class="demo-tabs" @tab-change="switchTab">
            <el-tab-pane name="main">
              <template #label>
                <el-icon style="margin: 4px;">
                  <Place />
                </el-icon>
                比赛介绍
              </template>
              <v-md-preview :text="contestInfo?.description" style="min-height: 600px;" />
            </el-tab-pane>
            
            <el-tab-pane name="problemList" v-if="contestInfo?.status >=1">
              <template #label>
                <el-icon style="margin: 4px;">
                  <Document />
                </el-icon>
                题目列表
              </template>
              <contestProblemList ref="problemList" />
            </el-tab-pane>

            <el-tab-pane name="submission" v-if="contestInfo?.status >=1">
              <template #label>
                <el-icon style="margin: 4px;">
                  <DataAnalysis />
                </el-icon>
                提交记录
              </template>
              <contestSubmissionList ref="submission" />
            </el-tab-pane>

            <el-tab-pane name="rank" v-if="contestInfo?.status >= 1">
              <template #label>
                <el-icon style="margin: 4px;">
                  <DataLine />
                </el-icon>
                排行榜
              </template>
              <contestRank ref="rank" />
            </el-tab-pane>

            <el-tab-pane name="manageC" v-if="userStore.user.userRole >= 1">
              <template #label>
                <el-icon style="margin: 4px;">
                  <SetUp />
                </el-icon>
                比赛管理
              </template>

              <el-row>
                <el-col :xs="24" :sm="24" :md="15" style="margin-bottom: 20px;">
                  <v-md-editor height="580px"
                    left-toolbar="undo redo clear | h bold italic strikethrough quote 
                    | ul ol table hr | link image code"
                    style="padding-right: 100px;" v-model="contestUpd.description">
                  </v-md-editor>
                </el-col>
                <el-col :xs="24" :sm="24" :md="9" style="padding-left: 30px;">
                  <el-form>
                    <el-form-item style="width: 250px;" label="比赛标题">
                      <el-input v-model="contestUpd.title"  />
                    </el-form-item>
                    <el-form-item label="持续时间" >
                      <span>
                         <el-input style="width: 60px;" v-model="contestUpd.duration"/> 
                      mins
                      </span>
                       
                    </el-form-item>
                    <el-form-item label="是否公开">
                      <el-switch v-model="contestUpd.isPublic" size="large" active-text="公开"
                       inactive-text="私有"
                         />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="danger" @click="updateContest" >更新比赛</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
            </el-tab-pane>

            
            <el-tab-pane name="manageP" v-if="userStore.user.userRole >= 1 && contestInfo?.status == 0">
              <template #label>
                <el-icon style="margin: 4px;">
                  <SetUp />
                </el-icon>
                题目管理
              </template>
              <ContestProblemManage ref="manageP" />
            </el-tab-pane>

          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getContest } from '../../api/contest/index.ts';
import type { ContestVO,  ContestBaseUpdateRequest} from '../../api/contest/types.ts';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../store/user.ts';
import { registerContest, isReg, canReg,updateContestBaseInfo } from '../../api/contest/index.ts';
import { ElMessage } from 'element-plus';
import ContestProblemManage from './ContestProblemManage.vue';
import { all } from 'axios';

const route = useRoute() 
const userStore = useUserStore()

// 声明 ref 变量
const cid = ref('');
const contestInfo = ref<ContestVO>();
const contestUpd = ref<ContestBaseUpdateRequest>({
  contestId: '',
  title: '',
  description: '',
  duration: 0,
  isPublic: 0,
  hostId: '',
});
const activeName = ref('main');
const percentage = ref(0);
// 当前用户是否可以加入比赛，是否可以查看比赛的题目、提交等
const joinAuth = ref(false);
const viewAuth = ref(false);
const isRegistered = ref(false);
const canRegistered = ref(false);
const tagType = ref({
  '未开始': '',
  '正在进行': 'success',
  '等待测评': 'success',
  '已结束': 'danger',
});
const needUpdate = ref([
  'problemList',
  'problem',
  'submission',
  'rank',
  'manageP']);
const avalangList = ref([]);
const status2Str = (status: number) => {
    if (status === 0) return '未开始'
    else if (status === 1) return '正在进行'
    return '已结束'
}
const frushPercentage = () => {
  if (!contestInfo.value || !contestInfo.value.duration || contestInfo.value.duration === 0) {
    percentage.value = 0;
    return;
  }
  const startTime = new Date(contestInfo.value.startTime).getTime();
  if (isNaN(startTime)) {
    percentage.value = 0;
    return;
  }
  const now = new Date().getTime();
  const diff = now - startTime;
  console.log(diff);
  const per = ((diff /10 / 60) / contestInfo.value.duration) * 100;
  percentage.value = Math.min(Math.max(Math.floor(per), 0), 100);
  if (percentage.value >= 100) {
    return
  }
}
let timer: ReturnType<typeof setInterval> | null = null;
const load_contest = async () => {
  const res = await getContest(cid.value);
  if (res.code == 200) {
    contestInfo.value = res.data;
     contestUpd.value = {
      contestId: res.data.id || '',
      title: res.data.title || '',
      description: res.data.description || '',
      startTime: res.data.startTime || '', // 处理空值
      duration: res.data.duration || 0,
      isPublic: res.data.isPublic || 0,
      hostId: res.data.hostId || '',
    };
    console.log("❗❗❗❗❗❗❗" + contestUpd.value.isPublic)
    // 每分钟刷新下一次进度条
    frushPercentage();
    if (contestInfo.value.status == 1) {
        timer = setInterval(() => {
        frushPercentage();
      }, 60000);
    }
    
  }
  
}
const load_auth = async () => {
  const registerDTO  = {
    contestId: cid.value,
    userId: userStore.user.userId
  }
  const res = await isReg(registerDTO);
  console.log("isRegistered = "+res.data);
  if (res.code == 200) {
    isRegistered.value = res.data;
  } else {
    isRegistered.value = res.data;
  }
  const res2 = await canReg(registerDTO);
  console.log("canRegistered = " + res2.data);
  if (res2.code == 200) {
    canRegistered.value = res2.data;
  } else {
    canRegistered.value = res2.data;
  }

}
/**
 * 用户报名比赛
 */
const regContest = async () => {
  const registerDTO  = {
    contestId: cid.value,
    userId: userStore.user.userId
  }
  const res = await registerContest(registerDTO);
  if (res.code == 200) {
    ElMessage.success('报名成功成功');
  } else {
    ElMessage.error('报名失败');
  }
  load_contest()
  load_auth()
}
/**
 * 管理员更新题目基本信息
 */
const updateContest = async () => {
    const res = await updateContestBaseInfo(contestUpd.value);
    if (res.code == 200) {
        ElMessage.success('更新成功');
    } else {
        ElMessage.error('更新失败');
    }
    load_contest();
    load_auth()
}
onMounted(() => {
  cid.value = route.params.id
  load_contest();
  load_auth()
});



</script>

<style scoped>
.box-card {
  margin: 10px;
  text-align: left;
}

.title {
  text-align: center;
  margin: 0;
  font-size: 25px;
}

.demo-tabs {
  margin: 10px;
}

#picon {
  vertical-align: -2px;
}

.el-form-item {
  height: 35px;
}
</style>
