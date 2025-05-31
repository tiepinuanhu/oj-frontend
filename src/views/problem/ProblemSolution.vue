<template>
  <div class="article-list">
    <div class="article-item" v-for="(item, index) in articleList" :key="index">
      <!-- 作者信息 -->
      <div class="author">
        <span class="avatar" :style="{ backgroundColor: item.avatarColor }"></span>
        <span class="name">{{ item.author }}</span>
        <span class="time">{{ item.createTime }}</span>
        <a href="#" class="view-link">查看文章</a>
      </div>
      <!-- 文章标题 -->
      <h3 class="title">{{ item.title }}</h3>
      <!-- 预览内容 -->
      <div class="preview" :class="{ expanded: item.isExpanded }">
        <p v-for="(para, pIndex) in item.previewContent" :key="pIndex">{{ para }}</p>
        <!-- 代码块（如果有） -->
        <div class="code" v-if="item.code" v-html="item.code"></div>
        <!-- 展开按钮 -->
        <button class="toggle-btn" @click="expand(item)" >
          {{ item.isExpanded ? '收起全文' : '展开全文' }}
        </button>
      </div>



      <!-- 元数据（点赞、评论） -->
      <div class="meta">
        <span class="like">{{ item.likeCount }} 赞</span>
        <span class="comment">{{ item.commentCount }} 条评论</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const expand = (item:any) => { 
    item.isExpanded = !item.isExpanded
};
const articleList = ref([
  {
    id: 1,
    author: '吴俊宇',
    avatarColor: '#4CAF50',
    createTime: '2018-12-09 17:06',
    title: '教大家一个超级鬼畜的方法',
    previewContent: ['不多说，先看代码'],
    code: '<pre><code>#pragma GCC optimize(1)</code></pre>', // 代码块（HTML格式）
    likeCount: 361,
    commentCount: 141,
    isExpanded: false,
    showToggle: true // 内容过长时显示按钮（实际需计算，此处模拟）
  },
  {
    id: 2,
    author: 'xiejiyuan',
    avatarColor: '#00BCD4',
    createTime: '2019-03-15 23:13',
    title: '题解',
    previewContent: [
      '本题需要注意:',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '1. 空格不能少（一个少了会影响全部）',
      '2. 每一行末尾都要记得换行（不然输出会连在一起）'
    ],
    likeCount: 103,
    commentCount: 68,
    isExpanded: true,
    showToggle: true
  }
]);
</script>
<style>
.article-item {
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.author {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}

.view-link {
  color: #409EFF;
  text-decoration: none;
}

.title {
  font-size: 18px;
  margin-bottom: 10px;
}

.preview {
  overflow: hidden;
  max-height: 120px; /* 初始折叠高度，可调整 */
  transition: max-height 0.3s ease;
}

.preview.expanded {
  max-height: none;
}

.code {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  overflow-x: auto;
}

.toggle-btn {
  background: none;
  border: none;
  color: #409EFF;
  cursor: pointer;
  display: block;
  margin: 10px auto 0;
}

.meta {
  margin-top: 10px;
  color: #999;
}

.like, .comment {
  margin-right: 15px;
}
</style>