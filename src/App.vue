<script setup lang="ts">
import Header from './components/Header.vue';


</script>

<template>
  <el-container class="common-layout">
    <el-header>
      <Header />
    </el-header>
    <el-main>
      <router-view :key="$route.fullPath"/>
    </el-main>
    <el-footer id="footer">
      <div style="font-weight: 600; color:#74767a">
        nywOJ powered by
        <a href="https://github.com/Baymin-ty/nywOJ" target="_blank" class="rainbow">nywOJ</a>
        Developed by
        <span style="color: black;">ty</span>
      </div>
      <div>
        <a href="https://beian.miit.gov.cn/" target="_blank" class="rainbow">黑ICP备2022006586号-1</a>
      </div>
    </el-footer>
  </el-container>
  
</template>

