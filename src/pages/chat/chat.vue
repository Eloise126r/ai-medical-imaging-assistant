<template>
  <view class="chat-page" :class="{ 'elder-mode': elderMode }">
    <NavBar title="AI智能问答">
      <template #right>
        <text class="nav-clear" @tap="clearChat">清空</text>
      </template>
    </NavBar>

    <view class="chat-body">
      <!-- 欢迎/快捷问题 -->
      <view class="welcome-area" v-if="messages.length === 0">
        <view class="welcome-avatar">🤖</view>
        <text class="welcome-title">智能影像检查助手</text>
        <text class="welcome-desc"
          >我可以帮您解答检查流程、注意事项、辐射安全和报告相关问题</text
        >
        <view class="quick-list">
          <view
            class="quick-item"
            v-for="(q, idx) in quickQuestions"
            :key="idx"
            @tap="sendQuick(q)"
          >
            {{ q }}
          </view>
        </view>
        <view class="rule-tip">
          ⚠️ 我只能提供检查流程、注意事项和健康教育，不能替代医生诊断
        </view>
      </view>

      <!-- 对话列表 -->
      <scroll-view
        class="msg-scroll"
        scroll-y
        :scroll-into-view="scrollToId"
        :scroll-with-animation="true"
        v-else
      >
        <view
          v-for="msg in messages"
          :key="msg.id"
          :id="'msg-' + msg.id"
        >
          <ChatBubble
            :message="msg"
            :show-warning="msg.role === 'assistant'"
            @collect="onCollect"
            @share="onShare"
          />
        </view>
        <view class="loading-row" v-if="loading">
          <view class="typing">
            <text class="dot"></text>
            <text class="dot"></text>
            <text class="dot"></text>
          </view>
          <text class="typing-text">AI正在思考...</text>
        </view>
      </scroll-view>
    </view>

    <!-- 快捷问题（对话中显示） -->
    <view class="quick-bar" v-if="messages.length > 0 && showQuickBar">
      <text
        class="quick-chip"
        v-for="(q, idx) in quickQuestions.slice(0, 3)"
        :key="idx"
        @tap="sendQuick(q)"
        >{{ q }}</text
      >
    </view>

    <!-- 输入区 -->
    <view class="input-area safe-area-bottom">
      <view class="voice-btn" :class="{ active: recording }" @tap="onVoice">
        🎤
      </view>
      <input
        class="text-input"
        v-model="inputText"
        placeholder="输入您的问题..."
        confirm-type="send"
        @confirm="onSend"
      />
      <button class="send-btn" :disabled="!inputText" @tap="onSend">
        发送
      </button>
    </view>

    <!-- 语音输入遮罩 -->
    <view class="voice-mask" v-if="recording" @tap="stopVoice">
      <view class="voice-card">
        <view class="voice-wave">
          <text class="wave-bar" v-for="i in 5" :key="i"></text>
        </view>
        <text class="voice-tip">正在聆听，点击任意处结束</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useChatStore } from '@/store/chat'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import ChatBubble from '@/components/ChatBubble.vue'
import type { ChatMessage } from '@/types'
import { startVoiceInput, toast } from '@/utils'

const chatStore = useChatStore()
const userStore = useUserStore()
const elderMode = computed(() => userStore.isElderMode)

const messages = computed(() => chatStore.messages)
const loading = computed(() => chatStore.loading)
const quickQuestions = computed(() => chatStore.quickQuestions)

const inputText = ref('')
const recording = ref(false)
const scrollToId = ref('')
const showQuickBar = ref(true)

watch(
  messages,
  () => {
    nextTick(() => {
      const last = messages.value[messages.value.length - 1]
      if (last) {
        scrollToId.value = 'msg-' + last.id
      }
    })
  },
  { deep: true }
)

function onSend() {
  const text = inputText.value.trim()
  if (!text) return
  inputText.value = ''
  chatStore.sendMessage(text)
}

function sendQuick(q: string) {
  chatStore.sendMessage(q)
}

function onCollect(id: string) {
  chatStore.toggleCollect(id)
  toast('已收藏', 'success')
}

