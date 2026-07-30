<template>
  <view class="queue-page" :class="{ 'elder-mode': elderMode }">
    <NavBar title="排队详情" />

    <view class="queue-body" v-if="exam">
      <!-- 检查室状态 -->
      <view class="room-card card">
        <view class="room-header">
          <view class="room-icon">🏥</view>
          <view class="room-info">
            <text class="room-no">{{ exam.roomNo }}</text>
            <text class="room-loc">{{ exam.location }}</text>
          </view>
          <view class="room-status" :class="{ active: currentChecking > 0 }">
            {{ currentChecking > 0 ? '检查中' : '待机' }}
          </view>
        </view>

        <view class="room-current" v-if="currentChecking > 0">
          <text class="rc-label">正在检查</text>
          <text class="rc-num">{{ currentChecking }}号</text>
          <text class="rc-patient">患者</text>
        </view>
      </view>

      <!-- 我的排队 -->
      <view class="my-card card">
        <view class="my-top">
          <view class="my-num-wrap">
            <text class="my-label">我的号码</text>
            <text class="my-num">{{ exam.queueNumber }}</text>
          </view>
          <view class="my-stats">
            <view class="stat">
              <text class="stat-value danger">{{ exam.queueAhead }}</text>
              <text class="stat-label">前方人数</text>
            </view>
            <view class="stat">
              <text class="stat-value primary">{{ exam.estimatedWait }}</text>
              <text class="stat-label">预计分钟</text>
            </view>
          </view>
        </view>

        <!-- 进度可视化 -->
        <view class="my-progress">
          <view class="progress-track">
            <view
              class="progress-fill"
              :style="{ width: progressPercent + '%' }"
            ></view>
            <view
              class="progress-dot"
              :style="{ left: progressPercent + '%' }"
            >
              <text class="dot-num">{{ exam.queueNumber }}</text>
            </view>
          </view>
          <view class="progress-labels">
            <text>已签到</text>
            <text>候诊中</text>
            <text>检查室</text>
          </view>
        </view>
      </view>

      <!-- 同室排队（隐私保护） -->
      <view class="list-card card">
        <view class="card-header">
          <text class="title">同检查室排队</text>
          <text class="privacy-tip">🔒 仅显示序号</text>
        </view>

        <view class="queue-list">
          <view
            class="queue-row"
            v-for="(p, idx) in queueList"
            :key="idx"
            :class="{ mine: p.number === exam.queueNumber }"
          >
            <view class="row-left">
              <view class="row-dot" :class="p.status"></view>
              <text class="row-num">{{ p.number }}号</text>
            </view>
            <text class="row-status" :class="p.status">
              {{ statusText[p.status] }}
            </text>
          </view>
        </view>
      </view>

      <!-- 急诊插队通知 -->
      <view class="emergency-banner" v-if="emergencyMsg">
        <text class="em-icon">🚨</text>
        <view class="em-body">
          <text class="em-title">排队序号调整通知</text>
          <text class="em-content">{{ emergencyMsg }}</text>
        </view>
      </view>

      <!-- 操作 -->
      <button class="btn btn-ghost btn-block" @tap="refreshQueue">
        🔄 刷新排队状态
      </button>

      <view class="tip-text">
        温馨提示：本页面数据由医院排队叫号系统实时推送，请勿离开候诊区
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import { mockQueuePatients } from '@/api/mockData'
import { toast } from '@/utils/nav'

const userStore = useUserStore()
const elderMode = computed(() => userStore.isElderMode)

const examId = ref('')
const exam = computed(() =>
  userStore.examOrders.find((e) => e.id === examId.value)
)

const currentChecking = computed(() => {
  if (!exam.value) return 0
  return Math.max(exam.value.queueNumber - exam.value.queueAhead - 1, 0)
})

const queueList = ref(mockQueuePatients)

const progressPercent = computed(() => {
  if (!exam.value) return 0
  const ahead = exam.value.queueAhead
  const total = exam.value.queueTotal || 1
  // 已通过的比例
  return Math.min(((total - ahead) / total) * 100, 100)
})

const statusText: Record<string, string> = {
  checking: '检查中',
  waiting: '等待',
  done: '已完成'
}

const emergencyMsg = ref('')

onLoad((options) => {
  examId.value = options?.id || userStore.currentExam?.id || ''
  checkEmergency()
})

onShow(() => {
  checkEmergency()
})

function checkEmergency() {
  // 模拟急诊插队通知
  if (exam.value && exam.value.queueNumber > 24) {
    emergencyMsg.value =
      '因急诊患者优先检查，您的排队序号由24调整为27，预计等待时间增加15分钟，请耐心等待。'
  }
}

