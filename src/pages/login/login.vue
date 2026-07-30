<template>
  <view class="login-page" :class="{ 'elder-mode': elderMode }">
    <view class="login-bg">
      <view class="bg-circle c1"></view>
      <view class="bg-circle c2"></view>
    </view>

    <view class="login-content">
      <!-- Logo -->
      <view class="logo-wrap">
        <view class="logo">
          <text class="logo-emoji">🏥</text>
        </view>
        <text class="app-name">AI医学影像检查助手</text>
        <text class="app-slogan">您的影像检查全流程智能伙伴</text>
      </view>

      <!-- 微信登录 -->
      <view class="login-card" v-if="!loggedIn">
        <button class="btn btn-primary btn-lg btn-block wechat-btn" @tap="wxLogin">
          <text class="wechat-icon">💬</text>
          微信一键登录
        </button>
        <text class="login-tip"
          >登录即表示同意《用户协议》和《隐私政策》</text
        >

        <view class="divider">
          <text>或</text>
        </view>

        <button class="btn btn-outline btn-block" @tap="goScan">
          📷 扫描检查单二维码
        </button>
      </view>

      <!-- 已登录 - 绑定/家庭 -->
      <view class="bind-card" v-else>
        <view class="welcome">
          <text class="welcome-text">您好，{{ userInfo.nickname }}</text>
        </view>

        <!-- 绑定检查单 -->
        <view class="section">
          <view class="section-title">
            <text>📋 检查单绑定</text>
          </view>
          <button class="btn btn-primary btn-block scan-btn" @tap="goScan">
            📷 扫描检查单二维码绑定
          </button>
          <view class="bind-list" v-if="examOrders.length">
            <view
              class="bind-item"
              v-for="exam in examOrders"
              :key="exam.id"
              @tap="goDetail(exam.id)"
            >
              <view class="bind-item-left">
                <text class="bind-name">{{ exam.examName }}</text>
                <text class="bind-time">{{ exam.scheduledTime }} {{ exam.location }}</text>
              </view>
              <text class="bind-arrow">›</text>
            </view>
          </view>
        </view>

        <!-- 家庭成员 -->
        <view class="section">
          <view class="section-title flex-between">
            <text>👨‍👩‍👧 家庭成员</text>
            <text class="add-btn" @tap="showAddMember">+ 添加</text>
          </view>

          <view class="member-list">
            <view
              class="member-chip"
              v-for="m in familyMembers"
              :key="m.id"
              :class="{ active: m.id === currentMemberId }"
              @tap="switchMember(m.id)"
            >
              <text class="member-name">{{ m.name }}</text>
              <text class="member-rel">{{ m.relation }}</text>
            </view>
          </view>

          <view class="switch-hint" v-if="currentMemberId !== userInfo.id">
            <text>当前查看：{{ currentMemberName }} 的检查</text>
          </view>
        </view>

        <button class="btn btn-ghost btn-block mt-lg" @tap="enterApp">
          进入小程序 →
        </button>
      </view>
    </view>

    <!-- 添加成员弹窗（自定义） -->
    <view class="popup-mask" v-if="showPopup" @tap="closeMemberPopup">
      <view class="popup-wrap" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">添加家庭成员</text>
          <text class="popup-close" @tap="closeMemberPopup">×</text>
        </view>
        <view class="form-item">
          <text class="form-label">姓名</text>
          <input
            class="form-input"
            v-model="newMember.name"
            placeholder="请输入姓名"
          />
        </view>
        <view class="form-item">
          <text class="form-label">关系</text>
          <view class="relation-group">
            <text
              class="relation-opt"
              v-for="r in relations"
              :key="r"
              :class="{ active: newMember.relation === r }"
              @tap="newMember.relation = r"
              >{{ r }}</text
            >
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">性别</text>
          <view class="relation-group">
            <text
              class="relation-opt"
              :class="{ active: newMember.gender === 'male' }"
              @tap="newMember.gender = 'male'"
              >男</text
            >
            <text
              class="relation-opt"
              :class="{ active: newMember.gender === 'female' }"
              @tap="newMember.gender = 'female'"
              >女</text
            >
          </view>
        </view>
        <view class="form-item">
          <text class="form-label">年龄</text>
          <input
            class="form-input"
            v-model="newMember.age"
            type="number"
            placeholder="请输入年龄"
          />
        </view>
        <button class="btn btn-primary btn-block btn-lg" @tap="addMember">
          确认添加
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { goScanBind, toast } from '@/utils/nav'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const loggedIn = computed(() => userStore.isLogin)
const familyMembers = computed(() => userStore.familyMembers)
const examOrders = computed(() => userStore.examOrders)
const currentMemberId = computed(() => userStore.currentMemberId)
const elderMode = computed(() => userStore.isElderMode)

