<template>
  <div class="login">
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          登录
        </div>
      </template>
      <el-form >
        <el-form-item label="用户名" prop="name" style="margin-left: 15px">
          <el-input  type="text" />
        </el-form-item>
        <el-form-item label="密码" prop="pass" style="margin-left: 28px">
          <el-input  type="password"  />
        </el-form-item>
        <el-button type="primary"style="width: 250px;">登录</el-button>
      </el-form>
      <el-divider />
      <el-button type="info" plain 
        style="width: 100%; height: 40px;">新用户？点此注册</el-button>
    </el-card>
  </div>
</template>

<script lang="ts" setup>




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