import type {
  ApiResponse,
  UserInfo,
  FamilyMember,
  ExamOrder,
  QueuePatient,
  ExamReport,
  ChatMessage
} from '@/types'
import {
  mockExamOrders,
  mockQueuePatients,
  mockFamilyMembers,
  mockExamSteps,
  mockPreExamItems,
  mockReports,
  mockQAKnowledge
} from './mockData'

/**
 * ============================================================
 * API 接口预留层
 * ============================================================
 * 当前使用 mock 数据。后续接入真实后端时，只需替换对应函数实现。
 *
 * 可接入系统：
 *  - 微信登录接口（wx.login / wx.getUserProfile / 手机号）
 *  - 医院 HIS 接口（检查单、排班、报告）
 *  - PACS 报告接口（影像调阅）
 *  - 大语言模型 API（AI问答）
 *  - 排队叫号系统 API（实时队列）
 *
 * 建议：生产环境通过 uni.request 封装统一请求，并加入：
 *  - Token 鉴权
 *  - 统一错误处理
 *  - 请求/响应拦截
 * ============================================================
 */

const USE_MOCK = true

/** 统一请求封装（预留） */
async function request<T>(
  url: string,
  method: 'GET' | 'POST' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  // TODO: 替换为真实 uni.request 调用
  // return new Promise((resolve, reject) => {
  //   uni.request({
  //     url: BASE_URL + url,
  //     method,
  //     data,
  //     header: { Authorization: `Bearer ${getToken()}` },
  //     success: (res) => resolve(res.data),
  //     fail: reject
  //   })
  // })
  console.warn('[API] mock模式，未发送真实请求:', url)
  return { code: 0, message: 'ok', data: data as T }
}

/* ============ 微信登录相关 ============ */

/** 微信一键登录 - 获取 openid/session */
export async function wxLogin(code: string): Promise<ApiResponse<string>> {
  // TODO: 后端 /api/auth/wx-login
  // return request('/api/auth/wx-login', 'POST', { code })
  if (USE_MOCK)
    return { code: 0, message: 'ok', data: 'mock_openid_' + Date.now() }
  return request('/api/auth/wx-login', 'POST', { code })
}

/** 获取手机号（微信加密数据） */
export async function getPhoneNumber(
  encryptedData: string,
  iv: string
): Promise<ApiResponse<string>> {
  // TODO: 后端 /api/auth/phone
  if (USE_MOCK)
    return { code: 0, message: 'ok', data: '138****8888' }
  return request('/api/auth/phone', 'POST', { encryptedData, iv })
}

/* ============ HIS 接口 ============ */

/** 扫描检查单二维码绑定 */
export async function bindExamByBarcode(
  barcode: string
): Promise<ApiResponse<ExamOrder>> {
  // TODO: 后端 /api/his/exam/bind
  // 根据检查单号从 HIS 拉取检查项目、时间、地点、就诊人
  if (USE_MOCK) {
    return {
      code: 0,
      message: 'ok',
      data: { ...mockExamOrders[0], barCode: barcode }
    }
  }
  return request('/api/his/exam/bind', 'POST', { barcode })
}

/** 获取我的检查单列表（含家庭成员） */
export async function getMyExams(
  memberId?: string
): Promise<ApiResponse<ExamOrder[]>> {
  if (USE_MOCK) {
    const list = memberId
      ? mockExamOrders.filter((e) => e.memberId === memberId)
      : mockExamOrders
    return { code: 0, message: 'ok', data: list }
  }
  return request('/api/his/exam/list', 'GET', { memberId })
}

/** 获取检查流程步骤 */
export async function getExamSteps(
  examId: string
): Promise<ApiResponse<any[]>> {
  if (USE_MOCK) {
    return { code: 0, message: 'ok', data: mockExamSteps }
  }
  return request('/api/his/exam/steps', 'GET', { examId })
}