const currentMemberName = computed(
  () => familyMembers.value.find((m) => m.id === currentMemberId.value)?.name || ''
)

const showPopup = ref(false)
const relations = ['父亲', '母亲', '配偶', '子女', '其他']

const newMember = ref({
  name: '',
  relation: '父亲',
  gender: 'male' as 'male' | 'female',
  age: 60
})

function wxLogin() {
  userStore.login().then(() => {
    toast('登录成功', 'success')
  })
}

function goScan() {
  goScanBind()
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}

function showAddMember() {
  showPopup.value = true
}

function closeMemberPopup() {
  showPopup.value = false
}

function addMember() {
  if (!newMember.value.name) {
    toast('请输入姓名')
    return
  }
  const member = {
    ...newMember.value,
    id: 'M' + Date.now(),
    isDefault: false
  }
  familyMembers.value.push(member as any)
  uni.setStorageSync('familyMembers', familyMembers.value)
  closeMemberPopup()
  toast('添加成功', 'success')
  newMember.value.name = ''
}

function switchMember(id: string) {
  userStore.switchMember(id)
  toast('已切换', 'none')
}

function enterApp() {
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.login-page {
  min-height: 100vh;
  background: $bg-color;
  position: relative;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 500rpx;
  background: linear-gradient(135deg, #4a90e2, #6ba3e8);
  overflow: hidden;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);

  &.c1 {
    width: 300rpx;
    height: 300rpx;
    top: -100rpx;
    right: -80rpx;
  }

  &.c2 {
    width: 200rpx;
    height: 200rpx;
    bottom: -60rpx;
    left: -50rpx;
  }
}

.login-content {
  position: relative;
  padding: 120rpx 48rpx 60rpx;
}

.logo-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.logo {
  width: 140rpx;
  height: 140rpx;
  background: #fff;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);

  .logo-emoji { font-size: 80rpx; }
}

.app-name {
  font-size: 42rpx;
  font-weight: 700;
  color: #fff;
  margin-top: 28rpx;
}

.app-slogan {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 12rpx;
}

.login-card,
.bind-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.wechat-btn {
  background: linear-gradient(135deg, #07c160, #10ad57);
  gap: 12rpx;
}

.wechat-icon {
  font-size: 36rpx;
}

.login-tip {
  font-size: 22rpx;
  color: #c0c4cc;
  text-align: center;
  display: block;
  margin-top: 24rpx;
}

.divider {
  display: flex;
  align-items: center;
  margin: 32rpx 0;
  color: #c0c4cc;
  font-size: 24rpx;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1rpx;
    background: #f0f2f5;
  }

  text { padding: 0 24rpx; }
}

.welcome {
  margin-bottom: 32rpx;
}

.welcome-text {
  font-size: 36rpx;
  font-weight: 700;
  color: #303133;
}

.section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
}

.add-btn {
  font-size: 26rpx;
  color: #4a90e2;
  font-weight: normal;
}

.scan-btn {
  margin-bottom: 24rpx;
}

.bind-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.bind-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background: #f8fafc;
  border-radius: 16rpx;

  .bind-item-left {
    display: flex;
    flex-direction: column;
  }

  .bind-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #303133;
  }

  .bind-time {
    font-size: 22rpx;
    color: #909399;
    margin-top: 6rpx;
  }

  .bind-arrow {
    font-size: 40rpx;
    color: #c0c4cc;
  }
}

.member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.member-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 28rpx;
  background: #f8fafc;
  border-radius: 20rpx;
  border: 2rpx solid transparent;

  &.active {
    background: #e6f7ff;
    border-color: #4a90e2;
  }

  .member-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #303133;
  }

  .member-rel {
    font-size: 20rpx;
    color: #909399;
    margin-top: 4rpx;
  }
}

.switch-hint {
  font-size: 24rpx;
  color: #4a90e2;
  margin-top: 16rpx;
  background: #e6f7ff;
  padding: 16rpx;
  border-radius: 12rpx;
}

.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.popup-wrap {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx;
  box-sizing: border-box;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;

  .popup-title {
    font-size: 34rpx;
    font-weight: 700;
    color: #303133;
  }

  .popup-close {
    font-size: 48rpx;
    color: #c0c4cc;
    line-height: 1;
  }
}

.form-item {
  margin-bottom: 28rpx;
}

.form-label {
  font-size: 26rpx;
  color: #606266;
  display: block;
  margin-bottom: 12rpx;
}

.form-input {
  height: 80rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.relation-group {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.relation-opt {
  padding: 12rpx 32rpx;
  background: #f8fafc;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: #606266;

  &.active {
    background: #4a90e2;
    color: #fff;
  }
}
</style>
