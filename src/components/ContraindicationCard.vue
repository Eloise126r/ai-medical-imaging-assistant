<template>
  <view class="contra-card">
    <view class="contra-header">
      <text class="header-icon">⚠️</text>
      <text class="header-title">禁忌症提醒</text>
    </view>
    <view class="contra-tip"
      >如果您存在以下情况，请<text class="highlight">立即告知医生</text
      >：</view
    >

    <view
      class="contra-item"
      v-for="item in items"
      :key="item.id"
      :class="item.level"
    >
      <view class="contra-left">
        <view class="level-bar" :class="item.level"></view>
        <view class="contra-info">
          <text class="contra-name">{{ item.title }}</text>
          <text class="contra-desc">{{ item.desc }}</text>
        </view>
      </view>
      <view class="level-tag" :class="item.level">
        {{ levelText[item.level] }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Contraindication } from '@/types'

defineProps<{
  items: Contraindication[]
}>()

const levelText: Record<string, string> = {
  high: '高危',
  medium: '注意',
  low: '了解'
}
</script>

<style lang="scss" scoped>
.contra-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.contra-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .header-icon { font-size: 36rpx; margin-right: 12rpx; }
  .header-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #ff4d4f;
  }
}

.contra-tip {
  font-size: 26rpx;
  color: #606266;
  margin-bottom: 24rpx;
  line-height: 1.6;

  .highlight {
    color: #ff4d4f;
    font-weight: 700;
  }
}

.contra-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  background: #fff5f5;

  &.high { background: #fff1f0; }
  &.medium { background: #fff7e6; }
  &.low { background: #f6ffed; }
}

.contra-left {
  display: flex;
  flex: 1;
}

.level-bar {
  width: 8rpx;
  border-radius: 4rpx;
  margin-right: 20rpx;

  &.high { background: #ff4d4f; }
  &.medium { background: #faad14; }
  &.low { background: #52c41a; }
}

.contra-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.contra-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6rpx;
}

.contra-desc {
  font-size: 24rpx;
  color: #909399;
  line-height: 1.5;
}

.level-tag {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  margin-left: 16rpx;

  &.high { background: #ff4d4f; color: #fff; }
  &.medium { background: #faad14; color: #fff; }
  &.low { background: #52c41a; color: #fff; }
}
</style>
