<template>
  <view
    class="user-avatar"
    :style="{ width: size + 'rpx', height: size + 'rpx', background: bg, fontSize: size * 0.42 + 'rpx' }"
  >
    <image
      v-if="src"
      class="avatar-img"
      :src="src"
      mode="aspectFill"
      @error="onError"
    />
    <text v-else class="avatar-text">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    name?: string
    size?: number
    bg?: string
  }>(),
  {
    src: '',
    name: '患',
    size: 88,
    bg: 'linear-gradient(135deg,#4A90E2,#6BA3E8)'
  }
)

const hasError = ref(false)
const text = computed(() => (props.name || '患').slice(0, 1))

function onError() {
  hasError.value = true
}
</script>

<style lang="scss" scoped>
.user-avatar {
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-text {
  color: #fff;
  font-weight: 700;
}
</style>
