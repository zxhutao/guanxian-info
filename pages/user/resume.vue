<template>
  <view class="resume-page">
    <!-- 头像区域 -->
    <view class="avatar-section">
      <image lazy-load class="avatar-img"
        :src="resume.avatar || '/static/images/default-avatar.png'"
        mode="aspectFill"
        @click="changeAvatar"
      />
      <view class="avatar-tip">点击更换头像</view>
    </view>

    <!-- 基本信息 -->
    <view class="section-card">
      <view class="section-title">
        <text class="icon">👤</text>
        <text>基本信息</text>
      </view>
      <view class="form-list">
        <view class="form-item" @click="editField('name')">
          <text class="form-label">姓名</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.name }">{{ resume.name || '请填写' }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <view class="form-item" @click="editField('gender')">
          <text class="form-label">性别</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.gender }">{{ resume.gender || '请选择' }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <view class="form-item" @click="editField('age')">
          <text class="form-label">年龄</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.age }">{{ resume.age ? resume.age + '岁' : '请填写' }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <view class="form-item" @click="editField('phone')">
          <text class="form-label">联系电话</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.phone }">{{ resume.phone || '请填写' }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <view class="form-item" @click="editField('education')">
          <text class="form-label">学历</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.education }">{{ resume.education || '请选择' }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 求职意向 -->
    <view class="section-card">
      <view class="section-title">
        <text class="icon">💼</text>
        <text>求职意向</text>
      </view>
      <view class="form-list">
        <view class="form-item" @click="editField('expectedJob')">
          <text class="form-label">期望职位</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.expectedJob }">{{ resume.expectedJob || '请填写' }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <view class="form-item" @click="editField('expectedSalary')">
          <text class="form-label">期望薪资</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.expectedSalary }">{{ resume.expectedSalary || '请选择' }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <view class="form-item" @click="editField('workArea')">
          <text class="form-label">工作区域</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.workArea }">{{ resume.workArea || '请选择' }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
        <view class="form-item" @click="editField('jobType')">
          <text class="form-label">工作类型</text>
          <view class="form-value">
            <text :class="{ placeholder: !resume.jobType }">{{ resume.jobType || '请选择' }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 工作经历 -->
    <view class="section-card">
      <view class="section-title">
        <text class="icon">📄</text>
        <text>工作经历</text>
        <view class="add-btn" @click="addExperience">
          <text class="add-icon">➕</text>
          <text>添加</text>
        </view>
      </view>
      <view v-if="resume.workExperience.length === 0" class="empty-tip">
        暂无工作经历，点击上方添加
      </view>
      <view v-for="(exp, index) in resume.workExperience" :key="index" class="exp-card">
        <view class="exp-header">
          <view class="exp-company">{{ exp.company }}</view>
          <view class="exp-actions">
            <text class="edit-icon" @click="editExperience(index)">✎</text>
            <text class="close-icon" @click="removeExperience('work', index)">✕</text>
          </view>
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

    <!-- 工作经历编辑弹窗 -->
    <view v-if="expModalVisible" class="modal-mask">
      <view class="exp-modal">
        <view class="modal-header">
          <text class="modal-title">{{ expEditIndex >= 0 ? '编辑工作经历' : '添加工作经历' }}</text>
          <text class="modal-close" @click="cancelExpForm">✕</text>
        </view>
        <view class="modal-body">
          <view class="modal-field">
            <text class="modal-label">公司名称 <text class="required">*</text></text>
            <input
              class="modal-input"
              v-model="expForm.company"
              placeholder="如：冠县某某玻璃厂"
              maxlength="30"
              :adjust-position="false"
            />
          </view>
          <view class="modal-field">
            <text class="modal-label">担任职位 <text class="required">*</text></text>
            <input
              class="modal-input"
              v-model="expForm.position"
              placeholder="如：普工、质检员、仓管"
              maxlength="20"
              :adjust-position="false"
            />
          </view>
          <view class="modal-field">
            <text class="modal-label">开始时间</text>
            <input
              class="modal-input"
              v-model="expForm.startTime"
              placeholder="如：2023.06"
              maxlength="10"
              :adjust-position="false"
            />
          </view>
          <view class="modal-field">
            <text class="modal-label">结束时间</text>
            <input
              class="modal-input"
              v-model="expForm.endTime"
              placeholder="如：2025.12 或 至今"
              maxlength="10"
              :adjust-position="false"
            />
          </view>
          <view class="modal-field">
            <text class="modal-label">工作描述（选填）</text>
            <textarea
              class="modal-textarea"
              v-model="expForm.desc"
              placeholder="简单描述工作内容和职责..."
              maxlength="100"
              :auto-height="true"
              :adjust-position="false"
            />
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-btn-cancel" @click="cancelExpForm">取消</button>
          <button class="modal-btn-confirm" @click="confirmExpForm">确定</button>
        </view>
      </view>
    </view>

    <!-- 自我介绍 -->
    <view class="section-card">
      <view class="section-title">
        <text class="icon">✏️</text>
        <text>自我介绍</text>
      </view>
      <view class="intro-area" @click="editIntro">
        <text v-if="resume.intro" class="intro-text">{{ resume.intro }}</text>
        <text v-else class="placeholder">请填写自我介绍，让企业更了解你...</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button
        class="save-btn"
        :disabled="saving"
        @click="() => { console.log('按钮被点击了！'); saveResume() }"
      >
        {{ saving ? '保存中...' : '保存简历' }}
      </button>
    </view>
    <view style="height: 140rpx;" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { showConfirm } from '../../utils/index'

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

const changeAvatar = async () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0]
      resume.value.avatar = tempFilePath // 先显示本地临时图片

      // 上传到云存储（使用微信原生云开发）
      try {
        const uploadRes = await wx.cloud.uploadFile({
          cloudPath: `resume/${Date.now()}.jpg`,
          filePath: tempFilePath
        })
        resume.value.avatar = uploadRes.fileID // 更新为云存储URL
      } catch (e) {
        console.error('头像上传失败', e)
        uni.showToast({ title: '头像上传失败', icon: 'none' })
      }
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

