<template>
  <view class="publish-page">
    <!-- 顶部提示 -->
    <view class="tips-box">
      <text class="tips-icon">💡</text>
      <text class="tips-text">免费发布信息，平台审核后即可展示</text>
    </view>
    
    <!-- 分类选择 -->
    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 0 }"
        @click="currentTab = 0"
      >
        <text class="tab-icon">💼</text>
        <text class="tab-text">招聘</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 1 }"
        @click="currentTab = 1"
      >
        <text class="tab-icon">🔧</text>
        <text class="tab-text">服务</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 2 }"
        @click="currentTab = 2"
      >
        <text class="tab-icon">👩‍⚕️</text>
        <text class="tab-text">护工</text>
      </view>
    </view>
    
    <view class="form-container">
      <!-- 招聘信息 -->
      <view v-if="currentTab === 0" class="form-list">
        <view class="form-item">
          <text class="label required">职位名称</text>
          <input class="input" v-model="jobForm.title" placeholder="请输入职位名称" />
        </view>
        <view class="form-item">
          <text class="label required">企业名称</text>
          <input class="input" v-model="jobForm.company" placeholder="请输入企业名称" />
        </view>
        <view class="form-item">
          <text class="label required">薪资范围</text>
          <input class="input" v-model="jobForm.salary" placeholder="如：5000-8000元/月" />
        </view>
        <view class="form-item">
          <text class="label">工作地点</text>
          <view class="location-picker" @click="chooseLocation('job')">
            <text v-if="jobForm.location" class="location-text">{{ jobForm.location }}</text>
            <text v-else class="placeholder">请选择工作地点</text>
            <text class="location-icon">📍</text>
          </view>
        </view>
        <view class="form-item">
          <text class="label">经验要求</text>
          <picker class="picker" mode="selector" :range="experienceOptions" :value="experienceIndex" @change="onExperienceChange">
            <view class="picker-value">{{ jobForm.experience || '请选择经验要求' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">学历要求</text>
          <picker class="picker" mode="selector" :range="educationOptions" :value="educationIndex" @change="onEducationChange">
            <view class="picker-value">{{ jobForm.education || '请选择学历要求' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">招聘人数</text>
          <input class="input" type="number" v-model="jobForm.count" placeholder="请输入招聘人数" />
        </view>
        <view class="form-item">
          <text class="label required">联系电话</text>
          <input class="input" type="number" v-model="jobForm.phone" placeholder="请输入联系电话" />
        </view>
        <view class="form-item">
          <text class="label">职位描述</text>
          <textarea class="textarea" v-model="jobForm.description" placeholder="请输入职位描述..." />
        </view>
      </view>
      
      <!-- 服务信息 -->
      <view v-if="currentTab === 1" class="form-list">
        <view class="form-item">
          <text class="label required">服务名称</text>
          <input class="input" v-model="serviceForm.name" placeholder="请输入服务名称" />
        </view>
        <view class="form-item">
          <text class="label required">服务商</text>
          <input class="input" v-model="serviceForm.provider" placeholder="请输入服务商/个人名称" />
        </view>
        <view class="form-item">
          <text class="label required">价格</text>
          <input class="input" v-model="serviceForm.price" placeholder="如：¥99起" />
        </view>
        <view class="form-item">
          <text class="label">服务地址</text>
          <view class="location-picker" @click="chooseLocation('service')">
            <text v-if="serviceForm.location" class="location-text">{{ serviceForm.location }}</text>
            <text v-else class="placeholder">请选择服务地址</text>
            <text class="location-icon">📍</text>
          </view>
        </view>
        <view class="form-item">
          <text class="label">服务简介</text>
          <textarea class="textarea" v-model="serviceForm.description" placeholder="请简单描述服务内容..." />
        </view>
        <view class="form-item">
          <text class="label required">联系电话</text>
          <input class="input" type="number" v-model="serviceForm.phone" placeholder="请输入联系电话" />
        </view>
      </view>
      
      <!-- 养老护工 -->
      <view v-if="currentTab === 2" class="form-list">
        <view class="form-item">
          <text class="label required">护工姓名</text>
          <input class="input" v-model="nursingForm.name" placeholder="请输入护工姓名" />
        </view>
        <view class="form-item">
          <text class="label required">性别</text>
          <radio-group class="radio-group" @change="onGenderChange">
            <label class="radio-label">
              <radio value="女" :checked="nursingForm.gender === '女'" /> 女
            </label>
            <label class="radio-label">
              <radio value="男" :checked="nursingForm.gender === '男'" /> 男
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">年龄</text>
          <input class="input" type="number" v-model="nursingForm.age" placeholder="请输入年龄" />
        </view>
        <view class="form-item">
          <text class="label required">经验年限</text>
          <input class="input" type="number" v-model="nursingForm.experience" placeholder="从事护理工作年限" />
        </view>
        <view class="form-item">
          <text class="label required">日薪</text>
          <input class="input" v-model="nursingForm.price" placeholder="如：¥200/天" />
        </view>
        <view class="form-item">
          <text class="label">擅长领域</text>
          <input class="input" v-model="nursingForm.skills" placeholder="如：日常起居、康复辅助" />
        </view>
        <view class="form-item">
          <text class="label">个人简介</text>
          <textarea class="textarea" v-model="nursingForm.bio" placeholder="简单介绍一下自己..." />
        </view>
        <view class="form-item">
          <text class="label required">联系电话</text>
          <input class="input" type="number" v-model="nursingForm.phone" placeholder="请输入联系电话" />
        </view>
      </view>
      
      <view class="submit-btn">
        <button class="submit-button" @click="handlePublish">
          {{ isEdit ? '保存修改' : '立即发布' }}
        </button>
      </view>
      
      <view class="agreement-text">
        <checkbox-group @change="onAgreedChange">
          <label class="agreement-label">
            <checkbox value="agreed" :checked="agreed" />
            <text>我已阅读并同意</text>
          </label>
        </checkbox-group>
        <text class="link" @click="showAgreement">《冠帮帮信息服务协议》</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const currentTab = ref(0)
const agreed = ref(false)
const isEdit = ref(false) // 是否是编辑模式
const editId = ref('')   // 编辑的ID

// 页面加载
onLoad((options) => {
  // 如果有编辑ID，则是编辑模式 (支持 editId 或 id 参数)
  const targetId = options.editId || options.id
  if (targetId) {
    isEdit.value = true
    editId.value = targetId
    // 根据类型设置当前tab (支持 type 参数或 edit 参数)
    const type = options.type || options.edit
    if (type === 'service') {
      currentTab.value = 1
    } else if (type === 'nursing') {
      currentTab.value = 2
    }
    // 加载原有数据
    loadEditData(targetId, type || 'job')
    uni.setNavigationBarTitle({ title: '编辑信息' })
  }
})

// 加载编辑数据
const loadEditData = async (id, type) => {
  try {
    // 使用 wx.cloud.database() 获取数据
    const db = wx.cloud.database()
    const collection = type === 'service' ? 'services' : (type === 'nursing' ? 'nursing' : 'jobs')
    const result = await db.collection(collection).doc(id).get()
    
    // wx.cloud.database() 返回的数据在 result.data 中
    if (result.data) {
      const data = result.data
      if (type === 'job') {
        Object.assign(jobForm, {
          title: data.title || '',
          company: data.company || '',
          salary: data.salary || '',
          location: data.location || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          experience: data.experience || '不限',
          education: data.education || '不限',
          count: data.count || '',
          phone: data.phone || '',
          description: data.description || ''
        })
      } else if (type === 'service') {
        Object.assign(serviceForm, {
          name: data.name || '',
          provider: data.provider || '',
          price: data.price || '',
          location: data.location || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          description: data.description || '',
          phone: data.phone || ''
        })
      }
      uni.showToast({ title: '数据加载成功', icon: 'success' })
    }
  } catch (err) {
    console.error('加载编辑数据失败:', err)
    uni.showToast({ title: '加载数据失败', icon: 'none' })
  }
}

// 协议勾选变化
const onAgreedChange = (e) => {
  agreed.value = e.detail.value.includes('agreed')
}

// 选项数据
const experienceOptions = ['不限', '1年以内', '1-3年', '3-5年', '5年以上']
const educationOptions = ['不限', '初中', '高中', '大专', '本科', '本科以上']

// picker索引计算
const experienceIndex = computed(() => experienceOptions.indexOf(jobForm.experience))
const educationIndex = computed(() => educationOptions.indexOf(jobForm.education))

// picker变化事件
const onExperienceChange = (e) => {
  jobForm.experience = experienceOptions[e.detail.value]
}

const onEducationChange = (e) => {
  jobForm.education = educationOptions[e.detail.value]
}

// 选择位置
const chooseLocation = (type) => {
  uni.chooseLocation({
    success: (res) => {
      if (type === 'job') {
        jobForm.location = res.address
        jobForm.latitude = res.latitude
        jobForm.longitude = res.longitude
      } else if (type === 'service') {
        serviceForm.location = res.address
        serviceForm.latitude = res.latitude
        serviceForm.longitude = res.longitude
      }
    },
    fail: (err) => {
      // 用户取消或授权失败
      if (err.errMsg && !err.errMsg.includes('cancel')) {
        uni.showToast({ title: '请授权位置权限', icon: 'none' })
      }
    }
  })
}

// 招聘信息表单
const jobForm = reactive({
  title: '',
  company: '',
  salary: '',
  location: '',
  latitude: '',  // 纬度
  longitude: '', // 经度
  experience: '不限',
  education: '不限',
  count: '',
  phone: '',
  description: ''
})

// 服务信息表单
const serviceForm = reactive({
  name: '',
  provider: '',
  price: '',
  location: '',
  latitude: '',
  longitude: '',
  description: '',
  phone: ''
})

// 护工信息表单
const nursingForm = reactive({
  name: '',
  gender: '女',
  age: '',
  experience: '',
  price: '',
  skills: '',
  bio: '',
  phone: ''
})

// 性别选择
const onGenderChange = (e) => {
  nursingForm.gender = e.detail.value
}

// 表单验证规则
const validateRules = {
  job: {
    fields: ['title', 'company', 'salary', 'phone'],
    messages: {
      title: '请输入职位名称',
      company: '请输入企业名称',
      salary: '请输入薪资范围',
      phone: '请输入联系电话'
    }
  },
  service: {
    fields: ['name', 'provider', 'price', 'phone'],
    messages: {
      name: '请输入服务名称',
      provider: '请输入服务商名称',
      price: '请输入价格',
      phone: '请输入联系电话'
    }
  },
  nursing: {
    fields: ['name', 'gender', 'experience', 'price', 'phone'],
    messages: {
      name: '请输入护工姓名',
      gender: '请选择性别',
      experience: '请输入经验年限',
      price: '请输入日薪',
      phone: '请输入联系电话'
    }
  }
}

// 手机号正则验证
const validatePhone = (phone) => {
  const phoneReg = /^1[3-9]\d{9}$/
  return phoneReg.test(phone)
}

// 发布/更新
const handlePublish = () => {
  // 检查是否同意服务协议
  if (!agreed.value) {
    uni.showToast({ title: '请先同意服务协议', icon: 'none' })
    return
  }
  
  let formData = null
  let rules = null
  
  if (currentTab.value === 0) {
    formData = jobForm
    rules = validateRules.job
  } else if (currentTab.value === 1) {
    formData = serviceForm
    rules = validateRules.service
  } else {
    formData = nursingForm
    rules = validateRules.nursing
  }
  
  // 必填项验证
  for (const field of rules.fields) {
    if (!formData[field] || formData[field].toString().trim() === '') {
      uni.showToast({ title: rules.messages[field], icon: 'none' })
      return
    }
  }
  
  // 手机号格式验证
  if (!validatePhone(formData.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  
  // 显示加载
  const loadingText = isEdit.value ? '更新中...' : '发布中...'
  uni.showLoading({ title: loadingText })
  
  // 获取发布类型
  const typeMap = ['job', 'service', 'nursing']
  const type = typeMap[currentTab.value]
  
  // 编辑模式：调用更新云函数
  if (isEdit.value && editId.value) {
    // 使用 wx.cloud.database() 进行更新
    const db = wx.cloud.database()
    const collection = type === 'service' ? 'services' : (type === 'nursing' ? 'nursing' : 'jobs')
    
    db.collection(collection).doc(editId.value).update({
      data: { ...formData, updateTime: Date.now() }
    }).then(() => {
      uni.hideLoading()
      uni.showModal({
        title: '更新成功',
        content: '信息已更新成功！',
        showCancel: false,
        success: () => {
          uni.navigateBack()
        }
      })
    }).catch((err) => {
      uni.hideLoading()
      console.error('更新失败:', err)
      uni.showToast({ title: '更新失败，请重试', icon: 'none' })
    })
    return
  }
  
  // 新增模式：调用云函数发布
  wx.cloud.callFunction({
    name: 'publish',
    data: {
      type,
      data: { ...formData }
    },
    success: (res) => {
      uni.hideLoading()
      
      if (res.result && res.result.success) {
        uni.showModal({
          title: '发布成功',
          content: '您的信息已提交，审核通过后将在平台展示！',
          showCancel: false,
          success: () => {
            uni.navigateBack()
          }
        })
      } else {
        uni.showToast({ title: res.result?.msg || '发布失败，请重试', icon: 'none' })
      }
    },
    fail: (err) => {
      uni.hideLoading()
      console.error('发布失败:', err)
      uni.showToast({ title: '网络异常，请重试', icon: 'none' })
    }
  })
}

// 查看协议
const showAgreement = () => {
  uni.showToast({ title: '协议内容开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50rpx;
}

.tips-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 20rpx;
  background: #FFF8E1;
  
  .tips-icon {
    font-size: 28rpx;
  }
  
  .tips-text {
    font-size: 26rpx;
    color: #F57C00;
  }
}

.tabs {
  display: flex;
  background: #fff;
  padding: 20rpx 0;
  
  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    padding: 20rpx;
    
    .tab-icon {
      font-size: 48rpx;
    }
    
    .tab-text {
      font-size: 28rpx;
      color: #666;
    }
    
    &.active {
      .tab-text {
        color: #E63946;
        font-weight: 600;
      }
    }
  }
}

.form-container {
  padding: 30rpx;
  background: #fff;
  margin-top: 20rpx;
}

.form-list {
  .form-item {
    margin-bottom: 30rpx;
    
    .label {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 10rpx;
      
      &.required::before {
        content: '*';
        color: #E63946;
        margin-right: 4rpx;
      }
    }
    
    .input {
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
      background: #f5f5f5;
      border-radius: 8rpx;
      font-size: 28rpx;
      box-sizing: border-box;
    }
    
    .textarea {
      width: 100%;
      min-height: 150rpx;
      padding: 20rpx;
      background: #f5f5f5;
      border-radius: 8rpx;
      font-size: 28rpx;
      box-sizing: border-box;
    }
    
    .radio-group {
      display: flex;
      gap: 40rpx;
      
      .radio-label {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 28rpx;
      }
    }
    
    .picker {
      flex: 1;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20rpx;
      background: #f5f5f5;
      border-radius: 8rpx;
      
      .picker-value {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

// 位置选择器
.location-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  min-height: 80rpx;
  
  .location-text {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
  
  .placeholder {
    flex: 1;
    font-size: 28rpx;
    color: #999;
  }
  
  .location-icon {
    font-size: 32rpx;
    margin-left: 16rpx;
  }
}

.submit-btn {
  margin-top: 50rpx;
}

.submit-button {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #E63946, #ff6b6b);
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
  
  &::after {
    border: none;
  }
}

.agreement-text {
  text-align: center;
  margin-top: 30rpx;
  font-size: 24rpx;
  color: #999;
  
  .agreement-label {
    display: inline-flex;
    align-items: center;
    margin-right: 8rpx;
    
    checkbox {
      transform: scale(0.7);
    }
  }
  
  .link {
    color: #4CAF50;
  }
}
</style>
