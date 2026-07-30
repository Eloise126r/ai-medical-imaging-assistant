<template>
  <view class="progress-bar">
    <view
      class="progress-step"
      v-for="(step, idx) in steps"
      :key="idx"
    >
      <view
        class="progress-dot"
        :class="step.status"
      >
        <text v-if="step.status === 'done'" class="check">✓</text>
        <text v-else-if="step.status === 'current'" class="pulse"></text>
        <text v-else class="num">{{ idx + 1 }}</text>
      </view>
      <text class="progress-label" :class="step.status">{{ step.label }}</text>
      <view
        v-if="idx < steps.length - 1"
        class="progress-line"
        :class="{ active: step.status === 'done' }"
      ></view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface StepItem {
  label: string
  status: 'done' | 'current' | 'pending'
}

defineProps<{
  steps: StepItem[]
}>()
</script>

<style lang="scss" scoped>
.progress-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20rpx 0;
}

.progress-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.progress-dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8edf3;
  border: 4rpx solid #e8edf3;
  z-index: 2;

  &.done {
    background: #52c41a;
    border-color: #52c41a;
  }

  &.current {
    background: #fff;
    border-color: #4a90e2;

    .pulse {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      background: #4a90e2;
      animation: pulse 1.2s infinite;
    }
  }

  .check {
    color: #fff;
    font-size: 30rpx;
    font-weight: bold;
  }

  .num {
    color: #999;
    font-size: 26rpx;
  }
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.6; }
  100% { transform: scale(0.8); opacity: 1; }
}

.progress-label {
  font-size: 22rpx;
  color: #999;
  margin-top: 12rpx;

  &.done { color: #52c41a; }
  &.current { color: #4a90e2; font-weight: 600; }
}

.progress-line {
  position: absolute;
  top: 28rpx;
  left: 50%;
  width: 100%;
  height: 4rpx;
  background: #e8edf3;
  z-index: 1;

  &.active {
    background: #52c41a;
  }
}
</style>
