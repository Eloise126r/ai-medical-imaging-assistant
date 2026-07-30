<template>
  <view class="exam-card" @tap="$emit('tap')">
    <view class="exam-top">
      <view class="exam-icon" :style="{ background: iconBg }">
        <text class="exam-emoji">{{ examEmoji }}</text>
      </view>
      <view class="exam-meta">
        <text class="exam-name">{{ exam.examName }}</text>
        <text class="exam-part">{{ exam.bodyPart }} · {{ exam.location }}</text>
      </view>
      <view class="exam-status" :class="exam.status">
        {{ statusText }}
      </view>
    </view>

    <view class="exam-divider"></view>

    <view class="exam-info-row">
      <view class="info-item">
        <text class="info-label">检查时间</text>
        <text class="info-value">{{ exam.scheduledTime }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">预计耗时</text>
        <text class="info-value">{{ exam.estimatedDuration }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">检查室</text>
        <text class="info-value">{{ exam.roomNo }}</text>
      </view>
    </view>

    <view class="exam-tags" v-if="exam.contrastAgent">
      <text class="contrast-tag">增强检查</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ExamOrder } from '@/types'
import { getExamStatusText } from '@/utils'

const props = defineProps<{
  exam: ExamOrder
}>()

const emit = defineEmits(['tap'])

const statusText = computed(() => getExamStatusText(props.exam.status))

const iconBg = computed(() => {
  const map: Record<string, string> = {
    CT: 'linear-gradient(135deg,#4A90E2,#6BA3E8)',
    MRI: 'linear-gradient(135deg,#722ED1,#9254DE)',
    XRAY: 'linear-gradient(135deg,#52C41A,#73D13D)',
    ULTRASOUND: 'linear-gradient(135deg,#13C2C2,#36CFC9)',
    PET: 'linear-gradient(135deg,#FA8C16,#FFA940)'
  }
  return map[props.exam.examType] || map.CT
})

const examEmoji = computed(() => {
  const map: Record<string, string> = {
    CT: '🖥️',
    MRI: '🧲',
    XRAY: '🩻',
    ULTRASOUND: '🌊',
    PET: '⚛️'
  }
  return map[props.exam.examType] || '🏥'
})
</script>

<style lang="scss" scoped>
.exam-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.exam-top {
  display: flex;
  align-items: center;
}

.exam-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;

  .exam-emoji { font-size: 52rpx; }
}

.exam-meta {
  flex: 1;
  display: flex;
  flex-direction: column;

  .exam-name {
    font-size: 34rpx;
    font-weight: 700;
    color: #303133;
  }

  .exam-part {
    font-size: 24rpx;
    color: #909399;
    margin-top: 8rpx;
  }
}

.exam-status {
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  font-weight: 600;

  &.waiting { background: #fff7e6; color: #faad14; }
  &.in_progress { background: #e6f7ff; color: #4a90e2; }
  &.completed { background: #f6ffed; color: #52c41a; }
  &.cancelled { background: #f5f5f5; color: #999; }
}

.exam-divider {
  height: 1rpx;
  background: #f0f2f5;
  margin: 28rpx 0;
}

.exam-info-row {
  display: flex;
  justify-content: space-between;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  .info-label {
    font-size: 22rpx;
    color: #c0c4cc;
    margin-bottom: 8rpx;
  }

  .info-value {
    font-size: 28rpx;
    font-weight: 600;
    color: #303133;
  }
}

.exam-tags {
  margin-top: 20rpx;
}

.contrast-tag {
  font-size: 22rpx;
  background: #fff1f0;
  color: #ff4d4f;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}
</style>
