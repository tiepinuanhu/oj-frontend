<script setup lang="ts">
import Header from '@/components/Header.vue';
import 'element-plus/es/components/message/style/css' // ElMessage
import { onMounted } from 'vue';
import { useUserStore } from './store/user';
import { ElMessage } from 'element-plus';
// onMounted(() => {


onMounted(() => {
  const userStore = useUserStore()
    // 在组件挂载时调用自动登录方法
    // userStore.autoLogin();
    // ElMessage.success(userStore.user.userName)
    // ElMessage.success(userStore.user.userAvatar)
})
</script>

<template>
  <el-container class="common-layout">
    <el-header>
      <Header/>
    </el-header>
    <el-main>
      <RouterView/>
    </el-main>
    <el-footer id="footer">
      <div style="font-weight: 600; color:#74767a">
        Super OJ powered by
        <a href="https://github.com/tiepinunahu/oj-backend" target="_blank" class="rainbow">Super OJ</a>
        Developed by
        <span style="color: black;">xinchao wang</span>
      </div>
      <div>
        <a href="https://beian.miit.gov.cn/" target="_blank" class="rainbow">黑ICP备2025006586号-1</a>
      </div>
    </el-footer>
  </el-container>
  
</template>

<style lang="css">
li,
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 auto;
  color: #2c3e50;
}
.rlink {
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  color: #558CDD;
}
.el-table .success {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.el-table .warning {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-header {
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 20;
}

.el-loading-mask {
  z-index: 10;
}

body {
  margin-top: 0;
  padding-right: 0 !important;
  overflow-y: overlay;
}

.card-header,
.el-dialog__header,
.el-form-item__label {
  font-weight: bolder;
  color: #3f3f3f;
}
.el-message {
  position: fixed !important;
  top: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}
.rlink {
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  color: #558CDD;
}

.rlink:hover {
  color: #2d71d7;
}

blockquote {
  margin: 0;
}

#hidden {
  margin: 5px;
}

.el-card__header {
  padding: 15px 18px;
}

.rainbow {
  margin: 10px;
  text-decoration: none;
  background-image: linear-gradient(92deg, rgb(38, 243, 93) 0%, rgb(254, 171, 58) 100%);
  color: rgb(38, 82, 243);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  animation: 10s linear 0s infinite normal none running hue;
}

@keyframes hue {
  from {
    -webkit-filter: hue-rotate(0deg);
  }

  to {
    -webkit-filter: hue-rotate(-360deg);
  }
}

#footer {
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
}

#footer>div {
  margin: 5px;
}

@media (max-width: 768px) {
  .hide-on-mobile {
    display: none !important;
  }
}

.el-message {
  margin-top: 50px;
}
</style>