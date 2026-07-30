<template>
  <view class="dose-card" :style="{ borderColor: info.color + '33' }">
    <view class="dose-header">
      <view class="dose-icon" :style="{ background: info.color + '1A' }">
        <text class="icon-emoji">{{ iconEmoji }}</text>
      </view>
      <view class="dose-title-wrap">
        <text class="dose-name">{{ info.name }}</text>
        <text class="dose-dose" :style="{ color: info.color }">{{
          info.doseText
        }}</text>
      </view>
    </view>

    <!-- 剂量可视化条 -->
    <view class="dose-bar-wrap" v-if="!info.isNonIonizing">
      <view class="dose-bar-bg">
        <view
          class="dose-bar-fill"
          :style="{
            width: doseRatio * 100 + '%',
            background: info.color
          }"
        ></view>
      </view>
      <text class="dose-bar-label"
        >相对安全阈值：{{ Math.round(doseRatio * 100) }}%</text
      >
    </view>

    <view class="dose-nonion" v-else :style="{ background: info.color + '0D' }">
      <text class="nonion-text">🔒 {{ info.comparison }}</text>
    </view>

    <!-- 通俗解释 -->
    <view class="dose-compare">
      <text class="compare-main">{{ info.comparison }}</text>
      <view class="compare-list">
        <view
          class="compare-item"
          v-for="(item, idx) in info.equivalent"
          :key="idx"
        >
          <text class="compare-dot" :style="{ background: info.color }"></text>
          <text class="compare-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 安全提示 -->
    <view class="dose-safety">
      <text class="safety-icon">💡</text>
      <text class="safety-text">{{ info.safetyNote }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RadiationInfo } from '@/types'
import { getDoseRatio } from '@/utils'

const props = defineProps<{
  info: RadiationInfo
}>()

const doseRatio = computed(() => getDoseRatio(props.info.dose))

const iconEmoji = computed(() => {
  const map: Record<string, string> = {
    xray: '🩻',
    ct: '🖥️',
    mri: '🧲',
    us: '🌊'
  }
  return map[props.info.icon] || '🏥'
})
</script>

<style lang="scss" scoped>
.dose-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid transparent;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.dose-header {
  display: flex;
  align-items: center;
  margin-bottom: 28rpx;
}

.dose-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;

  .icon-emoji { font-size: 44rpx; }
}

.dose-title-wrap {
  display: flex;
  flex-direction: column;
}

.dose-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #303133;
}

.dose-dose {
  font-size: 26rpx;
  font-weight: 600;
  margin-top: 6rpx;
}

.dose-bar-wrap {
  margin-bottom: 28rpx;
}

.dose-bar-bg {
  height: 20rpx;
  background: #f0f2f5;
  border-radius: 10rpx;
  overflow: hidden;
}

.dose-bar-fill {
  height: 100%;
  border-radius: 10rpx;
  transition: width 0.6s ease;
}

.dose-bar-label {
  font-size: 22rpx;
  color: #909399;
  margin-top: 10rpx;
  display: block;
}

.dose-nonion {
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 28rpx;
  text-align: center;

  .nonion-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #303133;
  }
}

.dose-compare {
  margin-bottom: 24rpx;
}

.compare-main {
  font-size: 28rpx;
  font-weight: 600;
  color: #303133;
  display: block;
  margin-bottom: 16rpx;
}

.compare-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.compare-item {
  display: flex;
  align-items: center;
}

.compare-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.compare-text {
  font-size: 25rpx;
  color: #606266;
  line-height: 1.5;
}

.dose-safety {
  background: #fff7e6;
  border-radius: 16rpx;
  padding: 20rpx;
  display: flex;
  align-items: flex-start;

  .safety-icon { margin-right: 12rpx; font-size: 28rpx; }
  .safety-text {
    font-size: 24rpx;
    color: #d48806;
    line-height: 1.6;
    flex: 1;
  }
}
</style>
