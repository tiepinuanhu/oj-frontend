<template>
  <div class="login">
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          登录
        </div>
      </template>
      <el-form >
        <el-form-item label="用户名" prop="userAccount"  style="margin-left: 15px">
          <el-input v-model="form.userAccount" type="text" />
        </el-form-item>
        <el-form-item label="密码" prop="userPassword"  style="margin-left: 28px">
          <el-input v-model="form.userPassword" type="password"  />
        </el-form-item>
        <el-button type="primary"style="width: 250px;" @click="login">登录</el-button>
      </el-form>
      <el-divider />
      <el-button type="info" plain 
        style="width: 100%; height: 40px;">新用户？点此注册</el-button>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { reactive} from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { userLogin } from '../../api/user';
import useStore from 'element-plus/es/components/table/src/store/index.mjs';

const form = reactive({
  userAccount: "",
  userPassword: "",
});

const router = useRouter();
const userStore = useUserStore();

/**
 * 登录方法
 * 登录成功后将后端返回的token保存到pinia和localStorage中
 */
async function login() {
  const res = await userLogin(form)
  // 登陆成功后：跳转到首页，存储token到LocalStorage
  if (res.code === 200) {
      ElMessage.success({
      type: 'success',
      message: JSON.stringify(res.data),
      duration: 1000,
    })
    userStore.user.userName = res.data.userName
    userStore.user.userAvatar = res.data.userAvatar
    userStore.user.userRole = res.data.userRole
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    ElMessage.warning("dasdas")
  }
}


</script>

<style scoped>

.login {
  text-align: center;
  margin: 0 auto;
  max-width: 500px;
}

.card-header {
  font-weight: bold;
  font-size: 20px;
}
</style>