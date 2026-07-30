<template>
  <view class="nav-bar" :style="navBarStyle">
    <view class="nav-content" :style="{ height: navBarHeight + 'px' }">
      <view class="nav-left" v-if="showBack" @tap="onBack">
        <text class="nav-back">‹</text>
      </view>
      <view class="nav-title" :style="{ color: titleColor }">{{ title }}</view>
      <view class="nav-right">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
  titleColor: { type: String, default: '#FFFFFF' },
  bgColor: { type: String, default: '#4A90E2' },
  transparent: { type: Boolean, default: false }
})

const emit = defineEmits(['back'])

// 获取系统信息（状态栏高度）
const systemInfo = uni.getSystemInfoSync()
const statusBarHeight = systemInfo.statusBarHeight || 20
const navBarHeight = 44 // 导航栏内容高度

const navBarStyle = computed(() => ({
  paddingTop: statusBarHeight + 'px',
  background: props.transparent ? 'transparent' : props.bgColor
}))

function onBack() {
  emit('back')
  uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/index/index' }) })
}
</script>

<style lang="scss" scoped>
.nav-bar {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  transition: background 0.3s;
}

.nav-content {
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  position: relative;
}

.nav-left {
  width: 60rpx;
  display: flex;
  align-items: center;
}

.nav-back {
  font-size: 56rpx;
  font-weight: 300;
  color: inherit;
  line-height: 1;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 60rpx;
}

.nav-right {
  min-width: 60rpx;
  display: flex;
  justify-content: flex-end;
}
</style>
