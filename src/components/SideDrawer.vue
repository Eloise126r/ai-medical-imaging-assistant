<template>
  <view>
    <!-- 遮罩 -->
    <view
      class="drawer-mask"
      v-if="visible"
      @tap="$emit('close')"
    ></view>

    <!-- 左侧导航栏 -->
    <view class="drawer" :class="{ open: visible }">
      <view class="drawer-header" :class="{ 'elder-mode': elderMode }">
        <view class="dh-avatar">{{ initial }}</view>
        <view class="dh-meta">
          <text class="dh-name">{{ userInfo.nickname }}</text>
          <text class="dh-sub">{{ currentMemberName }}</text>
        </view>
      </view>

      <!-- 家人切换 -->
      <view class="drawer-section">
        <text class="ds-title">就诊人</text>
        <view class="member-switch">
          <view
            class="ms-chip"
            v-for="m in familyMembers"
            :key="m.id"
            :class="{ active: m.id === currentMemberId }"
            @tap="onSwitch(m.id)"
          >
            {{ m.name }}
          </view>
        </view>
      </view>

      <!-- 导航项 -->
      <view class="nav-list">
        <view
          class="nav-item"
          v-for="item in navItems"
          :key="item.key"
          @tap="onNav(item)"
        >
          <text class="nav-icon">{{ item.icon }}</text>
          <text class="nav-label">{{ item.label }}</text>
          <text class="nav-arrow">›</text>
        </view>
      </view>

      <!-- 底部 -->
      <view class="drawer-footer">
        <view class="elder-toggle" @tap="toggleElder">
          <text class="et-icon">👴</text>
          <text class="et-label">长辈模式</text>
          <view class="et-switch" :class="{ on: elderMode }">
            <view class="et-dot"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { goQueue, goChat, goReport, goRadiation, goDetail } from '@/utils/nav'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['close', 'navigate'])

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const elderMode = computed(() => userStore.isElderMode)
const familyMembers = computed(() => userStore.familyMembers)
const currentMemberId = computed(() => userStore.currentMemberId)

const initial = computed(() => userInfo.value.nickname?.[0] || '患')
const currentMemberName = computed(
  () => familyMembers.value.find((m) => m.id === currentMemberId.value)?.name || ''
)

const navItems = [
  { key: 'home', icon: '🏠', label: '首页 · 我的检查', url: 'home' },
  { key: 'queue', icon: '📊', label: '实时排队', url: 'queue' },
  { key: 'detail', icon: '📋', label: '检查详情', url: 'detail' },
  { key: 'chat', icon: '🤖', label: 'AI智能问答', url: 'chat' },
  { key: 'report', icon: '📄', label: '我的报告', url: 'report' },
  { key: 'radiation', icon: '☢️', label: '辐射安全教育', url: 'radiation' }
]

function onSwitch(id: string) {
  userStore.switchMember(id)
}

function toggleElder() {
  userStore.toggleElderMode()
}

function onNav(item: any) {
  emit('close')
  switch (item.key) {
    case 'home':
      uni.switchTab({ url: '/pages/index/index' })
      break
    case 'queue':
      goQueue(userStore.currentExam?.id)
      break
    case 'detail':
      if (userStore.currentExam) goDetail(userStore.currentExam.id)
      else uni.switchTab({ url: '/pages/index/index' })
      break
    case 'chat':
      goChat()
      break
    case 'report':
      goReport()
      break
    case 'radiation':
      goRadiation()
      break
  }
}
</script>

<style lang="scss" scoped>
.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 560rpx;
  background: #fff;
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 8rpx 0 32rpx rgba(0, 0, 0, 0.1);

  &.open {
    transform: translateX(0);
  }
}

.drawer-header {
  background: linear-gradient(135deg, #4a90e2, #6ba3e8);
  padding: 120rpx 40rpx 40rpx;
  display: flex;
  align-items: center;

  .dh-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #fff;
    color: #4a90e2;
    font-size: 44rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dh-meta {
    margin-left: 24rpx;
    display: flex;
    flex-direction: column;

    .dh-name {
      font-size: 34rpx;
      font-weight: 700;
      color: #fff;
    }

    .dh-sub {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 6rpx;
    }
  }

  &.elder-mode .dh-name {
    font-size: 44rpx;
  }
}

.drawer-section {
  padding: 32rpx 32rpx 16rpx;
  border-bottom: 1rpx solid #f0f2f5;

  .ds-title {
    font-size: 24rpx;
    color: #909399;
    display: block;
    margin-bottom: 16rpx;
  }

  .member-switch {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
  }

  .ms-chip {
    font-size: 24rpx;
    padding: 10rpx 24rpx;
    background: #f5f7fa;
    border-radius: 20rpx;
    color: #606266;

    &.active {
      background: #4a90e2;
      color: #fff;
    }
  }
}

.nav-list {
  flex: 1;
  padding: 16rpx 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 32rpx 40rpx;

  &:active {
    background: #f5f7fa;
  }

  .nav-icon {
    font-size: 40rpx;
    margin-right: 24rpx;
  }

  .nav-label {
    flex: 1;
    font-size: 30rpx;
    color: #303133;
  }

  .nav-arrow {
    font-size: 40rpx;
    color: #c0c4cc;
  }
}

.drawer-footer {
  padding: 32rpx 40rpx;
  border-top: 1rpx solid #f0f2f5;

  .elder-toggle {
    display: flex;
    align-items: center;

    .et-icon { font-size: 36rpx; margin-right: 16rpx; }
    .et-label {
      flex: 1;
      font-size: 28rpx;
      color: #303133;
    }

    .et-switch {
      width: 80rpx;
      height: 48rpx;
      border-radius: 24rpx;
      background: #e8edf3;
      position: relative;

      &.on { background: #4a90e2; }

      .et-dot {
        position: absolute;
        top: 6rpx;
        left: 6rpx;
        width: 36rpx;
        height: 36rpx;
        border-radius: 50%;
        background: #fff;
        transition: left 0.3s;

        .on & { left: 38rpx; }
      }
    }
  }
}
</style>
