<template>
  <view class="timeline">
    <view
      class="timeline-item"
      v-for="(item, idx) in steps"
      :key="item.id"
    >
      <view class="timeline-left">
        <view class="timeline-node" :class="item.status">
          <text v-if="item.status === 'done'" class="check">✓</text>
          <text v-else-if="item.status === 'current'" class="dot"></text>
          <text v-else class="num">{{ idx + 1 }}</text>
        </view>
        <view
          v-if="idx < steps.length - 1"
          class="timeline-line"
          :class="{ active: item.status === 'done' }"
        ></view>
      </view>
      <view class="timeline-content" :class="{ current: item.status === 'current' }">
        <view class="timeline-title">
          {{ item.title }}
          <text v-if="item.status === 'current'" class="badge">进行中</text>
          <text v-else-if="item.status === 'done'" class="badge done">已完成</text>
        </view>
        <view class="timeline-desc">{{ item.desc }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ExamStep } from '@/types'

defineProps<{
  steps: ExamStep[]
}>()
</script>

<style lang="scss" scoped>
.timeline {
  padding: 8rpx 0;
}

.timeline-item {
  display: flex;
  position: relative;
}

.timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 28rpx;
}

.timeline-node {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  flex-shrink: 0;
  z-index: 2;

  &.done {
    background: #52c41a;
  }
  &.current {
    background: #4a90e2;
  }

  .check { color: #fff; font-size: 30rpx; font-weight: bold; }
  .dot {
    width: 18rpx; height: 18rpx; border-radius: 50%;
    background: #fff;
  }
  .num { color: #fff; font-size: 26rpx; }
}

.timeline-line {
  flex: 1;
  width: 4rpx;
  background: #e8edf3;
  margin: 4rpx 0;

  &.active { background: #52c41a; }
}

.timeline-content {
  flex: 1;
  padding-bottom: 40rpx;
}

.timeline-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;

  .badge {
    font-size: 20rpx;
    color: #fff;
    background: #4a90e2;
    padding: 2rpx 12rpx;
    border-radius: 20rpx;
    margin-left: 12rpx;
    font-weight: normal;

    &.done { background: #52c41a; }
  }
}

.timeline-desc {
  font-size: 24rpx;
  color: #909399;
  margin-top: 8rpx;
  line-height: 1.6;
}

.timeline-content.current .timeline-title {
  color: #4a90e2;
}
</style>