/** 获取检查前准备 */
export async function getPreExamItems(
  examType: string
): Promise<ApiResponse<any[]>> {
  if (USE_MOCK) {
    return { code: 0, message: 'ok', data: mockPreExamItems }
  }
  return request('/api/his/exam/pre-items', 'GET', { examType })
}

/* ============ 排队叫号系统 ============ */

/** 获取实时排队信息 */
export async function getQueueStatus(
  examId: string
): Promise<ApiResponse<any>> {
  if (USE_MOCK) {
    const exam = mockExamOrders.find((e) => e.id === examId)
    return {
      code: 0,
      message: 'ok',
      data: {
        roomNo: exam?.roomNo,
        currentChecking: exam?.queueNumber ? exam.queueNumber - 4 : 0,
        myNumber: exam?.queueNumber,
        ahead: exam?.queueAhead,
        estimatedWait: exam?.estimatedWait,
        total: exam?.queueTotal
      }
    }
  }
  return request('/api/queue/status', 'GET', { examId })
}

/** 获取同检查室排队列表（隐私保护） */
export async function getQueueList(
  roomNo: string
): Promise<ApiResponse<QueuePatient[]>> {
  if (USE_MOCK) {
    return { code: 0, message: 'ok', data: mockQueuePatients }
  }
  return request('/api/queue/list', 'GET', { roomNo })
}

/** 订阅排队通知（WebSocket / 服务通知预留） */
export async function subscribeQueueNotify(
  examId: string
): Promise<ApiResponse<boolean>> {
  // TODO: 接入微信订阅消息 / WebSocket 推送
  if (USE_MOCK) return { code: 0, message: 'ok', data: true }
  return request('/api/queue/subscribe', 'POST', { examId })
}

/* ============ PACS 报告接口 ============ */

/** 获取报告列表 */
export async function getReports(
  memberId?: string
): Promise<ApiResponse<ExamReport[]>> {
  if (USE_MOCK) {
    return { code: 0, message: 'ok', data: mockReports }
  }
  return request('/api/pacs/report/list', 'GET', { memberId })
}

/** 获取报告详情（含AI解读） */
export async function getReportDetail(
  reportId: string
): Promise<ApiResponse<ExamReport>> {
  if (USE_MOCK) {
    return {
      code: 0,
      message: 'ok',
      data: mockReports.find((r) => r.id === reportId)!
    }
  }
  return request('/api/pacs/report/detail', 'GET', { reportId })
}

/* ============ 大语言模型 API ============ */

/**
 * AI智能问答
 * @param messages 对话历史
 * @returns AI回复文本
 */
export async function askAI(
  messages: ChatMessage[]
): Promise<ApiResponse<string>> {
  // TODO: 替换为真实 LLM API（流式可选）
  // return request('/api/llm/chat', 'POST', { messages })
  if (USE_MOCK) {
    const last = messages[messages.length - 1]
    const matched = mockQAKnowledge.find((q) =>
      last.content.includes(q.question.slice(0, 4))
    )
    const answer = matched
      ? matched.answer
      : '您好，我是影像检查助手。我可以为您解答检查流程、注意事项、辐射安全和报告相关问题。请问有什么可以帮您？'
    // 模拟网络延迟
    await new Promise((r) => setTimeout(r, 800))
    return { code: 0, message: 'ok', data: answer }
  }
  return request('/api/llm/chat', 'POST', { messages })
}

/* ============ 家庭成员 ============ */

/** 获取家庭成员列表 */
export async function getFamilyMembers(): Promise<
  ApiResponse<FamilyMember[]>
> {
  if (USE_MOCK) {
    return { code: 0, message: 'ok', data: mockFamilyMembers }
  }
  return request('/api/family/list', 'GET')
}

/** 添加家庭成员 */
export async function addFamilyMember(
  member: Partial<FamilyMember>
): Promise<ApiResponse<FamilyMember>> {
  if (USE_MOCK) {
    return {
      code: 0,
      message: 'ok',
      data: { id: 'M' + Date.now(), isDefault: false, ...member } as FamilyMember
    }
  }
  return request('/api/family/add', 'POST', member)
}
