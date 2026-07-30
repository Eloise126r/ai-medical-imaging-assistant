<template>
  <view class="msg" :class="message.role">
    <view class="msg-avatar" :class="message.role">
      <text v-if="message.role === 'user'">我</text>
      <text v-else>AI</text>
    </view>
    <view class="msg-body">
      <view class="msg-bubble" :class="message.role">
        <text class="msg-text" user-select>{{ message.content }}</text>

        <!-- 免责声明 -->
        <view class="msg-warning" v-if="showWarning">
          <text class="warn-icon">⚠️</text>
          <text class="warn-text"
            >以上为健康教育信息，不能替代医生诊断。如有不适请及时就医。</text
          >
        </view>

        <!-- 操作区 -->
        <view class="msg-actions" v-if="message.role === 'assistant'">
          <view class="action-btn" @tap="$emit('collect', message.id)">
            <text :class="{ active: message.isCollected }">{{
              message.isCollected ? '★ 已收藏' : '☆ 收藏'
            }}</text>
          </view>
          <view class="action-btn" @tap="$emit('share', message)">
            <text>↗ 分享家人</text>
          </view>
        </view>
      </view>
      <text class="msg-time">{{ time }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChatMessage } from '@/types'
import { formatTime } from '@/utils'

const props = defineProps<{
  message: ChatMessage
  showWarning?: boolean
}>()

const emit = defineEmits(['collect', 'share'])

const time = computed(() => formatTime(props.message.timestamp))
</script>

<style lang="scss" scoped>
.msg {
  display: flex;
  margin-bottom: 32rpx;
  align-items: flex-start;

  &.assistant {
    flex-direction: row;
  }

  &.user {
    flex-direction: row-reverse;
  }
}

.msg-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 600;
  flex-shrink: 0;

  &.user {
    background: #4a90e2;
    color: #fff;
  }

  &.assistant {
    background: linear-gradient(135deg, #52c41a, #73d13d);
    color: #fff;
  }
}

.msg-body {
  max-width: 70%;
  margin: 0 20rpx;
  display: flex;
  flex-direction: column;

  .user & {
    align-items: flex-end;
  }
}

.msg-bubble {
  padding: 24rpx 28rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
  line-height: 1.7;
  word-break: break-all;

  &.assistant {
    background: #fff;
    color: #303133;
    border-top-left-radius: 8rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  }

  &.user {
    background: #4a90e2;
    color: #fff;
    border-top-right-radius: 8rpx;
  }
}

.msg-text {
  white-space: pre-wrap;
}

.msg-warning {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f2f5;
  display: flex;
  align-items: flex-start;

  .warn-icon { font-size: 22rpx; margin-right: 8rpx; }
  .warn-text { font-size: 22rpx; color: #faad14; line-height: 1.5; }
}

.msg-actions {
  display: flex;
  gap: 32rpx;
  margin-top: 16rpx;

  .action-btn {
    font-size: 24rpx;
    color: #4a90e2;

    .active { color: #faad14; }
  }
}

.msg-time {
  font-size: 20rpx;
  color: #c0c4cc;
  margin-top: 8rpx;
}
</style>
