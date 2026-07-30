/**
 * 全局类型定义
 * AI医学影像检查全流程助手
 */

/** 检查状态枚举 */
export type ExamStatus = 'waiting' | 'in_progress' | 'completed' | 'cancelled'

/** 报告状态枚举 */
export type ReportStatus = 'pending' | 'reviewing' | 'completed' | 'abnormal'

/** 检查类型 */
export type ExamType = 'CT' | 'MRI' | 'XRAY' | 'ULTRASOUND' | 'PET'

/** 检查设备类型 */
export type DeviceType = 'CT' | 'MRI' | 'DR' | 'US' | 'PET_CT'

/** 用户信息 */
export interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone?: string
  openid?: string
  isElderMode: boolean
}

/** 就诊人/家庭成员 */
export interface FamilyMember {
  id: string
  name: string
  relation: string // 本人、父亲、母亲、子女等
  gender: 'male' | 'female'
  age: number
  idCard?: string
  isDefault: boolean
}

/** 检查单绑定信息 */
export interface ExamOrder {
  id: string
  memberId: string // 关联就诊人
  examType: ExamType
  examName: string // 腹部增强CT
  bodyPart: string // 腹部
  deviceType: DeviceType
  location: string // 影像科3楼CT室
  roomNo: string // CT-03
  scheduledTime: string // 10:30
  estimatedDuration: string // 30-45分钟
  status: ExamStatus
  queueNumber: number // 您的号码
  queueAhead: number // 前方人数
  queueTotal: number // 总排队人数
  estimatedWait: number // 预计等待(分钟)
  barCode: string // 检查单二维码内容
  createdAt: string
  contrastAgent: boolean // 是否增强
}

/** 检查流程步骤 */
export interface ExamStep {
  id: string
  title: string // 签到
  desc: string // 步骤说明
  status: 'done' | 'current' | 'pending'
  icon: string
}

/** 检查前准备项 */
export interface PreExamItem {
  id: string
  category: string // 饮食要求/携带/衣物
  icon: string
  title: string
  desc: string
  mediaType?: 'image' | 'animation' | 'video'
  mediaUrl?: string
}

/** 禁忌症提醒 */
export interface Contraindication {
  id: string
  title: string // 造影剂过敏史
  level: 'high' | 'medium' | 'low'
  desc: string
}

/** 队列患者（隐私保护，不显示姓名） */
export interface QueuePatient {
  number: number
  status: 'checking' | 'waiting' | 'done'
}

/** AI对话消息 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isCollected?: boolean
  type?: 'text' | 'card' // card类型用于结构化回答
  cardData?: ExamQA
}

/** AI问答结构化数据 */
export interface ExamQA {
  question: string
  answer: string
  category: 'process' | 'experience' | 'contraindication' | 'report' | 'other'
  references?: string[]
  warning?: string // 注意事项/免责声明
}

/** 报告信息 */
export interface ExamReport {
  id: string
  examId: string
  examName: string
  status: ReportStatus
  summary: string // 报告摘要
  abnormalFindings?: string[]
  normalFindings?: string[]
  conclusion: string
  generatedAt?: string
  pickupLocation: string // 取报告地点
  pickupTime: string // 取报告时间
  doctorName?: string
  pacsUrl?: string // PACS完整报告链接
  aiInterpretation?: string // AI解读
}

/** 辐射安全信息 */
export interface RadiationInfo {
  examType: ExamType
  name: string // 胸片
  dose: number // 辐射剂量 mSv
  doseText: string // 约0.05 mSv
  isNonIonizing: boolean // 是否非电离辐射(MRI/超声)
  comparison: string // 通俗解释
  equivalent: string[] // 生活化比较
  icon: string
  color: string
  safetyNote: string
}

/** 排队通知 */
export interface QueueNotification {
  id: string
  type: 'near' | 'emergency' | 'done' | 'normal'
  title: string
  content: string
  timestamp: number
  read: boolean
}

/** API响应通用结构 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** 共用分页 */
export interface PageQuery {
  page: number
  pageSize: number
}
