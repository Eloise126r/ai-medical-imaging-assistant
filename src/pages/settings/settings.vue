<template>
  <view class="settings-page" :class="{ 'elder-mode': elderMode }">
    <NavBar title="个人中心" />

    <view class="settings-body">
      <!-- 用户信息 -->
      <view class="user-card">
        <UserAvatar :src="userInfo.avatar" :name="userInfo.nickname" :size="112" />
        <view class="user-meta">
          <text class="user-name">{{ userInfo.nickname }}</text>
          <text class="user-phone">{{ maskedPhone }}</text>
        </view>
        <view class="user-badge" v-if="elderMode">👴 长辈模式</view>
      </view>

      <!-- 长辈模式（核心适老化） -->
      <view class="elder-banner" :class="{ on: elderMode }">
        <view class="eb-left">
          <text class="eb-icon">👴</text>
          <view class="eb-text">
            <text class="eb-title">长辈模式</text>
            <text class="eb-desc">字体放大 · 按钮放大 · 语音辅助</text>
          </view>
        </view>
        <view class="elder-switch" :class="{ on: elderMode }" @tap="toggleElder">
          <view class="switch-dot"></view>
        </view>
      </view>

      <view class="elder-demo" v-if="elderMode">
        <text class="demo-text">这是长辈模式下的放大文字效果，便于阅读</text>
        <button class="btn btn-primary btn-lg btn-block">大按钮便于点击</button>
      </view>

      <!-- 家庭成员代绑 -->
      <view class="block card">
        <view class="card-header">
          <text class="title">👨‍👩‍👧 家庭成员</text>
          <text class="more" @tap="showAddPopup">+ 添加</text>
        </view>

        <view
          class="member-row"
          v-for="m in familyMembers"
          :key="m.id"
          :class="{ active: m.id === currentMemberId }"
          @tap="switchMember(m.id)"
        >
          <view class="member-avatar">{{ m.name[0] }}</view>
          <view class="member-info">
            <text class="member-name">{{ m.name }}</text>
            <text class="member-desc">{{ m.relation }} · {{ m.age }}岁</text>
          </view>
          <view class="member-tag" v-if="m.id === currentMemberId">查看中</view>
          <view class="member-tag ghost" v-else>切换查看</view>
        </view>
      </view>

      <!-- 设置项 -->
      <view class="block card">
        <view class="set-item" @tap="toggleVoice">
          <text class="set-icon">🔊</text>
          <text class="set-label">语音提示</text>
          <view class="set-switch" :class="{ on: voiceOn }"></view>
        </view>
        <view class="set-item" @tap="goRadiation">
          <text class="set-icon">☢️</text>
          <text class="set-label">辐射安全教育</text>
          <text class="set-arrow">›</text>
        </view>
        <view class="set-item" @tap="goChat">
          <text class="set-icon">🤖</text>
          <text class="set-label">AI智能问答</text>
          <text class="set-arrow">›</text>
        </view>
        <view class="set-item" @tap="about">
          <text class="set-icon">ℹ️</text>
          <text class="set-label">关于我们</text>
          <text class="set-arrow">›</text>
        </view>
        <view class="set-item" @tap="privacy">
          <text class="set-icon">🔒</text>
          <text class="set-label">隐私政策</text>
          <text class="set-arrow">›</text>
        </view>
      </view>

      <button class="btn btn-danger btn-block btn-lg" @tap="logout">
        退出登录
      </button>

      <text class="version-text">AI医学影像检查助手 v1.0.0</text>
    </view>

    <!-- 添加成员弹窗 -->
    <view class="popup-mask" v-if="showAddMemberPopup" @tap="closeAddPopup">
      <view class="popup-wrap" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">添加家庭成员</text>
          <text class="popup-close" @tap="closeAddPopup">×</text>
        </view>
        <view class="form-item">
          <text class="form-label">姓名</text>
          <input class="form-input" v-model="newMember.name" placeholder="请输入姓名" />
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
import NavBar from '@/components/NavBar.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { maskPhone, toast } from '@/utils'
import { goRadiation, goChat, goLogin } from '@/utils/nav'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const elderMode = computed(() => userStore.isElderMode)
const familyMembers = computed(() => userStore.familyMembers)
const currentMemberId = computed(() => userStore.currentMemberId)

const maskedPhone = computed(() => maskPhone(userInfo.value.phone))
const voiceOn = ref(true)

const showAddMemberPopup = ref(false)
const relations = ['父亲', '母亲', '配偶', '子女', '其他']
const newMember = ref({
  name: '',
  relation: '父亲',
  gender: 'male' as 'male' | 'female',
  age: 60
})

function toggleElder() {
  userStore.toggleElderMode()
  if (userStore.isElderMode) {
    toast('已开启长辈模式', 'success')
    // 语音播报（预留）
    if (voiceOn.value) {
      // TODO: uni.createInnerAudioContext().play()
    }
  }
}

