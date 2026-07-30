import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, FamilyMember, ExamOrder } from '@/types'
import { mockUser, mockFamilyMembers, mockExamOrders } from '@/api/mockData'
import * as api from '@/api'

// H5 环境用 localStorage，避免 uni.getStorageSync 触发网络请求
const storage = {
  get(key: string): any {
    try {
      const val = localStorage.getItem(key)
      return val ? JSON.parse(val) : null
    } catch { return null }
  },
  set(key: string, value: any) {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  },
  remove(key: string) {
    try { localStorage.removeItem(key) } catch {}
  }
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({ ...mockUser })
  const isLogin = ref(true)  // H5模式默认已登录
  const familyMembers = ref<FamilyMember[]>([])
  const currentMemberId = ref<string>('')
  const examOrders = ref<ExamOrder[]>([])

  const currentMember = computed(
    () => familyMembers.value.find((m) => m.id === currentMemberId.value) || familyMembers.value[0]
  )

  const myExams = computed(() =>
    examOrders.value.filter((e) => e.memberId === currentMemberId.value)
  )

  const currentExam = computed(() => myExams.value[0] || null)

  const isElderMode = computed(() => userInfo.value.isElderMode)

  function initFromStorage() {
    const stored = storage.get('userInfo')
    if (stored) {
      userInfo.value = stored
      isLogin.value = true
    }
    const members = storage.get('familyMembers')
    familyMembers.value = members?.length ? members : [...mockFamilyMembers]
    currentMemberId.value = storage.get('currentMemberId') || familyMembers.value[0]?.id || ''
    const exams = storage.get('examOrders')
    examOrders.value = exams?.length ? exams : [...mockExamOrders]
  }

  async function login() {
    return new Promise<void>((resolve) => {
      isLogin.value = true
      userInfo.value = { ...mockUser }
      storage.set('userInfo', userInfo.value)
      storage.set('familyMembers', mockFamilyMembers)
      storage.set('examOrders', mockExamOrders)
      familyMembers.value = [...mockFamilyMembers]
      examOrders.value = [...mockExamOrders]
      currentMemberId.value = mockFamilyMembers[0].id
      resolve()
    })
  }

  function logout() {
    isLogin.value = false
    userInfo.value = { ...mockUser }
    storage.remove('userInfo')
  }

  function toggleElderMode() {
    userInfo.value.isElderMode = !userInfo.value.isElderMode
    storage.set('userInfo', userInfo.value)
  }

  function switchMember(id: string) {
    currentMemberId.value = id
    storage.set('currentMemberId', id)
  }

  async function bindExam(barcode: string) {
    const res = await api.bindExamByBarcode(barcode)
    if (res.code === 0) {
      examOrders.value.unshift(res.data)
      storage.set('examOrders', examOrders.value)
      return res.data
    }
    throw new Error(res.message)
  }

  return {
    userInfo, isLogin, familyMembers, currentMemberId, examOrders,
    currentMember, myExams, currentExam, isElderMode,
    initFromStorage, login, logout, toggleElderMode, switchMember, bindExam
  }
})
