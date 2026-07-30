import type {
  UserInfo,
  FamilyMember,
  ExamOrder,
  ExamStep,
  PreExamItem,
  Contraindication,
  QueuePatient,
  ExamReport,
  RadiationInfo,
  ExamQA,
  QueueNotification
} from '@/types'

/**
 * 模拟数据服务
 * 真实环境请替换为 HIS / PACS / 排队叫号系统 API
 */

/** 当前登录用户 */
export const mockUser: UserInfo = {
  id: 'U001',
  nickname: '李先生',
  avatar: '',
  phone: '138****8888',
  isElderMode: false
}

/** 家庭成员 */
export const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'M001',
    name: '李先生',
    relation: '本人',
    gender: 'male',
    age: 45,
    isDefault: true
  },
  {
    id: 'M002',
    name: '李父',
    relation: '父亲',
    gender: 'male',
    age: 72,
    isDefault: false
  },
  {
    id: 'M003',
    name: '李母',
    relation: '母亲',
    gender: 'female',
    age: 68,
    isDefault: false
  }
]

/** 当前用户检查单 */
export const mockExamOrders: ExamOrder[] = [
  {
    id: 'E001',
    memberId: 'M001',
    examType: 'CT',
    examName: '腹部增强CT',
    bodyPart: '腹部',
    deviceType: 'CT',
    location: '影像科3楼 CT室',
    roomNo: 'CT-03',
    scheduledTime: '10:30',
    estimatedDuration: '30-45分钟',
    status: 'waiting',
    queueNumber: 24,
    queueAhead: 5,
    queueTotal: 32,
    estimatedWait: 20,
    barCode: 'HIS2026031500123',
    createdAt: '2026-03-15 09:12',
    contrastAgent: true
  },
  {
    id: 'E002',
    memberId: 'M002',
    examType: 'XRAY',
    examName: '胸部正侧位片',
    bodyPart: '胸部',
    deviceType: 'DR',
    location: '影像科2楼 DR室',
    roomNo: 'DR-01',
    scheduledTime: '14:00',
    estimatedDuration: '10-15分钟',
    status: 'completed',
    queueNumber: 8,
    queueAhead: 0,
    queueTotal: 8,
    estimatedWait: 0,
    barCode: 'HIS2026031400891',
    createdAt: '2026-03-14 13:30',
    contrastAgent: false
  }
]

/** 检查流程步骤（腹部增强CT） */
export const mockExamSteps: ExamStep[] = [
  {
    id: 'S1',
    title: '签到',
    desc: '到达检查室门口自助机或前台签到',
    status: 'done',
    icon: 'check-in'
  },
  {
    id: 'S2',
    title: '候诊',
    desc: '在候诊区等待叫号',
    status: 'current',
    icon: 'waiting'
  },
  {
    id: 'S3',
    title: '注射造影剂',
    desc: '护士为您建立静脉通道并注射造影剂',
    status: 'pending',
    icon: 'injection'
  },
  {
    id: 'S4',
    title: '扫描',
    desc: '平躺于检查床，保持静止完成扫描',
    status: 'pending',
    icon: 'scan'
  },
  {
    id: 'S5',
    title: '完成检查',
    desc: '拔针观察后离开',
    status: 'pending',
    icon: 'done'
  }
]

/** 检查前准备 */
export const mockPreExamItems: PreExamItem[] = [
  {
    id: 'P1',
    category: '饮食要求',
    icon: 'food',
    title: '检查前4小时禁食',
    desc: '增强CT需空腹，可少量饮水。检查前1周避免含碘造影剂检查。',
    mediaType: 'image',
    mediaUrl: '/static/images/pre-food.png'
  },
  {
    id: 'P2',
    category: '携带物品',
    icon: 'bag',
    title: '检查申请单 + 既往资料',
    desc: '请携带医生开具的检查申请单、既往影像资料和病历。',
    mediaType: 'animation'
  },
  {
    id: 'P3',
    category: '衣物要求',
    icon: 'clothes',
    title: '避免金属物品',
    desc: '去除检查部位的金属物品（项链、皮带、拉链等），建议穿着宽松衣物。',
    mediaType: 'video',
    mediaUrl: '/static/videos/pre-clothes.mp4'
  }
]

/** 禁忌症提醒 */
export const mockContraindications: Contraindication[] = [
  {
    id: 'C1',
    title: '造影剂过敏史',
    level: 'high',
    desc: '曾对碘造影剂过敏者，请务必提前告知医生，可能需要使用非离子型造影剂或抗过敏预处理。'
  },
  {
    id: 'C2',
    title: '严重肾功能异常',
    level: 'high',
    desc: 'eGFR < 30 或透析患者使用造影剂需谨慎，可能需水化或延期检查。'
  },
  {
    id: 'C3',
    title: '怀孕',
    level: 'high',
    desc: '妊娠期女性原则上避免CT等电离辐射检查，除非临床必需。'
  },
  {
    id: 'C4',
    title: '金属植入物',
    level: 'medium',
    desc: '心脏起搏器、金属支架、节育环等可能影响MRI检查，请提前告知。'
  }
]

/** 同检查室排队（隐私：不显示姓名） */
export const mockQueuePatients: QueuePatient[] = [
  { number: 19, status: 'done' },
  { number: 20, status: 'checking' },
  { number: 21, status: 'waiting' },
  { number: 22, status: 'waiting' },
  { number: 23, status: 'waiting' },
  { number: 24, status: 'waiting' },
  { number: 25, status: 'waiting' },
  { number: 26, status: 'waiting' }
]

