<template>
    <div class="reg">
        <el-card class="box-card" shadow="hover">

            <!-- <el-steps finish-status="success" simple style="margin-bottom: 20px;">
                <el-step title="绑定邮箱" />
                <el-step title="个人信息" />
            </el-steps> -->
            <!-- <el-form >
        <el-form-item label="邮箱" prop="name" style="margin-left: 27px">
        <el-input type="text" placeholder="请先输入邮箱，再进行人机验证" />
        </el-form-item>
        <el-form-item label="人机验证" prop="pass">
        <el-button type="info" plain  @click="recaptcha">发送验证码</el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="pass" style="margin-left: 13px">
        <el-input  type="text" placeholder="通过上方人机验证后，自动发送验证码" />
        </el-form-item>
        <el-button type="primary"  style="width: 250px;">验证</el-button>
    </el-form> -->

            <el-form :model="regRequest" v-show="active">
                <el-form-item label="用户名" prop="name" style="margin-left: 15px">
                    <el-input v-model="regRequest.userAccount" type="text" placeholder="由字母或数字组成,长度在 3~15 之间" />
                </el-form-item>
                <el-form-item label="密码" prop="pass" style="margin-left: 28px">
                    <el-input v-model="regRequest.userPassword" type="password" placeholder="长度在 6~31 之间" />
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input v-model="regRequest.checkPassword" type="password" />
                </el-form-item>
                <el-button type="primary" @click="register" style="width: 250px;">注册</el-button>
            </el-form>
            <el-divider />
            <el-button type="info" plain @click="router.push('/user/login')"
                style="width: 100%; height: 40px;">已有用户？点此登录
            </el-button>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { userRegister } from '../../api/user/index'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

const active = ref(1)
const regRequest = reactive({
    userAccount: '',
    userPassword: '',
    checkPassword: ''
})
const register = async () => {
    const res = await userRegister(regRequest);
    if (res.code === 200) {
        ElMessage.success('注册成功！');
        router.push("/user/login")
    } else {
        ElMessage.error('注册失败！');
    }
}
</script>

<style scoped>
.reg {
    text-align: center;
    margin: 0 auto;
    max-width: 500px;
}

.card-header {
    font-weight: bold;
    font-size: 20px;
}
</style>