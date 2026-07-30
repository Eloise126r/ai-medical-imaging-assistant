import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatMessage, ExamQA } from '@/types'
import * as api from '@/api'
import { mockQAKnowledge } from '@/api/mockData'

/** AI问答 Store */
export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const history = ref<ChatMessage[][]>([])
  const loading = ref(false)
  const quickQuestions = ref<string[]>([
    'CT检查需要多久？',
    '做MRI疼吗？',
    '高血压可以做增强CT吗？',
    '多久可以拿报告？',
    '增强CT后要注意什么？'
  ])

  /** 发送消息并获取AI回复 */
  async function sendMessage(content: string) {
    const userMsg: ChatMessage = {
      id: 'U' + Date.now(),
      role: 'user',
      content,
      timestamp: Date.now()
    }
    messages.value.push(userMsg)
    loading.value = true

    try {
      const res = await api.askAI(messages.value)
      const aiMsg: ChatMessage = {
        id: 'A' + Date.now(),
        role: 'assistant',
        content: res.data,
        timestamp: Date.now()
      }
      messages.value.push(aiMsg)
    } catch (e) {
      const errMsg: ChatMessage = {
        id: 'A' + Date.now(),
        role: 'assistant',
        content: '抱歉，我现在无法回答，请稍后再试。',
        timestamp: Date.now()
      }
      messages.value.push(errMsg)
    } finally {
      loading.value = false
    }
  }

  /** 收藏消息 */
  function toggleCollect(id: string) {
    const msg = messages.value.find((m) => m.id === id)
    if (msg) msg.isCollected = !msg.isCollected
  }

  /** 清空当前对话 */
  function clearMessages() {
    if (messages.value.length) {
      history.value.unshift([...messages.value])
    }
    messages.value = []
  }

  /** 获取本地知识库（兜底） */
  function getLocalKnowledge(): ExamQA[] {
    return mockQAKnowledge
  }

  return {
    messages,
    history,
    loading,
    quickQuestions,
    sendMessage,
    toggleCollect,
    clearMessages,
    getLocalKnowledge
  }
})