function toggleVoice() {
  voiceOn.value = !voiceOn.value
}

function switchMember(id: string) {
  userStore.switchMember(id)
  toast('已切换', 'none')
}

function showAddPopup() {
  showAddMemberPopup.value = true
}

function closeAddPopup() {
  showAddMemberPopup.value = false
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
  closeAddPopup()
  toast('添加成功', 'success')
  newMember.value.name = ''
}

function goRadiation() {
  uni.navigateTo({ url: '/pages/radiation/radiation' })
}

function about() {
  uni.showModal({
    title: '关于',
    content: 'AI医学影像检查全流程助手\n版本 1.0.0\n为患者提供影像检查全流程智能服务',
    showCancel: false
  })
}

function privacy() {
  uni.showModal({
    title: '隐私政策',
    content: '我们严格保护您的个人隐私，检查数据仅用于为您提供就诊服务，不会用于其他用途。',
    showCancel: false
  })
}

function logout() {
  uni.showModal({
    title: '确认退出',
    content: '退出后需重新登录',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        goLogin()
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.settings-page {
  min-height: 100vh;
  background: $bg-color;
}

.settings-body {
  padding: calc(100rpx + 44rpx + 24rpx) 32rpx 60rpx;
}

.user-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .user-avatar {
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    background: #f0f2f5;
  }

  .user-meta {
    flex: 1;
    margin-left: 24rpx;
    display: flex;
    flex-direction: column;

    .user-name {
      font-size: 36rpx;
      font-weight: 700;
      color: #303133;
    }

    .user-phone {
      font-size: 24rpx;
      color: #909399;
      margin-top: 8rpx;
    }
  }

  .user-badge {
    font-size: 22rpx;
    color: #4a90e2;
    background: #e6f7ff;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
  }
}

.elder-banner {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  &.on {
    background: linear-gradient(135deg, #e6f7ff, #f0f9ff);
  }

  .eb-left {
    display: flex;
    align-items: center;
  }

  .eb-icon {
    font-size: 56rpx;
    margin-right: 20rpx;
  }

  .eb-text {
    display: flex;
    flex-direction: column;
  }

  .eb-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #303133;
  }

  .eb-desc {
    font-size: 24rpx;
    color: #909399;
    margin-top: 6rpx;
  }
}

.elder-switch {
  width: 96rpx;
  height: 56rpx;
  border-radius: 28rpx;
  background: #e8edf3;
  position: relative;
  transition: background 0.3s;

  &.on {
    background: #4a90e2;
  }

  .switch-dot {
    position: absolute;
    top: 6rpx;
    left: 6rpx;
    width: 44rpx;
    height: 44rpx;
    border-radius: 50%;
    background: #fff;
    transition: left 0.3s;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
  }

  &.on .switch-dot {
    left: 46rpx;
  }
}

.elder-demo {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;

  .demo-text {
    font-size: 36rpx;
    color: #303133;
    font-weight: 600;
    display: block;
    margin-bottom: 24rpx;
    text-align: center;
  }
}

.block {
  margin-bottom: 24rpx;
}

.member-row {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f2f5;

  &:last-child {
    border-bottom: none;
  }

  &.active {
    background: #e6f7ff;
    border-radius: 16rpx;
    margin: 8rpx -24rpx;
    padding: 24rpx;
  }

  .member-avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #4a90e2, #6ba3e8);
    color: #fff;
    font-size: 32rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
  }

  .member-info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .member-name {
      font-size: 28rpx;
      font-weight: 600;
      color: #303133;
    }

    .member-desc {
      font-size: 22rpx;
      color: #909399;
      margin-top: 4rpx;
    }
  }

  .member-tag {
    font-size: 22rpx;
    color: #fff;
    background: #4a90e2;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;

    &.ghost {
      background: #f5f7fa;
      color: #909399;
    }
  }
}

.set-item {
  display: flex;
  align-items: center;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f0f2f5;

  &:last-child {
    border-bottom: none;
  }

  .set-icon {
    font-size: 40rpx;
    margin-right: 20rpx;
  }

  .set-label {
    flex: 1;
    font-size: 28rpx;
    color: #303133;
  }

  .set-arrow {
    font-size: 40rpx;
    color: #c0c4cc;
  }

  .set-switch {
    width: 80rpx;
    height: 48rpx;
    border-radius: 24rpx;
    background: #e8edf3;
    position: relative;

    &.on {
      background: #52c41a;
    }

    &::after {
      content: '';
      position: absolute;
      top: 6rpx;
      left: 6rpx;
      width: 36rpx;
      height: 36rpx;
      border-radius: 50%;
      background: #fff;
      transition: left 0.3s;
    }

    &.on::after {
      left: 38rpx;
    }
  }
}

.version-text {
  font-size: 22rpx;
  color: #c0c4cc;
  text-align: center;
  display: block;
  margin-top: 40rpx;
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
