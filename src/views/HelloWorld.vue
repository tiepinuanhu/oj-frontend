<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDailyRank } from '../api/rank'
import type { UserRank } from '../api/rank/type'

defineProps<{ msg: string }>()

const count = ref(0)
const rankList = ref<UserRank[]>([])

onMounted(async () => {
  try {
    const response = await getDailyRank()
    rankList.value = response.data
  } catch (error) {
    console.error('Failed to fetch daily rank:', error)
  }
})

const cellStyle = (columnIndex: number) => {
  return { textAlign: columnIndex === 1 ? 'left' : 'center' };
};
</script>

<template>
  <div class="hello-world">
    <div class="rank-board">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="card-header">
            每日AC排行榜
          </div>
        </template>
        <el-table :data="rankList" :header-cell-style="{ textAlign: 'center' }"
       :cell-style="cellStyle">
        <el-table-column prop="rank" label="排名" width="100px"></el-table-column>
        <el-table-column prop="userAccount" label="用户名" width="200px"></el-table-column>
          <el-table-column prop="acCount" label="AC数量" width="150px"></el-table-column>
        </el-table>
      </el-card>
    </div>

    <h1>{{ msg }}</h1>

    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <p>
      Check out
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
        >create-vue</a
      >, the official Vue + Vite starter
    </p>
    <p>
      Learn more about IDE Support for Vue in the
      <a
        href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
        target="_blank"
        >Vue Docs Scaling up Guide</a
      >.
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.hello-world {
  position: relative;
}

.rank-board {
  position: absolute;
  top: 20px;
  right: 20px;
}

.box-card {
  height: auto;
  margin: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
}
</style>
