<template>
  <view class="report-page" :class="{ 'elder-mode': elderMode }">
    <NavBar title="我的报告" />

    <view class="report-body">
      <!-- Tab -->
      <view class="tab-bar">
        <view
          class="tab-item"
          v-for="tab in tabs"
          :key="tab.key"
          :class="{ active: activeTab === tab.key }"
          @tap="activeTab = tab.key"
        >
          <text class="tab-text">{{ tab.label }}</text>
          <text class="tab-count">{{ countByStatus(tab.key) }}</text>
        </view>
      </view>

      <!-- 报告列表 -->
      <view class="report-list" v-if="filteredReports.length">
        <view
          class="report-item card"
          v-for="report in filteredReports"
          :key="report.id"
          @tap="openDetail(report)"
        >
          <view class="report-top">
            <view class="report-icon" :class="report.status">
              {{ iconByStatus(report.status) }}
            </view>
            <view class="report-meta">
              <text class="report-name">{{ report.examName }}</text>
              <text class="report-time" v-if="report.generatedAt"
                >生成于 {{ report.generatedAt }}</text
              >
              <text class="report-time" v-else>{{ report.pickupTime }}</text>
            </view>
            <view class="report-status" :class="report.status">
              {{ statusText[report.status] }}
            </view>
          </view>

          <!-- 摘要预览 -->
          <view class="report-summary" v-if="report.summary">
            <text class="summary-label">报告摘要</text>
            <text class="summary-text">{{ report.summary }}</text>
          </view>

          <!-- 异常提示 -->
          <view
            class="report-abnormal"
            v-if="report.status === 'abnormal'"
          >
            ⚠️ 报告提示异常，请尽快就诊
          </view>

          <view class="report-actions" v-if="report.status === 'completed'">
            <view class="ra-btn" @tap.stop="viewFull(report)">
              📄 查看完整报告
            </view>
            <view class="ra-btn primary" @tap.stop="aiExplain(report)">
              🤖 AI解读
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else>
        <text class="empty-icon">📄</text>
        <text class="empty-text">暂无{{ tabLabel }}报告</text>
      </view>
    </view>

    <!-- 报告详情弹窗 -->
    <view class="popup-mask" v-if="showDetail" @tap="closeDetail">
      <view class="detail-modal" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">{{ currentReport?.examName }}</text>
          <text class="popup-close" @tap="closeDetail">×</text>
        </view>

        <scroll-view class="detail-scroll" scroll-y>
          <view class="detail-status" :class="currentReport?.status">
            {{ statusText[currentReport?.status || 'pending'] }}
          </view>

          <view class="detail-section">
            <text class="ds-label">报告摘要</text>
            <text class="ds-text">{{ currentReport?.summary }}</text>
          </view>

          <view
            class="detail-section"
            v-if="currentReport?.normalFindings?.length"
          >
            <text class="ds-label normal">✅ 未见异常</text>
            <view
              class="finding-item"
              v-for="(f, i) in currentReport.normalFindings"
              :key="i"
              >· {{ f }}</view
            >
          </view>

          <view
            class="detail-section"
            v-if="currentReport?.conclusion"
          >
            <text class="ds-label">诊断意见</text>
            <text class="ds-text">{{ currentReport.conclusion }}</text>
          </view>

          <view class="detail-section pickup">
            <text class="ds-label">📍 取报告</text>
            <view class="pickup-row">
              <text class="pickup-label">地点</text>
              <text class="pickup-value">{{ currentReport?.pickupLocation }}</text>
            </view>
            <view class="pickup-row">
              <text class="pickup-label">时间</text>
              <text class="pickup-value">{{ currentReport?.pickupTime }}</text>
            </view>
          </view>

          <view
            class="detail-section ai-explain"
            v-if="currentReport?.aiInterpretation"
          >
            <text class="ds-label">🤖 AI解读</text>
            <text class="ds-text">{{ currentReport.aiInterpretation }}</text>
            <text class="ai-warning"
              >* AI解读为辅助理解，请以医生诊断为准</text
            >
          </view>
        </scroll-view>

        <view class="detail-footer">
          <button class="btn btn-outline btn-lg" @tap="viewFull(currentReport)">
            完整报告
          </button>
          <button class="btn btn-primary btn-lg btn-flex1" @tap="aiExplain(currentReport)">
            AI解读
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import { mockReports } from '@/api/mockData'
import { getReportStatusText, toast } from '@/utils'
import type { ExamReport } from '@/types'

