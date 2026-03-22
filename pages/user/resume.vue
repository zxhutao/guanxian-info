<template>
  <view class="resume-page">
    <!-- 头像区域 -->
    <view class="avatar-section">
      <image
        class="avatar-img"
        :src="resume.avatar || '/static/images/default-avatar.png'"
        mode="aspectFill"
        @click="changeAvatar"
      />
      <view class="avatar-tip">点击更换头像</view>
    </view>

    <!-- 基本信息 -->
    <view class="section-card">
      <view class="section-title">
        <u-icon name="account" size="32rpx" color="#E63946" />
        <text>基本信息</text>
      </view>
      <view class="form-list">
        <view class="form-item" @click="editField('name')">
          <text class="form-label">姓名</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.name }">{{ resume.name || '请填写' }}</text>
            <u-icon name="arrow-right" size="24rpx" color="#ccc" />
          </view>
        </view>
        <view class="form-item" @click="editField('gender')">
          <text class="form-label">性别</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.gender }">{{ resume.gender || '请选择' }}</text>
            <u-icon name="arrow-right" size="24rpx" color="#ccc" />
          </view>
        </view>
        <view class="form-item" @click="editField('age')">
          <text class="form-label">年龄</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.age }">{{ resume.age ? resume.age + '岁' : '请填写' }}</text>
            <u-icon name="arrow-right" size="24rpx" color="#ccc" />
          </view>
        </view>
        <view class="form-item" @click="editField('phone')">
          <text class="form-label">联系电话</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.phone }">{{ resume.phone || '请填写' }}</text>
            <u-icon name="arrow-right" size="24rpx" color="#ccc" />
          </view>
        </view>
        <view class="form-item" @click="editField('education')">
          <text class="form-label">学历</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.education }">{{ resume.education || '请选择' }}</text>
            <u-icon name="arrow-right" size="24rpx" color="#ccc" />
          </view>
        </view>
      </view>
    </view>

    <!-- 求职意向 -->
    <view class="section-card">
      <view class="section-title">
        <u-icon name="briefcase" size="32rpx" color="#E63946" />
        <text>求职意向</text>
      </view>
      <view class="form-list">
        <view class="form-item" @click="editField('expectedJob')">
          <text class="form-label">期望职位</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.expectedJob }">{{ resume.expectedJob || '请填写' }}</text>
            <u-icon name="arrow-right" size="24rpx" color="#ccc" />
          </view>
        </view>
        <view class="form-item" @click="editField('expectedSalary')">
          <text class="form-label">期望薪资</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.expectedSalary }">{{ resume.expectedSalary || '请选择' }}</text>
            <u-icon name="arrow-right" size="24rpx" color="#ccc" />
          </view>
        </view>
        <view class="form-item" @click="editField('workArea')">
          <text class="form-label">工作区域</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.workArea }">{{ resume.workArea || '请选择' }}</text>
            <u-icon name="arrow-right" size="24rpx" color="#ccc" />
          </view>
        </view>
        <view class="form-item" @click="editField('jobType')">
          <text class="form-label">工作类型</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.jobType }">{{ resume.jobType || '请选择' }}</text>
            <u-icon name="arrow-right" size="24rpx" color="#ccc" />
          </view>
        </view>
      </view>
    </view>

    <!-- 工作经历 -->
    <view class="section-card">
      <view class="section-title">
        <u-icon name="file-text" size="32rpx" color="#E63946" />
        <text>工作经历</text>
        <view class="add-btn" @click="addExperience('work')">
          <u-icon name="plus-circle" size="32rpx" color="#E63946" />
          <text>添加</text>
        </view>
      </view>
      <view v-if="resume.workExperience.length === 0" class="empty-tip">
        暂无工作经历，点击上方添加
      </view>
      <view v-for="(exp, index) in resume.workExperience" :key="index" class="exp-card">
        <view class="exp-header">
          <view class="exp-company">{{ exp.company }}</view>
          <u-icon name="close" size="28rpx" color="#999" @click="removeExperience('work', index)" />
        </view>
        <view class="exp-row">
          <text class="exp-label">职位：</text>
          <text class="exp-text">{{ exp.position }}</text>
        </view>
        <view class="exp-row">
          <text class="exp-label">时间：</text>
          <text class="exp-text">{{ exp.startTime }} - {{ exp.endTime }}</text>
        </view>
        <view class="exp-row" v-if="exp.desc">
          <text class="exp-label">描述：</text>
          <text class="exp-text">{{ exp.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 自我介绍 -->
    <view class="section-card">
      <view class="section-title">
        <u-icon name="edit-pen" size="32rpx" color="#E63946" />
        <text>自我介绍</text>
      </view>
      <view class="intro-area" @click="editIntro">
        <text v-if="resume.intro" class="intro-text">{{ resume.intro }}</text>
        <text v-else class="placeholder">请填写自我介绍，让企业更了解你...</text>
        <u-icon name="arrow-right" size="24rpx" color="#ccc" />
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <u-button type="primary" size="large" @click="saveResume" :loading="saving">
        保存简历
      </u-button>
    </view>
    <view style="height: 140rpx;" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { showConfirm } from '@/utils/index'

const resume = ref({
  avatar: '',
  name: '',
  gender: '',
  age: '',
  phone: '',
  education: '',
  expectedJob: '',
  expectedSalary: '',
  workArea: '',
  jobType: '',
  workExperience: [],
  intro: ''
})
const saving = ref(false)

// 加载本地保存的简历
onShow(() => {
  const saved = uni.getStorageSync('myResume')
  if (saved) {
    resume.value = { ...resume.value, ...saved }
  }
})

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    success: (res) => {
      resume.value.avatar = res.tempFilePaths[0]
    }
  })
}

