<template>
    <el-menu mode="horizontal" :default-active="selectedKeys" router="true">
        <!-- <img src="@/assets/cf-icon.png" class="icon"> -->
        <el-menu-item index="/">
            <el-icon>
                <Lollipop />
            </el-icon>
            首页
        </el-menu-item>
        <el-menu-item index="/problems">
            <el-icon>
                <Files />
            </el-icon>
            题库
        </el-menu-item>
        <el-menu-item index="/contest">
            <el-icon>
                <Trophy />
            </el-icon>
            比赛
        </el-menu-item>
        <el-menu-item index="/submission">
            <el-icon>
                <DataAnalysis />
            </el-icon>
            提交记录
        </el-menu-item>
        <!-- 用户未登录时，才显示登录和注册菜单项 -->
        <el-menu-item index="/user/login" v-if="!userStore.token" >
            <el-icon>
                <User />
            </el-icon>
            登录
        </el-menu-item>
        <el-menu-item index="/user/register" v-if="!userStore.token">
            <el-icon>
                <CircleCheck />
            </el-icon>
            注册
        </el-menu-item>
        <el-sub-menu index="/user" v-if="userStore.token">
      <template #title>
        <el-avatar :size="35" :src="userStore.user.userAvatar"/>
        <span style="padding-left: 8px;"> {{ userStore.user.userName }} </span>
      </template>
      <el-menu-item >
        <el-icon>
          <UserFilled />
        </el-icon>
        个人主页
      </el-menu-item>
      <el-menu-item index="/user/edit">
        <el-icon>
          <Edit />
        </el-icon>
        编辑资料
      </el-menu-item>
     
      
      <span @click="logout">
        <el-menu-item>
          <el-icon>
            <Close />
          </el-icon>
          退出登录
        </el-menu-item>
      </span>
    </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from 'vue-router'
import { useUserStore } from '../store/user'
import { ref, onMounted } from 'vue'

const userStore = useUserStore()

onMounted(() => {
    const route = useRoute()
    userStore.currentPath = route.path
    console.log(route.path)
})

const logout = () => {
    userStore.logout()
}
// 默认主页
const selectedKeys = ref(["/"]);
const router = useRouter();
// 更新路由后, 更新菜单项中之前选中的item
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});
</script>

<style lang="css" scoped>
.icon {
  border-radius: 1px;
  margin-left: 0;
  width: 180px;
  height: 60px;
}
.pd .el-dialog__body {
  padding: 0;
}

.el-divider--horizontal {
  margin: 10px 0;
}

.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  min-width: 100px !important;
  font-size: 10px;
}

.el-menu {
  justify-content: center;
}
</style>