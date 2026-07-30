/**
 * 页面导航与扫码工具
 */

/** 跳转到首页（tab） */
export function goHome() {
  uni.switchTab({ url: '/pages/index/index' })
}

/** 跳转排队页 */
export function goQueue(examId?: string) {
  uni.navigateTo({ url: `/pages/queue/queue${examId ? '?id=' + examId : ''}` })
}

/** 跳转检查详情 */
export function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}

/** 跳转AI问答 */
export function goChat() {
  uni.switchTab({ url: '/pages/chat/chat' })
}

/** 跳转报告 */
export function goReport() {
  uni.switchTab({ url: '/pages/report/report' })
}

/** 跳转辐射教育 */
export function goRadiation() {
  uni.navigateTo({ url: '/pages/radiation/radiation' })
}

/** 跳转个人中心（tab） */
export function goSettings() {
  uni.switchTab({ url: '/pages/settings/settings' })
}

/** 跳转登录/绑定页 */
export function goLogin() {
  uni.navigateTo({ url: '/pages/login/login' })
}

/** 扫码绑定检查单（预留真实扫码） */
export function goScanBind() {
  // TODO: 真实环境 uni.scanCode 获取二维码内容，调用 bindExamByBarcode
  // uni.scanCode({
  //   success: (res) => { useUserStore().bindExam(res.result) }
  // })
  uni.showLoading({ title: '模拟扫码' })
  setTimeout(() => {
    uni.hideLoading()
    const fakeBarcode = 'HIS' + Date.now()
    import('@/store/user').then(({ useUserStore }) => {
      const userStore = useUserStore()
      userStore
        .bindExam(fakeBarcode)
        .then(() => {
          uni.showToast({ title: '绑定成功', icon: 'success' })
        })
        .catch(() => {
          uni.showToast({ title: '绑定失败', icon: 'error' })
        })
    })
  }, 1000)
}

/** 通用toast */
export function toast(title: string, icon: 'success' | 'none' | 'error' = 'none') {
  uni.showToast({ title, icon })
}