/** 报告 */
export const mockReports: ExamReport[] = [
  {
    id: 'R001',
    examId: 'E002',
    examName: '胸部正侧位片',
    status: 'completed',
    summary:
      '双肺纹理清晰，未见明显实质性病变。心影大小正常，两侧膈面光滑，肋膈角锐利。',
    normalFindings: ['双肺野清晰', '心影正常', '膈面光滑'],
    conclusion: '胸部X线未见明显异常。',
    generatedAt: '2026-03-14 15:20',
    pickupLocation: '影像科2楼自助打印机',
    pickupTime: '即时可取',
    doctorName: '王医生',
    pacsUrl: 'https://pacs.example.com/report/R001'
  },
  {
    id: 'R002',
    examId: 'E003',
    examName: '头颅MRI',
    status: 'reviewing',
    summary: '影像已采集，放射科医师审核中。',
    pickupLocation: '影像科3楼报告室',
    pickupTime: '预计今日17:00前'
  }
]

/** 辐射安全信息 */
export const mockRadiationInfo: RadiationInfo[] = [
  {
    examType: 'XRAY',
    name: '胸片（X线）',
    dose: 0.05,
    doseText: '约 0.05 mSv',
    isNonIonizing: false,
    comparison: '≈ 自然环境中几天受到的辐射',
    equivalent: [
      '≈ 一次短途飞机旅行（2小时）',
      '≈ 日常生活自然辐射约 1 周',
      '相当于拍 100 次牙片的剂量'
    ],
    icon: 'xray',
    color: '#52C41A',
    safetyNote: '单次X线检查辐射剂量极低，属于医疗安全范围。'
  },
  {
    examType: 'CT',
    name: '胸部CT',
    dose: 6,
    doseText: '约 5-8 mSv',
    isNonIonizing: false,
    comparison: '约相当于自然环境约 2 年的辐射',
    equivalent: [
      '≈ 自然环境辐射约 2 年',
      '≈ 100-150 次胸片的剂量',
      '但仍远低于会造成确定效应的阈值'
    ],
    icon: 'ct',
    color: '#4A90E2',
    safetyNote: '医生会根据疾病需要评估检查必要性，获益远大于风险。'
  },
  {
    examType: 'CT',
    name: '腹部增强CT',
    dose: 9,
    doseText: '约 8-10 mSv',
    isNonIonizing: false,
    comparison: '约相当于自然环境约 3 年的辐射',
    equivalent: [
      '≈ 自然环境辐射约 3 年',
      '增强扫描增加约 1-2 mSv',
      '诊断价值远高于微小辐射风险'
    ],
    icon: 'ct',
    color: '#4A90E2',
    safetyNote: '增强CT对腹部病变诊断价值高，医生已权衡利弊。'
  },
  {
    examType: 'MRI',
    name: '磁共振MRI',
    dose: 0,
    doseText: '0 mSv',
    isNonIonizing: true,
    comparison: '不产生电离辐射',
    equivalent: [
      '利用磁场和射频成像',
      '对胎儿和儿童更安全',
      '无X线辐射风险'
    ],
    icon: 'mri',
    color: '#722ED1',
    safetyNote: 'MRI是利用磁场成像，完全没有电离辐射。'
  },
  {
    examType: 'ULTRASOUND',
    name: '超声检查',
    dose: 0,
    doseText: '0 mSv',
    isNonIonizing: true,
    comparison: '无电离辐射',
    equivalent: ['声波成像', '孕期也可安全使用', '无辐射风险'],
    icon: 'us',
    color: '#13C2C2',
    safetyNote: '超声检查利用声波，无任何电离辐射。'
  }
]

/** AI问答知识库（模拟） */
export const mockQAKnowledge: ExamQA[] = [
  {
    question: 'CT检查需要多久？',
    answer:
      '普通CT扫描本身只需几分钟，但包括准备、注射造影剂和观察，整个流程约需30-45分钟。实际扫描时间通常不超过10分钟。',
    category: 'process'
  },
  {
    question: '做MRI疼吗？',
    answer:
      'MRI检查本身无痛。您只需平躺保持不动，检查床会移动进入桶状磁体。密闭空间可能引起轻微不适，可要求佩戴耳塞，部分机器有音乐播放。',
    category: 'experience'
  },
  {
    question: '高血压可以做增强CT吗？',
    answer:
      '控制良好的高血压通常可以做增强CT。但血压过高（如>180/110mmHg）需先评估。请提前告知医生您的用药情况。',
    category: 'contraindication',
    warning: '我不能替代医生诊断，具体请遵医嘱。'
  },
  {
    question: '多久可以拿报告？',
    answer:
      '普通X线约30分钟，CT/MRI平扫约2-4小时，增强检查可能需要次日。急诊优先，具体以取报告凭条时间为准。',
    category: 'report'
  },
  {
    question: '增强CT后要注意什么？',
    answer:
      '检查后请多饮水（2000ml左右）促进造影剂排出，留观30分钟确认无过敏反应。如出现皮疹、呼吸困难立即告知医务人员。',
    category: 'process'
  }
]

/** 排队通知 */
export const mockNotifications: QueueNotification[] = [
  {
    id: 'N001',
    type: 'emergency',
    title: '排队序号调整',
    content:
      '因急诊患者优先检查，您的排队序号由24调整为27，预计等待时间增加15分钟，请耐心等待。',
    timestamp: Date.now() - 300000,
    read: false
  },
  {
    id: 'N002',
    type: 'near',
    title: '即将到号提醒',
    content: '您前方仅剩3人，请前往CT-03检查室候诊。',
    timestamp: Date.now() - 1800000,
    read: true
  }
]
