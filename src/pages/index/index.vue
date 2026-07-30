<template>
  <view class="home-page" :class="{ 'elder-mode': elderMode }">
    <!-- 顶部 -->
    <view class="home-header">
      <view class="header-top">
        <view class="user-info" @tap="goSettings">
          <UserAvatar :src="userInfo.avatar" :name="userInfo.nickname" :size="88" />
          <view class="user-text">
            <text class="greeting">您好，{{ userInfo.nickname }}</text>
            <text class="sub-text">{{ currentMemberName }}的检查</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="action-icon" @tap="showDrawer = true">☰</view>
          <view class="action-icon" @tap="goRadiation">☢️</view>
          <view class="action-icon" @tap="toggleElder">👴</view>
        </view>
      </view>
    </view>

    <view class="home-body">
      <!-- 当前检查卡片 -->
      <view v-if="currentExam">
        <ExamStatusCard :exam="currentExam" @tap="goDetail" />

        <!-- 实时排队信息 -->
        <view class="queue-card card">
          <view class="card-header">
            <text class="title">📊 实时排队</text>
            <text class="more" @tap="goQueue">详情 ›</text>
          </view>

          <view class="queue-main">
            <view class="queue-num-block">
              <text class="queue-label">您的号码</text>
              <text class="queue-num">{{ currentExam.queueNumber }}</text>
              <text class="queue-room">{{ currentExam.roomNo }}</text>
            </view>

            <view class="queue-info">
              <view class="info-line">
                <text class="info-label">前方还有</text>
                <text class="info-value danger">{{ currentExam.queueAhead }}</text>
                <text class="info-unit">人</text>
              </view>
              <view class="info-line">
                <text class="info-label">预计等待</text>
                <text class="info-value primary">{{ currentExam.estimatedWait }}</text>
                <text class="info-unit">分钟</text>
              </view>
            </view>
          </view>

          <!-- 可视化进度条 -->
          <view class="progress-section">
            <ProgressSteps :steps="progressSteps" />
          </view>

          <view class="queue-tip" v-if="currentExam.queueAhead <= 3">
            ⚡ 即将到号，请前往{{ currentExam.location }}候诊
          </view>
        </view>
      </view>

      <!-- 无检查 -->
      <view v-else class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">当前无进行中的检查</text>
        <button class="btn btn-primary mt-lg" @tap="goLogin">去绑定检查单</button>
      </view>

      <!-- 功能入口 -->
      <view class="feature-grid card">
        <view class="feature-item" @tap="goQueue">
          <view class="feature-icon" style="background: #4a90e21a">📊</view>
          <text class="feature-text">排队等待</text>
        </view>
        <view class="feature-item" @tap="goDetail">
          <view class="feature-icon" style="background: #722ed11a">📋</view>
          <text class="feature-text">检查详情</text>
        </view>
        <view class="feature-item" @tap="goChat">
          <view class="feature-icon" style="background: #52c41a1a">🤖</view>
          <text class="feature-text">AI问答</text>
        </view>
        <view class="feature-item" @tap="goReport">
          <view class="feature-icon" style="background: #fa8c161a">📄</view>
          <text class="feature-text">我的报告</text>
        </view>
        <view class="feature-item" @tap="goRadiation">
          <view class="feature-icon" style="background: #13c2c21a">☢️</view>
          <text class="feature-text">辐射安全</text>
        </view>
        <view class="feature-item" @tap="goSettings">
          <view class="feature-icon" style="background: #9093991a">⚙️</view>
          <text class="feature-text">设置</text>
        </view>
      </view>

      <!-- 紧急通知 -->
      <view class="notice-card" v-if="notifications.length" @tap="showNotices">
        <text class="notice-icon">📢</text>
        <text class="notice-text">{{ notifications[0].content }}</text>
        <text class="notice-arrow">›</text>
      </view>

      <!-- AI快捷咨询 -->
      <view class="ai-banner card" @tap="goChat">
        <view class="ai-banner-left">
          <text class="ai-banner-title">🤖 AI智能助手</text>
          <text class="ai-banner-desc">检查流程 · 注意事项 · 辐射安全</text>
        </view>
        <button class="btn btn-primary btn-sm">问问AI</button>
      </view>
    </view>

    <!-- 临近检查弹窗 -->
    <view class="popup-mask" v-if="showNearModal" @tap="closeNearModal">
      <view class="modal" @tap.stop>
        <view class="modal-icon">🔔</view>
        <text class="modal-title">即将到号提醒</text>
        <text class="modal-content"
          >您前方仅剩
          <text class="hl">{{ currentExam?.queueAhead }}</text>
          人，请前往
          <text class="hl">{{ currentExam?.location }}</text>
          候诊。</text
        >
        <button class="btn btn-primary btn-block btn-lg" @tap="closeNearModal">
          我知道了
        </button>
      </view>
    </view>

    <!-- 通知列表弹窗 -->
    <view class="popup-mask" v-if="showNoticeModal" @tap="closeNoticeModal">
      <view class="notice-modal" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">排队通知</text>
          <text class="popup-close" @tap="closeNoticeModal">×</text>
        </view>
        <view class="notice-list">
          <view
            class="notice-item"
            v-for="n in notifications"
            :key="n.id"
          >
            <view class="notice-item-icon" :class="n.type">
              {{ noticeIcon[n.type] }}
            </view>
            <view class="notice-item-body">
              <text class="notice-item-title">{{ n.title }}</text>
              <text class="notice-item-content">{{ n.content }}</text>
              <text class="notice-item-time">{{ formatTime(n.timestamp) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <SideDrawer :visible="showDrawer" @close="showDrawer = false" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import ExamStatusCard from '@/components/ExamStatusCard.vue'
import ProgressSteps from '@/components/ProgressSteps.vue'
import SideDrawer from '@/components/SideDrawer.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { mockNotifications } from '@/api/mockData'
import { formatTime } from '@/utils'
import {
  goQueue,
  goDetail,
  goChat,
  goReport,
  goRadiation,
  goSettings,
  goLogin
} from '@/utils/nav'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const elderMode = computed(() => userStore.isElderMode)
const currentExam = computed(() => userStore.currentExam)
const familyMembers = computed(() => userStore.familyMembers)
const currentMemberId = computed(() => userStore.currentMemberId)

const currentMemberName = computed(
  () => familyMembers.value.find((m) => m.id === currentMemberId.value)?.name || ''
)

const notifications = ref(mockNotifications)

// 进度条步骤
const progressSteps = computed(() => {
  const ahead = currentExam.value?.queueAhead ?? 0
  return [
    { label: '已完成', status: 'done' as const },
    { label: '当前等待', status: 'current' as const },
    { label: '即将检查', status: ahead <= 3 ? 'current' : ('pending' as const) }
  ]
})

const showNearModal = ref(false)
const showNoticeModal = ref(false)

const noticeIcon: Record<string, string> = {
  near: '⏰',
  emergency: '🚨',
  done: '✅',
  normal: '📌'
}

onShow(() => {
  // 临近检查弹窗逻辑
  if (currentExam.value && currentExam.value.queueAhead <= 3 && currentExam.value.queueAhead > 0) {
    const shown = uni.getStorageSync('nearShown_' + currentExam.value.id)
    if (!shown) {
      showNearModal.value = true
      uni.setStorageSync('nearShown_' + currentExam.value.id, true)
      // 模拟微信服务通知
      uni.showToast({ title: '已发送服务通知', icon: 'none' })
    }
  }
})

function toggleElder() {
  userStore.toggleElderMode()
}

function showNotices() {
  showNoticeModal.value = true
}

function closeNoticeModal() {
  showNoticeModal.value = false
}

const showDrawer = ref(false)

function closeNearModal() {
  showNearModal.value = false
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.home-page {
  min-height: 100vh;
  background: $bg-color;
}

.home-header {
  background: linear-gradient(135deg, #4a90e2, #6ba3e8);
  padding: 100rpx 32rpx 80rpx;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
  background: #fff;
}

.user-text {
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;

  .greeting {
    font-size: 34rpx;
    font-weight: 700;
    color: #fff;
  }

  .sub-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.85);
    margin-top: 4rpx;
  }
}

.header-actions {
  display: flex;
  gap: 16rpx;
}

.action-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.home-body {
  padding: 0 32rpx 60rpx;
  margin-top: -48rpx;
}

.queue-card {
  .queue-main {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
  }

  .queue-num-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 32rpx;
    border-right: 2rpx solid #f0f2f5;

    .queue-label {
      font-size: 22rpx;
      color: #909399;
    }

    .queue-num {
      font-size: 64rpx;
      font-weight: 800;
      color: #4a90e2;
      line-height: 1.1;
    }

    .queue-room {
      font-size: 22rpx;
      color: #909399;
    }
  }

  .queue-info {
    flex: 1;
    padding-left: 32rpx;

    .info-line {
      display: flex;
      align-items: baseline;
      margin-bottom: 16rpx;

      .info-label {
        font-size: 26rpx;
        color: #909399;
        margin-right: 12rpx;
      }

      .info-value {
        font-size: 44rpx;
        font-weight: 700;

        &.danger { color: #ff4d4f; }
        &.primary { color: #4a90e2; }
      }

      .info-unit {
        font-size: 24rpx;
        color: #909399;
        margin-left: 4rpx;
      }
    }
  }

  .queue-tip {
    background: #fff7e6;
    color: #faad14;
    font-size: 24rpx;
    padding: 16rpx;
    border-radius: 12rpx;
    text-align: center;
  }
}

.feature-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 32rpx 16rpx;

  .feature-item {
    width: 33.33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
  }

  .feature-icon {
    width: 96rpx;
    height: 96rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    margin-bottom: 12rpx;
  }

  .feature-text {
    font-size: 24rpx;
    color: #303133;
  }
}

.notice-card {
  display: flex;
  align-items: center;
  background: #fff1f0;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;

  .notice-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
  }

  .notice-text {
    flex: 1;
    font-size: 24rpx;
    color: #cf1322;
    line-height: 1.5;
  }

  .notice-arrow {
    font-size: 36rpx;
    color: #cf1322;
  }
}

.ai-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #e6f7ff, #f0f9ff);

  .ai-banner-left {
    display: flex;
    flex-direction: column;
  }

  .ai-banner-title {
    font-size: 30rpx;
    font-weight: 700;
    color: #303133;
  }

  .ai-banner-desc {
    font-size: 24rpx;
    color: #4a90e2;
    margin-top: 6rpx;
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
  align-items: center;
  justify-content: center;
}

.modal {
  width: 560rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 56rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .modal-icon { font-size: 80rpx; }
  .modal-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #303133;
    margin: 24rpx 0 16rpx;
  }
  .modal-content {
    font-size: 28rpx;
    color: #606266;
    line-height: 1.7;
    text-align: center;
    margin-bottom: 40rpx;

    .hl { color: #4a90e2; font-weight: 700; }
  }
}

.notice-modal {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx;
  position: absolute;
  bottom: 0;

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32rpx;

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

  .notice-list {
    max-height: 700rpx;
    overflow-y: auto;
  }

  .notice-item {
    display: flex;
    padding: 24rpx;
    background: #f8fafc;
    border-radius: 16rpx;
    margin-bottom: 16rpx;
  }

  .notice-item-icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    margin-right: 20rpx;
    flex-shrink: 0;

    &.emergency { background: #fff1f0; }
    &.near { background: #fff7e6; }
    &.done { background: #f6ffed; }
    &.normal { background: #e6f7ff; }
  }

  .notice-item-body {
    flex: 1;
    display: flex;
    flex-direction: column;

    .notice-item-title {
      font-size: 28rpx;
      font-weight: 600;
      color: #303133;
    }

    .notice-item-content {
      font-size: 24rpx;
      color: #606266;
      line-height: 1.6;
      margin: 8rpx 0;
    }

    .notice-item-time {
      font-size: 22rpx;
      color: #c0c4cc;
    }
  }
}
</style>
