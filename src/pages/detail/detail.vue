<template>
  <view class="detail-page" :class="{ 'elder-mode': elderMode }">
    <NavBar title="检查详情" />

    <view class="detail-body" v-if="exam">
      <!-- 检查信息卡 -->
      <ExamStatusCard :exam="exam" />

      <!-- 流程可视化 -->
      <view class="card">
        <view class="card-header">
          <text class="title">📍 检查流程</text>
        </view>
        <TimelineSteps :steps="steps" />
      </view>

      <!-- 检查前准备 -->
      <view class="card">
        <view class="card-header">
          <text class="title">📝 检查前准备</text>
        </view>

        <view
          class="pre-item"
          v-for="item in preItems"
          :key="item.id"
        >
          <view class="pre-header">
            <view class="pre-icon">{{ iconEmoji[item.icon] }}</view>
            <view class="pre-title-wrap">
              <text class="pre-cat">{{ item.category }}</text>
              <text class="pre-title">{{ item.title }}</text>
            </view>
            <view
              class="pre-media"
              v-if="item.mediaType"
              @tap="playMedia(item)"
            >
              <text class="media-tag">{{ mediaText[item.mediaType] }}</text>
            </view>
          </view>
          <text class="pre-desc">{{ item.desc }}</text>
        </view>
      </view>

      <!-- 禁忌症提醒 -->
      <ContraindicationCard :items="contraindications" />

      <!-- 检查后注意事项 -->
      <view class="card" v-if="afterCare.length">
        <view class="card-header">
          <text class="title">💡 检查后注意事项</text>
        </view>
        <view
          class="care-item"
          v-for="(care, idx) in afterCare"
          :key="idx"
        >
          <text class="care-dot">●</text>
          <text class="care-text">{{ care }}</text>
        </view>
      </view>

      <!-- 底部操作 -->
      <view class="action-row safe-area-bottom">
        <button class="btn btn-outline btn-lg" @tap="goQueue">查看排队</button>
        <button class="btn btn-primary btn-lg btn-flex1" @tap="goRadiation">
          辐射安全说明
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import ExamStatusCard from '@/components/ExamStatusCard.vue'
import TimelineSteps from '@/components/TimelineSteps.vue'
import ContraindicationCard from '@/components/ContraindicationCard.vue'
import {
  mockExamSteps,
  mockPreExamItems,
  mockContraindications
} from '@/api/mockData'
import { goQueue, goRadiation, toast } from '@/utils/nav'

const userStore = useUserStore()
const elderMode = computed(() => userStore.isElderMode)

const examId = ref('')
const exam = computed(() =>
  userStore.examOrders.find((e) => e.id === examId.value)
)

const steps = ref(mockExamSteps)
const preItems = ref(mockPreExamItems)
const contraindications = ref(mockContraindications)

const afterCare = computed(() => {
  if (exam.value?.contrastAgent) {
    return [
      '检查后请多饮水（约2000ml），促进造影剂排出',
      '拔针后按压穿刺点5-10分钟，避免淤青',
      '留观30分钟，如出现皮疹、瘙痒、呼吸困难等过敏反应立即告知医务人员',
      '24小时内避免剧烈运动，清淡饮食'
    ]
  }
  return ['检查后无特殊禁忌，可正常活动', '如有不适请及时告知医生']
})

const iconEmoji: Record<string, string> = {
  food: '🍽️',
  bag: '👜',
  clothes: '👕'
}

const mediaText: Record<string, string> = {
  image: '📷 图片',
  animation: '🎬 动画',
  video: '🎥 视频'
}

onLoad((options) => {
  examId.value = options?.id || userStore.currentExam?.id || ''
})

function playMedia(item: any) {
  toast(`播放${mediaText[item.mediaType]}说明`)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.detail-page {
  min-height: 100vh;
  background: $bg-color;
}

.detail-body {
  padding: calc(100rpx + 44rpx + 40rpx) 32rpx 40rpx;
}

.pre-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f2f5;

  &:last-child {
    border-bottom: none;
  }
}

.pre-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.pre-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: #e6f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-right: 20rpx;
}

.pre-title-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;

  .pre-cat {
    font-size: 22rpx;
    color: #4a90e2;
  }

  .pre-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #303133;
    margin-top: 4rpx;
  }
}

.pre-media {
  .media-tag {
    font-size: 22rpx;
    color: #4a90e2;
    background: #e6f7ff;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
  }
}

.pre-desc {
  font-size: 25rpx;
  color: #606266;
  line-height: 1.7;
  padding-left: 84rpx;
}

.care-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;

  .care-dot {
    color: #4a90e2;
    font-size: 20rpx;
    margin-right: 12rpx;
    margin-top: 6rpx;
  }

  .care-text {
    flex: 1;
    font-size: 26rpx;
    color: #303133;
    line-height: 1.7;
  }
}

.action-row {
  display: flex;
  gap: 24rpx;
  padding: 32rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  margin: 0 -32rpx -40rpx;
}

.btn-flex1 {
  flex: 1;
}
</style>
