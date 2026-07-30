import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, FamilyMember, ExamOrder } from '@/types'
import { mockUser, mockFamilyMembers, mockExamOrders } from '@/api/mockData'
import * as api from '@/api'

/** 用户与检查数据 Store */
export const useUserStore = defineStore(
  'user',
  () => {
    // 状态
    const userInfo = ref<UserInfo>({ ...mockUser })
    const isLogin = ref(false)
    const familyMembers = ref<FamilyMember[]>([])
    const currentMemberId = ref<string>('')
    const examOrders = ref<ExamOrder[]>([])

    // 计算属性
    const currentMember = computed(
      () =>
        familyMembers.value.find((m) => m.id === currentMemberId.value) ||
        familyMembers.value[0]
    )

    const myExams = computed(() =>
      examOrders.value.filter((e) => e.memberId === currentMemberId.value)
    )

    const currentExam = computed(() => myExams.value[0] || null)

    const isElderMode = computed(() => userInfo.value.isElderMode)

    // 方法
    function initFromStorage() {
      const stored = uni.getStorageSync('userInfo')
      if (stored) {
        userInfo.value = stored
        isLogin.value = true
      }
      const members = uni.getStorageSync('familyMembers')
      familyMembers.value = members?.length ? members : [...mockFamilyMembers]
      currentMemberId.value =
        uni.getStorageSync('currentMemberId') ||
        familyMembers.value[0]?.id ||
        ''
      const exams = uni.getStorageSync('examOrders')
      examOrders.value = exams?.length ? exams : [...mockExamOrders]
    }

    /** 微信登录 */
    async function login() {
      // TODO: 真实 wx.login -> code -> 后端换取 openid
      return new Promise<void>((resolve) => {
        uni.showLoading({ title: '登录中' })
        setTimeout(() => {
          isLogin.value = true
          userInfo.value = { ...mockUser }
          uni.setStorageSync('userInfo', userInfo.value)
          uni.setStorageSync('familyMembers', mockFamilyMembers)
          uni.setStorageSync('examOrders', mockExamOrders)
          familyMembers.value = [...mockFamilyMembers]
          examOrders.value = [...mockExamOrders]
          currentMemberId.value = mockFamilyMembers[0].id
          uni.hideLoading()
          resolve()
        }, 1000)
      })
    }

    /** 退出 */
    function logout() {
      isLogin.value = false
      userInfo.value = { ...mockUser }
      uni.removeStorageSync('userInfo')
    }

    /** 切换长辈模式 */
    function toggleElderMode() {
      userInfo.value.isElderMode = !userInfo.value.isElderMode
      uni.setStorageSync('userInfo', userInfo.value)
    }

    /** 切换当前就诊人 */
    function switchMember(id: string) {
      currentMemberId.value = id
      uni.setStorageSync('currentMemberId', id)
    }

    /** 绑定检查单 */
    async function bindExam(barcode: string) {
      const res = await api.bindExamByBarcode(barcode)
      if (res.code === 0) {
        examOrders.value.unshift(res.data)
        uni.setStorageSync('examOrders', examOrders.value)
        return res.data
      }
      throw new Error(res.message)
    }

    return {
      userInfo,
      isLogin,
      familyMembers,
      currentMemberId,
      examOrders,
      currentMember,
      myExams,
      currentExam,
      isElderMode,
      initFromStorage,
      login,
      logout,
      toggleElderMode,
      switchMember,
      bindExam
    }
  }
)
