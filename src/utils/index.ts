/**
 * 通用工具函数
 */

/** 格式化时间 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/** 格式化日期 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const y = date.getFullYear()
  const mo = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${mo}-${d}`
}

/** 防抖 */
export function debounce(fn: Function, delay = 300) {
  let timer: any = null
  return (...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/** 手机号脱敏 */
export function maskPhone(phone?: string): string {
  if (!phone) return ''
  if (phone.includes('*')) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/** 显示Toast */
export function toast(title: string, icon: 'success' | 'none' | 'error' = 'none') {
  uni.showToast({ title, icon })
}

/** 获取状态文本 */
export function getExamStatusText(status: string): string {
  const map: Record<string, string> = {
    waiting: '等待检查',
    in_progress: '检查中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

/** 获取报告状态文本 */
export function getReportStatusText(status: string): string {
  const map: Record<string, string> = {
    pending: '检查完成',
    reviewing: '报告审核中',
    completed: '报告已生成',
    abnormal: '异常提示'
  }
  return map[status] || status
}

/** 剂量可视化比例（用于进度条展示） */
export function getDoseRatio(dose: number): number {
  // 以10mSv为满格参考
  return Math.min(dose / 10, 1)
}

/** 模拟语音识别（预留） */
export function startVoiceInput(): Promise<string> {
  return new Promise((resolve) => {
    // TODO: 接入微信同声传译 / 百度语音等
    uni.showToast({ title: '请说话...', icon: 'none' })
    setTimeout(() => {
      resolve('做增强CT前要注意什么？')
    }, 1500)
  })
}
