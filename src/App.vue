<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from './store/user'

// ====== H5 polyfill: 全局 mock uni 对象 ======
const h5Uni: Record<string, any> = {
  getStorageSync(key: string) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
  },
  setStorageSync(key: string, value: any) {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  },
  removeStorageSync(key: string) {
    try { localStorage.removeItem(key) } catch {}
  },
  showToast(opts: any) {
    const el = document.createElement('div')
    el.textContent = typeof opts === 'string' ? opts : (opts.title || '')
    el.style.cssText = 'position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.75);color:#fff;padding:16px 32px;border-radius:12px;font-size:16px;z-index:99999;pointer-events:none;transition:opacity 0.3s;'
    document.body.appendChild(el)
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300) }, 1800)
  },
  showLoading() {},
  hideLoading() {},
  showModal(opts: any) {
    const result = confirm(opts.content || '')
    if (opts.success) opts.success({ confirm: result, cancel: !result })
  },
  showActionSheet(opts: any) {
    alert(opts.itemList?.join('\n') || '')
    if (opts.success) opts.success({ tapIndex: 0 })
  },
  switchTab(opts: any) {
    location.hash = '#/' + (opts.url || '').replace(/^\//, '')
  },
  navigateTo(opts: any) {
    location.hash = '#/' + (opts.url || '').replace(/^\//, '')
  },
  navigateBack() {
    history.back()
  },
  getSystemInfoSync() {
    return { statusBarHeight: 20, windowWidth: window.innerWidth, windowHeight: window.innerHeight }
  },
  request() {
    console.warn('[H5] uni.request not available, using mock data')
    return { abort: () => {} }
  }
}

// 注入到全局
;(window as any).uni = new Proxy(h5Uni, {
  get(target, prop) {
    return target[prop as string] || (() => { console.warn('[H5] uni.' + String(prop) + ' not implemented') })
  }
})

// H5 下初始化默认数据
const H5_DEFAULTS = {
  userInfo: { id: 'U001', nickname: '李先生', avatar: '', phone: '138****8888', isElderMode: false },
  familyMembers: [
    { id: 'M001', name: '李先生', relation: '本人', gender: 'male', age: 45, isDefault: true },
    { id: 'M002', name: '李父', relation: '父亲', gender: 'male', age: 72, isDefault: false },
    { id: 'M003', name: '李母', relation: '母亲', gender: 'female', age: 68, isDefault: false }
  ],
  examOrders: [
    { id: 'E001', memberId: 'M001', examType: 'CT', examName: '腹部增强CT', bodyPart: '腹部', deviceType: 'CT', location: '影像科3楼 CT室', roomNo: 'CT-03', scheduledTime: '10:30', estimatedDuration: '30-45分钟', status: 'waiting', queueNumber: 24, queueAhead: 5, queueTotal: 32, estimatedWait: 20, barCode: 'HIS2026031500123', createdAt: '2026-03-15 09:12', contrastAgent: true },
    { id: 'E002', memberId: 'M002', examType: 'XRAY', examName: '胸部正侧位片', bodyPart: '胸部', deviceType: 'DR', location: '影像科2楼 DR室', roomNo: 'DR-01', scheduledTime: '14:00', estimatedDuration: '10-15分钟', status: 'completed', queueNumber: 8, queueAhead: 0, queueTotal: 8, estimatedWait: 0, barCode: 'HIS2026031400891', createdAt: '2026-03-14 13:30', contrastAgent: false }
  ]
}
try {
  if (!localStorage.getItem('userInfo')) localStorage.setItem('userInfo', JSON.stringify(H5_DEFAULTS.userInfo))
  if (!localStorage.getItem('familyMembers')) localStorage.setItem('familyMembers', JSON.stringify(H5_DEFAULTS.familyMembers))
  if (!localStorage.getItem('examOrders')) localStorage.setItem('examOrders', JSON.stringify(H5_DEFAULTS.examOrders))
  if (!localStorage.getItem('currentMemberId')) localStorage.setItem('currentMemberId', 'M001')
} catch(e) {}

const userStore = useUserStore()

onLaunch(() => {
  console.log('App Launch - AI医学影像检查助手')
  userStore.initFromStorage()
})

onShow(() => { console.log('App Show') })
onHide(() => { console.log('App Hide') })
</script>

<style lang="scss">
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

.elder-mode {
  --font-scale: 1.3;
  --button-scale: 1.2;
  page { font-size: calc(28rpx * var(--font-scale)); }
  .card { padding: calc(32rpx * var(--button-scale)) !important; }
  button, .btn {
    min-height: calc(88rpx * var(--button-scale)) !important;
    font-size: calc(32rpx * var(--font-scale)) !important;
  }
}
</style>
