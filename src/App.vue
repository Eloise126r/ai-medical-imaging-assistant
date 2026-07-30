<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from './store/user'

const userStore = useUserStore()

onLaunch(() => {
  console.log('App Launch - AI医学影像检查助手')
  // 初始化应用
  userStore.initFromStorage()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* 全局样式 */
@import './styles/variables.scss';
@import './styles/global.scss';

page {
  background-color: $bg-color;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
    Arial, sans-serif;
  font-size: 28rpx;
  color: $text-primary;
}

/* 长辈模式样式增强 */
.elder-mode {
  --font-scale: 1.3;
  --button-scale: 1.2;

  page {
    font-size: calc(28rpx * var(--font-scale));
  }

  .card {
    padding: calc(32rpx * var(--button-scale)) !important;
  }

  button, .btn {
    min-height: calc(88rpx * var(--button-scale)) !important;
    font-size: calc(32rpx * var(--font-scale)) !important;
  }
}
</style>
