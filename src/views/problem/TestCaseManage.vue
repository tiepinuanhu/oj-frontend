<template>
  <div class="test-case-manage">
    <el-alert
      title="标程仅支持 C++，保存后写入数据库。修改标程会按已有 .in 重生成 .out；上传新 .in/zip 会覆盖输入并用当前标程重生成 .out。"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 16px;"
    />

    <el-card shadow="hover" class="block-card">
      <template #header>
        <div class="card-title">1. 上传标程（C++）</div>
      </template>
      <div class="row">
        <el-tag type="info">语言：C++</el-tag>
        <el-button
          type="primary"
          :loading="uploadingStandard"
          style="margin-left: 12px;"
          @click="onUploadStandard"
        >
          保存标程
        </el-button>
      </div>
      <el-divider />
      <monacoEditor
        v-if="active"
        language="cpp"
        :value="standardCode"
        :height="420"
        @update:value="standardCode = $event"
      />
    </el-card>

    <el-card shadow="hover" class="block-card">
      <template #header>
        <div class="card-title">2. 上传输入样例（.in / .zip）</div>
      </template>
      <el-upload
        ref="uploadRef"
        drag
        multiple
        accept=".in,.zip"
        :auto-upload="false"
        :on-change="onFileChange"
        :on-remove="onFileRemove"
        :on-exceed="onExceed"
        :limit="50"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击选择</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持多个 <code>.in</code>，或一个/多个 <code>.zip</code>（内含 .in）。建议命名为 1.in、2.in…
          </div>
        </template>
      </el-upload>

      <div class="actions">
        <el-button
          type="success"
          :loading="generating"
          :disabled="!pendingFiles.length"
          @click="onGenerate"
        >
          生成并覆盖样例
        </el-button>
        <span v-if="pendingFiles.length" class="hint">
          已选 {{ pendingFiles.length }} 个文件
        </span>
      </div>
    </el-card>

    <el-card v-if="resultRows.length" shadow="hover" class="block-card">
      <template #header>
        <div class="card-title">
          生成结果
          <el-tag :type="lastPersisted ? 'success' : 'danger'" style="margin-left: 8px;">
            {{ lastPersisted ? '已写入磁盘' : '未写入（存在失败）' }}
          </el-tag>
        </div>
      </template>
      <el-table :data="resultRows" border stripe>
        <el-table-column prop="index" label="Case" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.ok ? 'success' : 'danger'">
              {{ row.ok ? 'OK' : 'FAIL' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="沙箱状态" width="180" />
        <el-table-column prop="timeCost" label="耗时(ms)" width="100" />
        <el-table-column prop="error" label="错误信息" min-width="200" show-overflow-tooltip />
        <el-table-column label="输出预览" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.output ?? '' }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UploadFile, UploadFiles, UploadInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import monacoEditor from '../../components/monacoEditor.vue'
import { uploadStandard, generateCasesByFiles, getStandard } from '../../api/problem'
import type { GenerateCaseItemVO } from '../../api/problem/types'

const props = defineProps<{
  problemId: string | number
  /** 当前 tab 激活时再挂载编辑器，避免隐藏时尺寸为 0 */
  active?: boolean
}>()

const standardCode = ref('')
const uploadingStandard = ref(false)
const generating = ref(false)
const loadingStandard = ref(false)
const uploadRef = ref<UploadInstance>()
const pendingFiles = ref<File[]>([])
const resultRows = ref<GenerateCaseItemVO[]>([])
const lastPersisted = ref(false)

function syncPendingFromList(fileList: UploadFiles) {
  pendingFiles.value = fileList
    .map((f) => f.raw)
    .filter((f): f is File => !!f)
}

function onFileChange(_file: UploadFile, fileList: UploadFiles) {
  const invalid = fileList.filter((f) => {
    const name = (f.name || '').toLowerCase()
    return !name.endsWith('.in') && !name.endsWith('.zip')
  })
  if (invalid.length) {
    ElMessage.warning('仅支持 .in 或 .zip 文件')
    invalid.forEach((f) => {
      const idx = fileList.findIndex((x) => x.uid === f.uid)
      if (idx >= 0) fileList.splice(idx, 1)
    })
  }
  syncPendingFromList(fileList)
}

function onFileRemove(_file: UploadFile, fileList: UploadFiles) {
  syncPendingFromList(fileList)
}

function onExceed() {
  ElMessage.warning('最多选择 50 个文件')
}

function apiMessage(err: unknown, fallback: string) {
  const anyErr = err as { response?: { data?: { message?: string } }; message?: string }
  return anyErr?.response?.data?.message || anyErr?.message || fallback
}

async function loadStandardCode() {
  if (!props.problemId) return
  loadingStandard.value = true
  try {
    const res: any = await getStandard(props.problemId)
    if (res.code === 200) {
      standardCode.value = res.data?.sourceCode ?? ''
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingStandard.value = false
  }
}

async function onUploadStandard() {
  if (!props.problemId) {
    ElMessage.error('题目 ID 无效')
    return
  }
  if (!standardCode.value?.trim()) {
    ElMessage.error('请填写 C++ 标程代码')
    return
  }
  uploadingStandard.value = true
  try {
    const res: any = await uploadStandard({
      problemId: Number(props.problemId),
      sourceCode: standardCode.value,
    })
    if (res.code === 200) {
      const data = res.data
      if (data?.outsRegenerated) {
        ElMessage.success(`标程已保存，并已按已有输入重生成 ${data.regenerateResult?.successCount ?? ''} 组 .out`)
        resultRows.value = data.regenerateResult?.cases ?? []
        lastPersisted.value = true
      } else if (data?.regenerateResult && data.regenerateResult.persisted === false) {
        ElMessage.warning('标程已保存，但重生成 .out 失败，旧输出未覆盖')
        resultRows.value = data.regenerateResult?.cases ?? []
        lastPersisted.value = false
      } else {
        ElMessage.success('标程已保存到数据库（尚无 .in，未生成 .out）')
      }
    } else {
      ElMessage.error(res.message || '保存标程失败')
    }
  } catch (e) {
    ElMessage.error(apiMessage(e, '保存标程失败'))
  } finally {
    uploadingStandard.value = false
  }
}

async function onGenerate() {
  if (!props.problemId) {
    ElMessage.error('题目 ID 无效')
    return
  }
  if (!pendingFiles.value.length) {
    ElMessage.warning('请先选择 .in 或 .zip 文件')
    return
  }
  try {
    await ElMessageBox.confirm(
      '将用本次上传的输入覆盖本题已有样例（.in / .out / config.json），并按标程重新生成输出。是否继续？',
      '覆盖确认',
      { type: 'warning', confirmButtonText: '覆盖并生成', cancelButtonText: '取消' }
    )
  } catch {
    return
  }

  generating.value = true
  try {
    const res: any = await generateCasesByFiles(props.problemId, pendingFiles.value)
    if (res.code !== 200) {
      ElMessage.error(res.message || '生成失败')
      return
    }
    const data = res.data
    resultRows.value = data?.cases ?? []
    lastPersisted.value = !!data?.persisted
    if (data?.persisted) {
      ElMessage.success(`样例已覆盖写入（${data.successCount} 组）`)
      uploadRef.value?.clearFiles()
      pendingFiles.value = []
    } else {
      ElMessage.warning(`有 ${data?.failCount ?? 0} 个 case 失败，未写入磁盘`)
    }
  } catch (e) {
    ElMessage.error(apiMessage(e, '生成样例失败'))
  } finally {
    generating.value = false
  }
}

watch(
  () => props.problemId,
  () => {
    resultRows.value = []
    lastPersisted.value = false
    loadStandardCode()
  },
  { immediate: true }
)

watch(
  () => props.active,
  (active) => {
    if (active) {
      loadStandardCode()
    }
  }
)
</script>

<style scoped>
.test-case-manage {
  max-width: 1100px;
  margin: 0 auto;
  padding: 8px 0 24px;
  text-align: left;
}

.block-card {
  margin-bottom: 16px;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
}

.row {
  display: flex;
  align-items: center;
}

.actions {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.hint {
  color: #909399;
  font-size: 13px;
}
</style>