const userStore = useUserStore()
const elderMode = computed(() => userStore.isElderMode)

const reports = ref(mockReports)
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '检查完成' },
  { key: 'reviewing', label: '审核中' },
  { key: 'completed', label: '已生成' }
]

const statusText = computed(() => ({
  pending: '检查完成',
  reviewing: '报告审核中',
  completed: '报告已生成',
  abnormal: '异常提示'
}))

const tabLabel = computed(
  () => tabs.find((t) => t.key === activeTab.value)?.label || ''
)

const filteredReports = computed(() => {
  if (activeTab.value === 'all') return reports.value
  return reports.value.filter((r) => r.status === activeTab.value)
})

function countByStatus(key: string) {
  if (key === 'all') return reports.value.length
  return reports.value.filter((r) => r.status === key).length
}

function iconByStatus(status: string) {
  const map: Record<string, string> = {
    pending: '⏳',
    reviewing: '🔍',
    completed: '✅',
    abnormal: '⚠️'
  }
  return map[status] || '📄'
}

const showDetail = ref(false)
const currentReport = ref<ExamReport | null>(null)

function openDetail(report: ExamReport) {
  currentReport.value = report
  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
}

function viewFull(report?: ExamReport) {
  const r = report || currentReport.value
  if (!r) return
  if (r.pacsUrl) {
    // TODO: 跳转PACS系统
    toast('跳转PACS查看完整影像报告', 'none')
  } else {
    toast('完整报告请到院打印', 'none')
  }
}

function aiExplain(report?: ExamReport) {
  const r = report || currentReport.value
  if (!r) return
  if (!r.aiInterpretation) {
    r.aiInterpretation =
      '根据报告摘要，本次检查未见明显急性病变。如有具体指标异常，建议携带报告至专科门诊咨询医生，制定后续计划。'
  }
  if (!showDetail.value) {
    currentReport.value = r
    showDetail.value = true
  }
  toast('已生成AI解读', 'success')
}

