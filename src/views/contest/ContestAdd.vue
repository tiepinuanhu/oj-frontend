<template>
  <div>
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
        <el-form-item label="比赛标题">
            <el-input style="width: 250px;" placeholder="请输入比赛标题" v-model="contestUpd.title"  />
        </el-form-item>
        <el-form-item label="开始时间">
            <el-date-picker v-model="contestUpd.startTime"  
            format="YYYY-MM-DD HH:mm:ss"
            type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="持续时间" >
            <span>
            <el-input  style="width: 60px;" v-model="contestUpd.duration"/> 
                mins
            </span>
        </el-form-item>
        <el-form-item label="是否公开">
            <el-switch v-model="contestUpd.isPublic" size="large" active-text="公开"
            inactive-text="私有"
                />
        </el-form-item>
        <el-form-item>
            <el-button type="danger" @click="addContestFuc" >添加比赛</el-button>
        </el-form-item>
        </el-form>
    </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts"> 
import { ref, reactive, watch, toRaw, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type {ContestAddRequest} from '../../api/contest/types';
import { addContest} from '../../api/contest/index';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../../store/user';
import { format } from 'date-fns';

// 使用 format 函数直接格式化


const router = useRouter();
const userStore = useUserStore();
const contestUpd = ref<ContestAddRequest>({
  title: '',
  description: '',
  startTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  duration: 120,
  isPublic: 0,
  hostId: userStore.user.userId,
});
const addContestFuc = async () => {
    const res = await addContest(contestUpd.value);
    if (res.code === 200) {
        ElMessage.success('添加比赛成功');
        router.push('/contest');
    } else {
        ElMessage.error('添加比赛失败');
    }
}
onMounted(() => {

})
</script>


<style lang="css" scope>

</style>