// 工作经历弹窗状态
const expModalVisible = ref(false)
const expEditIndex = ref(-1)
const expForm = ref({
  company: '',
  position: '',
  startTime: '',
  endTime: '',
  desc: ''
})

const addExperience = () => {
  expEditIndex.value = -1
  expForm.value = { company: '', position: '', startTime: '', endTime: '', desc: '' }
  expModalVisible.value = true
}

const editExperience = (index) => {
  expEditIndex.value = index
  expForm.value = { ...resume.value.workExperience[index] }
  expModalVisible.value = true
}

const cancelExpForm = () => {
  const hasContent = expForm.value.company || expForm.value.position ||
    expForm.value.startTime || expForm.value.endTime || expForm.value.desc
  if (hasContent) {
    uni.showModal({
      title: '放弃编辑',
      content: '已填写的内容将不会保存，确定关闭吗？',
      confirmText: '确定关闭',
      cancelText: '继续编辑',
      success: (res) => {
        if (res.confirm) {
          expModalVisible.value = false
        }
      }
    })
  } else {
    expModalVisible.value = false
  }
}

const confirmExpForm = () => {
  if (!expForm.value.company.trim()) {
    uni.showToast({ title: '请填写公司名称', icon: 'none' })
    return
  }
  if (!expForm.value.position.trim()) {
    uni.showToast({ title: '请填写担任职位', icon: 'none' })
    return
  }
  const entry = {
    company: expForm.value.company.trim(),
    position: expForm.value.position.trim(),
    startTime: expForm.value.startTime.trim(),
    endTime: expForm.value.endTime.trim(),
    desc: expForm.value.desc.trim()
  }
  if (expEditIndex.value >= 0) {
    resume.value.workExperience[expEditIndex.value] = entry
  } else {
    resume.value.workExperience.push(entry)
  }
  expModalVisible.value = false
}

const removeExperience = async (type, index) => {
  const confirmed = await showConfirm('删除确认', '确定删除这条工作经历吗？')
  if (confirmed) {
    resume.value.workExperience.splice(index, 1)
  }
}

