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
                <el-button v-show="canRegistered && isRegistered" type="info" disabled>已报名</el-button>
              </p>
            </div>
          </template>
          <el-descriptions :column="6" size="large">
            <el-descriptions-item label="开始时间">{{ contestInfo?.startTime }}</el-descriptions-item>
            <el-descriptions-item label="结束时间">{{ contestInfo?.endTime }}</el-descriptions-item>
            <el-descriptions-item label="比赛时长">{{ Math.floor(contestInfo?.duration / 60) }} min</el-descriptions-item>
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
            <el-tab-pane name="problemList" >
              <template #label>
                <el-icon style="margin: 4px;">
                  <Document />
                </el-icon>
                题目列表
              </template>
              <contestProblemList ref="problemList" />
            </el-tab-pane>
            <!-- <el-tab-pane name="submission" v-if="joinAuth || viewAuth">
              <template #label>
                <el-icon style="margin: 4px;">
                  <DataAnalysis />
                </el-icon>
                提交记录
              </template>
              <contestSubmission ref="submission" />
            </el-tab-pane>
            <el-tab-pane name="rank" v-if="viewAuth">
              <template #label>
                <el-icon style="margin: 4px;">
                  <DataLine />
                </el-icon>
                排行榜
              </template>
              <contestRank ref="rank" />
            </el-tab-pane>
            <el-tab-pane name="manageC" v-if="this.gid >= 2">
              <template #label>
                <el-icon style="margin: 4px;">
                  <SetUp />
                </el-icon>
                比赛管理
              </template>
              <el-row>
                <el-col :xs="24" :sm="24" :md="15" style="margin-bottom: 20px;">
                  <v-md-editor height="580px"
                    left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code"
                    style="padding-right: 100px;" v-model="tmpInfo.description"></v-md-editor>
                </el-col>
                <el-col :xs="24" :sm="24" :md="9" style="padding-left: 30px;">
                  <el-form>
                    <el-form-item label="比赛标题">
                      <el-input v-model="tmpInfo.title" :disabled="tmpInfo.done" />
                    </el-form-item>
                    <el-form-item label="开始时间">
                      <div class="block">
                        <el-date-picker v-model="tmpInfo.start" type="datetime" :disabled="tmpInfo.done" />
                      </div>
                    </el-form-item>
                    <el-form-item label="结束时间">
                      <div class="block">
                        <el-date-picker v-model="tmpInfo.end" type="datetime" :disabled="tmpInfo.done" />
                      </div>
                    </el-form-item>
                    <el-form-item label="比赛类型">
                      <el-select v-model="tmpInfo.type" class="m-2" :disabled="tmpInfo.done">
                        <el-option label="OI" value="OI" />
                        <el-option label="IOI" value="IOI" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="是否公开">
                      <el-switch v-model="tmpInfo.isPublic" size="large" active-text="公开" inactive-text="私有"
                        :disabled="tmpInfo.done" />
                    </el-form-item>
                    <el-form-item label="支持语言">
                      <el-select v-model="avalangList" multiple collapse-tags :max-collapse-tags="3" placeholder="支持语言"
                        :disabled="tmpInfo.done">
                        <el-option v-for="l in this.$store.state.langList" :key="l.id" :label="l.des" :value="l.id" />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="danger" @click="updateContest" :disabled="tmpInfo.done">更新比赛</el-button>
                      <el-button type="primary" :disabled="tmpInfo.done"
                        @click="this.tmpInfo = JSON.parse(JSON.stringify(this.contestInfo));">重新设置</el-button>
                      <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认重测该场比赛所有提交?"
                        @confirm="reJudgeContest">
                        <template #reference>
                          <el-button type="warning" :disabled="tmpInfo.done">
                            重测比赛
                          </el-button>
                        </template>
                      </el-popconfirm>
                      <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认结束比赛?(结束后无法再修改比赛)"
                        @confirm="closeContest">
                        <template #reference>
                          <el-button type="danger" :disabled="tmpInfo.done">
                            结束比赛
                          </el-button>
                        </template>
                      </el-popconfirm>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
            </el-tab-pane> -->
            <!-- <el-tab-pane name="manageP" v-if="this.gid >= 2">
              <template #label>
                <el-icon style="margin: 4px;">
                  <SetUp />
                </el-icon>
                题目管理
              </template>
              <problemManage ref="manageP" />
            </el-tab-pane> -->
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getContest } from '../../api/contest/index.ts';
import { ContestVO } from '../../api/contest/types.ts';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../store/user.ts';
import { registerContest, isReg, canReg } from '../../api/contest/index.ts';
import { ElMessage } from 'element-plus';
// 声明 ref 变量
const cid = ref(0);
const contestInfo = ref<ContestVO>();
const tmpInfo = ref({});
const activeName = ref('');
const percentage = ref(0);
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
  const per = (diff / 10 / 60 / contestInfo.value.duration) * 100;
  percentage.value = Math.min(Math.max(Math.floor(per), 0), 100);
}
const switchTab = (tab : any) => {
    // let url = location.pathname;
    // if (tab !== 'main')
    //   url += ('?tab=' + tab);
    // history.state.current = url;
    // history.replaceState(history.state, null, url);
    // if (needUpdate.value.includes(tab)) {
    //   nextTick(() => { this.$refs[tab].all(); });
    // }
}
let timer: ReturnType<typeof setInterval> | null = null;
const load_contest = async () => {
  const res = await getContest(cid.value);
  if (res.code == 200) {
    contestInfo.value = res.data;
    // 每分钟刷新下一次进度条
    frushPercentage();
    timer = setInterval(() => {
      frushPercentage();
    }, 1000);
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
const userStore = useUserStore()
const regContest = async () => {
  const registerDTO  = {
    contestId: cid.value,
    userId: userStore.user.userId
  }
  const res = await registerContest(registerDTO);
  if (res.code == 200) {
    ElMessage.success('报名成功成功');
  } else {

  }
}
const route = useRoute() 
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
