<template>
  <view class="radiation-page" :class="{ 'elder-mode': elderMode }">
    <NavBar title="我的检查安全吗？" />

    <view class="radiation-body">
      <!-- 顶部说明 -->
      <view class="hero-card">
        <view class="hero-icon">☢️→💚</view>
        <text class="hero-title">医学影像辐射健康教育</text>
        <text class="hero-desc"
          >我们用通俗的方式告诉您每次检查的辐射量，让您安心就诊</text
        >
      </view>

      <!-- 我的检查辐射 -->
      <view class="section-title">
        <text>📋 我的检查辐射量</text>
      </view>
      <view v-if="myExams.length">
        <DoseCard
          v-for="exam in myExams"
          :key="exam.id"
          :info="getRadiationInfo(exam.examType)"
        />
      </view>
      <view v-else class="empty-mini">暂无进行中的检查</view>

      <!-- 全部检查类型 -->
      <view class="section-title">
        <text>🔍 各类检查辐射对比</text>
      </view>

      <!-- 对比可视化条 -->
      <view class="compare-card card">
        <view
          class="compare-row"
          v-for="info in allInfo"
          :key="info.name"
        >
          <view class="compare-head">
            <text class="compare-name">{{ info.name }}</text>
            <text
              class="compare-dose"
              :style="{ color: info.color }"
              >{{ info.doseText }}</text
            >
          </view>
          <view class="compare-bar-bg">
            <view
              class="compare-bar-fill"
              :style="{ width: getRatio(info.dose) * 100 + '%', background: info.color }"
            ></view>
          </view>
          <text class="compare-equ" v-if="!info.isNonIonizing">{{
            info.equivalent[0]
          }}</text>
          <text class="compare-equ safe" v-else>{{ info.comparison }}</text>
        </view>

        <view class="natural-dose">
          🌿 自然本底辐射：每人每年约 2-3 mSv（来自宇宙射线、土壤等）
        </view>
      </view>

      <!-- 详细卡片 -->
      <view class="section-title">
        <text>📖 详细解释</text>
      </view>
      <DoseCard
        v-for="info in allInfo"
        :key="'d-' + info.name"
        :info="info"
      />

      <!-- 安全理念 -->
      <view class="safety-principle card">
        <text class="sp-title">💡 辐射安全三原则</text>
        <view class="sp-item">
          <text class="sp-num">1</text>
          <view class="sp-text">
            <text class="sp-h">正当性</text>
            <text class="sp-d">医生会根据病情需要评估检查的必要性</text>
          </view>
        </view>
        <view class="sp-item">
          <text class="sp-num">2</text>
          <view class="sp-text">
            <text class="sp-h">最优化</text>
            <text class="sp-d">采用最低剂量达到诊断目的（ALARA原则）</text>
          </view>
        </view>
        <view class="sp-item">
          <text class="sp-num">3</text>
          <view class="sp-text">
            <text class="sp-h">剂量限值</text>
            <text class="sp-d">医疗照射远低于造成确定损害的剂量阈值</text>
          </view>
        </view>
      </view>

      <!-- 安抚提示 -->
      <view class="reassure-banner">
        <text class="rb-icon">🤝</text>
        <text class="rb-text"
          >请放心，所有影像检查的辐射剂量都经过严格安全评估。医生会在获益与风险之间做出最优选择。</text
        >
      </view>

      <!-- AI咨询入口 -->
      <button class="btn btn-primary btn-block btn-lg" @tap="askAI">
        🤖 还有疑问？问问AI助手
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user'
import NavBar from '@/components/NavBar.vue'
import DoseCard from '@/components/DoseCard.vue'
import { mockRadiationInfo } from '@/api/mockData'
import { getDoseRatio } from '@/utils'
import type { ExamType, RadiationInfo } from '@/types'

const userStore = useUserStore()
const elderMode = computed(() => userStore.isElderMode)

const allInfo = ref(mockRadiationInfo)

const myExams = computed(() => userStore.myExams.filter((e) => e.status !== 'cancelled'))

function getRadiationInfo(type: ExamType): RadiationInfo {
  const matched = allInfo.value.find((i) => i.examType === type)
  if (matched) return matched
  // 同类型可能有多条，取第一条
  const byType = allInfo.value.find((i) => i.examType === type)
  return byType || allInfo.value[0]
}

const getRatio = (dose: number) => getDoseRatio(dose)

function askAI() {
  uni.switchTab({ url: '/pages/chat/chat' })
  setTimeout(() => {
    // 触发快捷问题（可选）
  }, 300)
}

onLoad(() => {
  getDoseRatio(0)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.radiation-page {
  min-height: 100vh;
  background: $bg-color;
}

.radiation-body {
  padding: calc(100rpx + 44rpx + 24rpx) 32rpx 60rpx;
}

.hero-card {
  background: linear-gradient(135deg, #4a90e2, #6ba3e8);
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(74, 144, 226, 0.25);

  .hero-icon {
    font-size: 56rpx;
    margin-bottom: 16rpx;
  }

  .hero-title {
    font-size: 34rpx;
    font-weight: 700;
    color: #fff;
  }

  .hero-desc {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    margin-top: 12rpx;
    line-height: 1.6;
  }
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #303133;
  margin: 32rpx 0 20rpx;
  padding-left: 8rpx;
  border-left: 8rpx solid #4a90e2;
}

.empty-mini {
  font-size: 24rpx;
  color: #c0c4cc;
  text-align: center;
  padding: 40rpx;
  background: #fff;
  border-radius: 16rpx;
}

.compare-card {
  .compare-row {
    margin-bottom: 28rpx;

    &:last-child { margin-bottom: 20rpx; }
  }

  .compare-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;

    .compare-name {
      font-size: 26rpx;
      font-weight: 600;
      color: #303133;
    }

    .compare-dose {
      font-size: 24rpx;
      font-weight: 700;
    }
  }

  .compare-bar-bg {
    height: 16rpx;
    background: #f0f2f5;
    border-radius: 8rpx;
    overflow: hidden;
  }

  .compare-bar-fill {
    height: 100%;
    border-radius: 8rpx;
    transition: width 0.6s ease;
  }

  .compare-equ {
    font-size: 22rpx;
    color: #909399;
    display: block;
    margin-top: 8rpx;

    &.safe { color: #52c41a; font-weight: 600; }
  }

  .natural-dose {
    margin-top: 16rpx;
    padding: 20rpx;
    background: #f6ffed;
    border-radius: 16rpx;
    font-size: 24rpx;
    color: #52c41a;
    line-height: 1.6;
    text-align: center;
  }
}

.safety-principle {
  .sp-title {
    font-size: 30rpx;
    font-weight: 700;
    color: #303133;
    display: block;
    margin-bottom: 24rpx;
  }

  .sp-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24rpx;

    &:last-child { margin-bottom: 0; }
  }

  .sp-num {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    background: #4a90e2;
    color: #fff;
    font-size: 26rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    flex-shrink: 0;
  }

  .sp-text {
    flex: 1;
    display: flex;
    flex-direction: column;

    .sp-h {
      font-size: 28rpx;
      font-weight: 600;
      color: #303133;
    }

    .sp-d {
      font-size: 24rpx;
      color: #606266;
      line-height: 1.6;
      margin-top: 4rpx;
    }
  }
}

.reassure-banner {
  display: flex;
  align-items: flex-start;
  background: #fff7e6;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 32rpx 0;

  .rb-icon { font-size: 36rpx; margin-right: 16rpx; }

  .rb-text {
    flex: 1;
    font-size: 26rpx;
    color: #d48806;
    line-height: 1.7;
  }
}
</style>