onLoad(() => {
  // 模拟报告生成推送
  uni.showToast({ title: '您的影像报告已生成', icon: 'none' })
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.report-page {
  min-height: 100vh;
  background: $bg-color;
}

.report-body {
  padding: calc(100rpx + 44rpx + 24rpx) 32rpx 60rpx;
}

.tab-bar {
  display: flex;
  background: #fff;
  border-radius: 20rpx;
  padding: 8rpx;
  margin-bottom: 24rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
  border-radius: 16rpx;
  transition: all 0.2s;

  &.active {
    background: #4a90e2;

    .tab-text { color: #fff; }
    .tab-count { background: rgba(255, 255, 255, 0.3); color: #fff; }
  }

  .tab-text {
    font-size: 26rpx;
    color: #606266;
    font-weight: 600;
  }

  .tab-count {
    font-size: 20rpx;
    color: #909399;
    background: #f0f2f5;
    border-radius: 20rpx;
    padding: 2rpx 12rpx;
    margin-top: 6rpx;
    min-width: 32rpx;
    text-align: center;
  }
}

.report-list {
  display: flex;
  flex-direction: column;
}

.report-item {
  .report-top {
    display: flex;
    align-items: center;
  }

  .report-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    margin-right: 20rpx;

    &.pending { background: #fff7e6; }
    &.reviewing { background: #e6f7ff; }
    &.completed { background: #f6ffed; }
    &.abnormal { background: #fff1f0; }
  }

  .report-meta {
    flex: 1;
    display: flex;
    flex-direction: column;

    .report-name {
      font-size: 30rpx;
      font-weight: 700;
      color: #303133;
    }

    .report-time {
      font-size: 22rpx;
      color: #909399;
      margin-top: 6rpx;
    }
  }

  .report-status {
    font-size: 22rpx;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;

    &.pending { background: #fff7e6; color: #faad14; }
    &.reviewing { background: #e6f7ff; color: #4a90e2; }
    &.completed { background: #f6ffed; color: #52c41a; }
    &.abnormal { background: #fff1f0; color: #ff4d4f; }
  }

  .report-summary {
    margin-top: 24rpx;
    padding: 20rpx;
    background: #f8fafc;
    border-radius: 16rpx;

    .summary-label {
      font-size: 22rpx;
      color: #4a90e2;
      display: block;
      margin-bottom: 8rpx;
    }

    .summary-text {
      font-size: 25rpx;
      color: #606266;
      line-height: 1.6;
    }
  }

  .report-abnormal {
    margin-top: 16rpx;
    font-size: 24rpx;
    color: #cf1322;
    background: #fff1f0;
    padding: 16rpx;
    border-radius: 12rpx;
    text-align: center;
  }

  .report-actions {
    display: flex;
    gap: 20rpx;
    margin-top: 24rpx;

    .ra-btn {
      flex: 1;
      text-align: center;
      font-size: 26rpx;
      color: #606266;
      background: #f5f7fa;
      border-radius: 16rpx;
      padding: 20rpx 0;

      &.primary {
        color: #4a90e2;
        background: #e6f7ff;
      }
    }
  }
}

.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.detail-modal {
  width: 100%;
  height: 80vh;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  display: flex;
  flex-direction: column;
  padding: 40rpx;
  box-sizing: border-box;

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .popup-title {
      font-size: 34rpx;
      font-weight: 700;
      color: #303133;
    }

    .popup-close {
      font-size: 48rpx;
      color: #c0c4cc;
      line-height: 1;
    }
  }

  .detail-scroll {
    flex: 1;
    overflow-y: auto;
  }

  .detail-status {
    display: inline-block;
    font-size: 24rpx;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    margin-bottom: 24rpx;

    &.pending { background: #fff7e6; color: #faad14; }
    &.reviewing { background: #e6f7ff; color: #4a90e2; }
    &.completed { background: #f6ffed; color: #52c41a; }
    &.abnormal { background: #fff1f0; color: #ff4d4f; }
  }

  .detail-section {
    margin-bottom: 28rpx;

    .ds-label {
      font-size: 26rpx;
      font-weight: 700;
      color: #303133;
      display: block;
      margin-bottom: 12rpx;

      &.normal { color: #52c41a; }
    }

    .ds-text {
      font-size: 26rpx;
      color: #606266;
      line-height: 1.7;
    }

    .finding-item {
      font-size: 25rpx;
      color: #606266;
      line-height: 1.8;
    }

    &.pickup {
      background: #f8fafc;
      padding: 24rpx;
      border-radius: 16rpx;
    }

    .pickup-row {
      display: flex;
      margin-bottom: 12rpx;

      .pickup-label {
        font-size: 24rpx;
        color: #909399;
        width: 100rpx;
      }

      .pickup-value {
        font-size: 26rpx;
        color: #303133;
        flex: 1;
      }
    }

    &.ai-explain {
      background: #f6ffed;
      padding: 24rpx;
      border-radius: 16rpx;

      .ai-warning {
        font-size: 22rpx;
        color: #52c41a;
        display: block;
        margin-top: 12rpx;
      }
    }
  }

  .detail-footer {
    display: flex;
    gap: 24rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid #f0f2f5;
  }

  .btn-flex1 { flex: 1; }
}
</style>