const saveResume = async () => {
  console.log('========== 开始保存简历 ==========')
  console.log('简历数据:', JSON.stringify(resume.value, null, 2))

  if (!resume.value.name) {
    console.log('❌ 姓名为空，返回')
    uni.showToast({ title: '请填写姓名', icon: 'none' })
    return
  }
  if (!resume.value.phone) {
    console.log('❌ 电话为空，返回')
    uni.showToast({ title: '请填写联系电话', icon: 'none' })
    return
  }

  console.log('✅ 必填项验证通过')
  saving.value = true
  uni.showLoading({ title: '保存中...' })

  try {
    // 第一步：保存到本地存储
    uni.setStorageSync('myResume', resume.value)
    console.log('✅ 本地存储保存成功')

    // 第二步：上传到云数据库
    // #ifdef MP-WEIXIN
    console.log('开始云数据库保存...')

    const db = wx.cloud.database()
    console.log('✅ 获取数据库实例成功')

    // 直接添加简历，云开发会自动添加 _openid 字段
    console.log('开始添加新简历...')
    console.log('准备写入的数据:', {
      ...resume.value,
      updateTime: db.serverDate(),
      createTime: db.serverDate()
    })
    const addRes = await db.collection('resumes').add({
      data: {
        ...resume.value,
        updateTime: db.serverDate(),
        createTime: db.serverDate()
      }
    })
    console.log('✅ 新增简历成功, _id:', addRes._id)
    // #endif

    console.log('========== 保存完成 ==========')
    uni.hideLoading() // 先隐藏 loading
    uni.showToast({ title: '保存成功', icon: 'success' })
  } catch (e) {
    console.error('❌ 保存简历失败:', e)
    console.error('错误堆栈:', e.stack)
    uni.hideLoading() // 先隐藏 loading
    uni.showToast({ title: '保存失败: ' + e.message, icon: 'none' })
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

  .icon {
    font-size: 32rpx;
  }

  .add-btn {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6rpx;
    font-size: 26rpx;
    color: #E63946;
    font-weight: normal;

    .add-icon {
      font-size: 32rpx;
    }
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

      .arrow {
        color: #ccc;
        font-size: 24rpx;
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

    .exp-actions {
      display: flex;
      align-items: center;
      gap: 20rpx;
    }

    .edit-icon {
      font-size: 30rpx;
      color: #E63946;
    }

    .close-icon {
      font-size: 28rpx;
      color: #999;
      cursor: pointer;
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

  .arrow {
    color: #ccc;
    font-size: 24rpx;
  }
}

.bottom-actions {
  padding: 30rpx;

  .save-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #E63946;
    color: #fff;
    border: none;
    border-radius: 12rpx;
    font-size: 32rpx;
    font-weight: 500;
    text-align: center;
  }

  .save-btn[disabled] {
    background: #ccc;
    opacity: 0.6;
  }
}

/* 工作经历弹窗 */
.modal-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
}

.exp-modal {
  width: 100%;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  max-height: 85vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 30rpx 20rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .modal-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .modal-close {
      font-size: 30rpx;
      color: #999;
      padding: 10rpx;
    }
  }

  .modal-body {
    padding: 20rpx 30rpx;

    .modal-field {
      margin-bottom: 24rpx;

      .modal-label {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 12rpx;
        display: block;

        .required {
          color: #E63946;
          margin-left: 4rpx;
        }
      }

      .modal-input {
        width: 100%;
        height: 80rpx;
        background: #F7F7F7;
        border-radius: 12rpx;
        padding: 0 24rpx;
        font-size: 28rpx;
        color: #333;
        box-sizing: border-box;
      }

      .modal-textarea {
        width: 100%;
        min-height: 120rpx;
        background: #F7F7F7;
        border-radius: 12rpx;
        padding: 20rpx 24rpx;
        font-size: 28rpx;
        color: #333;
        box-sizing: border-box;
        line-height: 1.6;
      }
    }
  }

  .modal-footer {
    display: flex;
    gap: 20rpx;
    padding: 20rpx 30rpx 30rpx;

    .modal-btn-cancel {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      background: #f5f5f5;
      color: #666;
      border: none;
      border-radius: 12rpx;
      font-size: 30rpx;
      text-align: center;
    }

    .modal-btn-confirm {
      flex: 2;
      height: 80rpx;
      line-height: 80rpx;
      background: #E63946;
      color: #fff;
      border: none;
      border-radius: 12rpx;
      font-size: 30rpx;
      font-weight: 500;
      text-align: center;
    }
  }
}
</style>