function onShare(msg: ChatMessage) {
  // TODO: 接入转发给家人 / 生成分享卡片
  uni.showActionSheet({
    itemList: ['父亲', '母亲', '微信好友', '复制文本'],
    success: (res) => {
      toast('已分享', 'success')
    }
  })
}

function clearChat() {
  if (messages.value.length === 0) return
  uni.showModal({
    title: '确认清空',
    content: '将结束当前对话，历史可查看',
    success: (res) => {
      if (res.confirm) {
        chatStore.clearMessages()
        showQuickBar.value = true
      }
    }
  })
}

function onVoice() {
  recording.value = true
  startVoiceInput().then((text) => {
    recording.value = false
    if (text) {
      inputText.value = text
    }
  })
}

function stopVoice() {
  recording.value = false
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-color;
}

.nav-clear {
  font-size: 28rpx;
  color: #fff;
  padding: 8rpx 16rpx;
}

.chat-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.welcome-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 48rpx;

  .welcome-avatar {
    width: 140rpx;
    height: 140rpx;
    border-radius: 36rpx;
    background: linear-gradient(135deg, #52c41a, #73d13d);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80rpx;
    margin-bottom: 32rpx;
  }

  .welcome-title {
    font-size: 38rpx;
    font-weight: 700;
    color: #303133;
  }

  .welcome-desc {
    font-size: 26rpx;
    color: #909399;
    text-align: center;
    margin-top: 16rpx;
    line-height: 1.6;
  }

  .quick-list {
    width: 100%;
    margin-top: 48rpx;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  .quick-item {
    background: #fff;
    border: 2rpx solid #e6f7ff;
    border-radius: 20rpx;
    padding: 28rpx 32rpx;
    font-size: 28rpx;
    color: #4a90e2;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

    &:active { background: #e6f7ff; }
  }

  .rule-tip {
    margin-top: 40rpx;
    font-size: 22rpx;
    color: #faad14;
    background: #fff7e6;
    padding: 16rpx 24rpx;
    border-radius: 12rpx;
    line-height: 1.6;
    text-align: center;
  }
}

.msg-scroll {
  flex: 1;
  padding: 32rpx;
}

.loading-row {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.typing {
  display: flex;
  gap: 8rpx;
  margin-right: 16rpx;

  .dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: #4a90e2;
    animation: typing 1.2s infinite;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-10rpx); opacity: 1; }
}

.typing-text {
  font-size: 24rpx;
  color: #909399;
}

.quick-bar {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 32rpx;
  overflow-x: auto;

  .quick-chip {
    flex-shrink: 0;
    font-size: 24rpx;
    color: #4a90e2;
    background: #fff;
    border: 2rpx solid #e6f7ff;
    padding: 12rpx 24rpx;
    border-radius: 30rpx;
  }
}

.input-area {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 32rpx;
  background: #fff;
  border-top: 1rpx solid #f0f2f5;

  .voice-btn {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: #f0f2f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;

    &.active {
      background: #4a90e2;
    }
  }

  .text-input {
    flex: 1;
    height: 72rpx;
    background: #f5f7fa;
    border-radius: 36rpx;
    padding: 0 32rpx;
    font-size: 28rpx;
  }

  .send-btn {
    height: 72rpx;
    padding: 0 36rpx;
    background: #4a90e2;
    color: #fff;
    border-radius: 36rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;

    &[disabled] {
      background: #c0c4cc;
    }
  }
}

.voice-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.voice-wave {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 32rpx;

  .wave-bar {
    width: 12rpx;
    height: 80rpx;
    background: #4a90e2;
    border-radius: 6rpx;
    animation: wave 0.8s infinite;

    &:nth-child(2) { animation-delay: 0.1s; height: 120rpx; }
    &:nth-child(3) { animation-delay: 0.2s; height: 60rpx; }
    &:nth-child(4) { animation-delay: 0.3s; height: 100rpx; }
    &:nth-child(5) { animation-delay: 0.4s; height: 70rpx; }
  }
}

@keyframes wave {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1.2); }
}

.voice-tip {
  color: #fff;
  font-size: 28rpx;
}
</style>