function refreshQueue() {
  toast('已刷新', 'none')
  // 模拟数据轻微变化
  if (exam.value && exam.value.queueAhead > 0) {
    exam.value.queueAhead -= 1
    exam.value.estimatedWait = Math.max(exam.value.estimatedWait - 4, 1)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.queue-page {
  min-height: 100vh;
  background: $bg-color;
}

.queue-body {
  padding: calc(100rpx + 44rpx + 32rpx) 32rpx 60rpx;
}

.room-card {
  .room-header {
    display: flex;
    align-items: center;

    .room-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 20rpx;
      background: #e6f7ff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 44rpx;
      margin-right: 20rpx;
    }

    .room-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .room-no {
        font-size: 32rpx;
        font-weight: 700;
        color: #303133;
      }

      .room-loc {
        font-size: 24rpx;
        color: #909399;
        margin-top: 4rpx;
      }
    }

    .room-status {
      font-size: 24rpx;
      padding: 8rpx 20rpx;
      border-radius: 24rpx;
      background: #f5f5f5;
      color: #999;

      &.active {
        background: #e6f7ff;
        color: #4a90e2;
      }
    }
  }

  .room-current {
    margin-top: 24rpx;
    padding: 20rpx;
    background: #f8fafc;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    gap: 12rpx;

    .rc-label { font-size: 26rpx; color: #606266; }
    .rc-num { font-size: 36rpx; font-weight: 700; color: #4a90e2; }
    .rc-patient { font-size: 24rpx; color: #909399; }
  }
}

.my-card {
  .my-top {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;
  }

  .my-num-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 40rpx;
    border-right: 2rpx solid #f0f2f5;

    .my-label { font-size: 22rpx; color: #909399; }
    .my-num {
      font-size: 72rpx;
      font-weight: 800;
      color: #4a90e2;
      line-height: 1.1;
    }
  }

  .my-stats {
    flex: 1;
    display: flex;
    justify-content: space-around;

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-value {
        font-size: 48rpx;
        font-weight: 700;

        &.danger { color: #ff4d4f; }
        &.primary { color: #4a90e2; }
      }

      .stat-label {
        font-size: 22rpx;
        color: #909399;
        margin-top: 4rpx;
      }
    }
  }

  .my-progress {
    .progress-track {
      position: relative;
      height: 16rpx;
      background: #f0f2f5;
      border-radius: 8rpx;
      margin: 30rpx 0 16rpx;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4a90e2, #6ba3e8);
      border-radius: 8rpx;
      transition: width 0.6s ease;
    }

    .progress-dot {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 36rpx;
      height: 36rpx;
      background: #4a90e2;
      border-radius: 50%;
      border: 4rpx solid #fff;
      box-shadow: 0 2rpx 8rpx rgba(74, 144, 226, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: left 0.6s ease;

      .dot-num {
        font-size: 18rpx;
        color: #fff;
        font-weight: 700;
      }
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: 22rpx;
      color: #c0c4cc;
    }
  }
}

.list-card {
  .privacy-tip {
    font-size: 22rpx;
    color: #52c41a;
  }

  .queue-list {
    display: flex;
    flex-direction: column;
  }

  .queue-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f2f5;

    &:last-child { border-bottom: none; }

    &.mine {
      background: #e6f7ff;
      border-radius: 16rpx;
      padding: 24rpx 20rpx;
      margin: 8rpx 0;
    }

    .row-left {
      display: flex;
      align-items: center;
    }

    .row-dot {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      margin-right: 20rpx;

      &.checking { background: #4a90e2; animation: blink 1s infinite; }
      &.waiting { background: #c0c4cc; }
      &.done { background: #52c41a; }
    }

    .row-num {
      font-size: 28rpx;
      color: #303133;
      font-weight: 600;
    }

    .row-status {
      font-size: 24rpx;

      &.checking { color: #4a90e2; }
      &.waiting { color: #909399; }
      &.done { color: #52c41a; }
    }
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.emergency-banner {
  display: flex;
  align-items: flex-start;
  background: #fff1f0;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;

  .em-icon { font-size: 36rpx; margin-right: 16rpx; }

  .em-body {
    flex: 1;
    display: flex;
    flex-direction: column;

    .em-title {
      font-size: 28rpx;
      font-weight: 700;
      color: #cf1322;
    }

    .em-content {
      font-size: 24rpx;
      color: #cf1322;
      line-height: 1.6;
      margin-top: 8rpx;
    }
  }
}

.tip-text {
  font-size: 22rpx;
  color: #c0c4cc;
  text-align: center;
  margin-top: 24rpx;
  line-height: 1.6;
}
</style>