const editField = (field) => {
  const config = {
    gender: {
      title: '选择性别',
      options: ['男', '女'],
      type: 'select'
    },
    education: {
      title: '选择学历',
      options: ['初中及以下', '高中/中专', '大专', '本科', '硕士及以上'],
      type: 'select'
    },
    expectedSalary: {
      title: '选择期望薪资',
      options: ['3000以下', '3000-5000元', '5000-8000元', '8000-10000元', '10000-15000元', '15000元以上'],
      type: 'select'
    },
    workArea: {
      title: '选择工作区域',
      options: ['冠县城区', '冠县开发区', '冠县工业园区', '乡镇均可', '不限'],
      type: 'select'
    },
    jobType: {
      title: '选择工作类型',
      options: ['全职', '兼职', '临时工', '学徒', '不限'],
      type: 'select'
    }
  }

  const fieldConfig = config[field]

  if (fieldConfig && fieldConfig.type === 'select') {
    uni.showActionSheet({
      itemList: fieldConfig.options,
      success: (res) => {
        resume.value[field] = fieldConfig.options[res.tapIndex]
      }
    })
  } else {
    // 文本输入
    const titleMap = {
      name: '姓名',
      age: '年龄',
      phone: '联系电话',
      expectedJob: '期望职位'
    }
    const isNumber = field === 'age' || field === 'phone'
    const placeholderMap = {
      name: '请输入姓名',
      age: '请输入年龄',
      phone: '请输入手机号',
      expectedJob: '请输入期望职位，如：普工、质检员'
    }

    uni.showModal({
      title: titleMap[field] || '请输入',
      editable: true,
      placeholderText: placeholderMap[field] || '请输入',
      success: (res) => {
        if (res.confirm && res.content) {
          resume.value[field] = isNumber ? Number(res.content) : res.content.trim()
        }
      }
    })
  }
}

const editIntro = () => {
  // 使用简易输入方式
  uni.showModal({
    title: '自我介绍',
    editable: true,
    placeholderText: resume.value.intro || '请输入自我介绍...',
    success: (res) => {
      if (res.confirm && res.content) {
        resume.value.intro = res.content.trim()
      }
    }
  })
}

const addExperience = (type) => {
  // 简化版：通过弹窗快速添加
  uni.showModal({
    title: '添加工作经历',
    editable: true,
    placeholderText: '格式：公司名称|职位|开始时间-结束时间\n例：XX玻璃厂|普工|2024.01-2026.03',
    success: (res) => {
      if (res.confirm && res.content) {
        const parts = res.content.split('|')
        if (parts.length >= 2) {
          const company = parts[0].trim()
          const position = parts[1].trim()
          const timeRange = (parts[2] || '').trim().split('-')
          resume.value.workExperience.push({
            company,
            position,
            startTime: (timeRange[0] || '').trim(),
            endTime: (timeRange[1] || '').trim(),
            desc: (parts[3] || '').trim()
          })
        } else {
          uni.showToast({ title: '格式不正确，请用|分隔', icon: 'none' })
        }
      }
    }
  })
}

const removeExperience = async (type, index) => {
  const confirmed = await showConfirm('删除确认', '确定删除这条工作经历吗？')
  if (confirmed) {
    resume.value.workExperience.splice(index, 1)
  }
}

const saveResume = async () => {
  if (!resume.value.name) {
    uni.showToast({ title: '请填写姓名', icon: 'none' })
    return
  }
  if (!resume.value.phone) {
    uni.showToast({ title: '请填写联系电话', icon: 'none' })
    return
  }

  saving.value = true
  try {
    // 模拟保存（实际应上传到云数据库）
    uni.setStorageSync('myResume', resume.value)
    await new Promise(resolve => setTimeout(resolve, 800))
    uni.showToast({ title: '保存成功', icon: 'success' })
  } catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.resume-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 30rpx;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0 30rpx;
  background: #fff;

  .avatar-img {
    width: 140rpx;
    height: 140rpx;
    border-radius: 70rpx;
    background: #eee;
    border: 4rpx solid #f5f5f5;
  }

  .avatar-tip {
    font-size: 24rpx;
    color: #E63946;
    margin-top: 12rpx;
  }
}

.section-card {
  background: #fff;
  padding: 0 30rpx 30rpx;
  margin: 20rpx 0;

  .section-title {
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 30rpx 0 20rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    border-bottom: 1rpx solid #f5f5f5;
    margin-bottom: 10rpx;

    .add-btn {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 6rpx;
      font-size: 26rpx;
      color: #E63946;
      font-weight: normal;
    }
  }
}

.form-list {
  .form-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f8f8f8;

    &:last-child {
      border-bottom: none;
    }

    .form-label {
      font-size: 28rpx;
      color: #333;
      flex-shrink: 0;
    }

    .form-value {
      display: flex;
      align-items: center;
      gap: 10rpx;
      font-size: 28rpx;
      color: #333;

      .placeholder {
        color: #ccc;
      }
    }
  }
}

.empty-tip {
  text-align: center;
  font-size: 26rpx;
  color: #999;
  padding: 30rpx 0;
}

.exp-card {
  background: #F9F9F9;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;

  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;

    .exp-company {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
    }
  }

  .exp-row {
    display: flex;
    font-size: 26rpx;
    line-height: 1.8;

    .exp-label {
      color: #999;
      flex-shrink: 0;
    }

    .exp-text {
      color: #666;
    }
  }
}

.intro-area {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 20rpx 0;
  min-height: 120rpx;

  .intro-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.8;
    flex: 1;
  }

  .placeholder {
    font-size: 28rpx;
    color: #ccc;
    flex: 1;
    line-height: 1.8;
  }
}

.bottom-actions {
  padding: 30rpx;
}
</style>
