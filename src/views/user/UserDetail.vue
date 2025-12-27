<template>
  <div class="user-detail">
    <el-card class="box-card" shadow="hover" v-loading="loading">
      <template #header>
        <div class="card-header">
          用户详情
        </div>
      </template>
      <div v-if="userData">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="user-avatar">
              <el-avatar :size="100" :src="userData.userAvatar || defaultAvatar"></el-avatar>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="user-info">
              <h2>{{ userData.userName }}</h2>
              <p><strong>账号：</strong>{{ userData.userAccount }}</p>
              <p><strong>角色：</strong>{{ userData.userRole === 1 ? '管理员' : '普通用户' }}</p>
              <p><strong>注册时间：</strong>{{ formatDate(userData.createTime) }}</p>
            </div>
          </el-col>
        </el-row>
        <el-divider />
        <div class="user-profile">
          <h3>个人简介</h3>
          <p>{{ userData.userProfile || '暂无简介' }}</p>
        </div>
      </div>
      <div v-else>
        <p>用户不存在</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserById } from '../../api/user'
import type { UserVO } from '../../api/user/type'

defineProps<{ id: string }>()

const route = useRoute()
const userData = ref<UserVO | null>(null)
const loading = ref(false)
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleString()
}

onMounted(async () => {
  const userId = route.params.id as string
  loading.value = true
  try {
    const response = await getUserById(userId)
    userData.value = response.data
  } catch (error) {
    ElMessage.error('获取用户信息失败')
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.user-detail {
  max-width: 800px;
  margin: 20px auto;
}

.box-card {
  margin: 10px;
}

.card-header {
  font-weight: bold;
}

.user-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.user-info h2 {
  margin-bottom: 10px;
}

.user-info p {
  margin: 5px 0;
}

.user-profile {
  margin-top: 20px;
}

.user-profile h3 {
  margin-bottom: 10px;
}
</style>