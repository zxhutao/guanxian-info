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
        :class="{ active: currentTab === index }"
        v-for="(item, index) in tabs" 
        :key="index"
        @click="currentTab = index"
      >
        <text class="tab-icon">{{ item.icon }}</text>
        <text class="tab-text">{{ item.name }}</text>
      </view>
    </view>
    
    <view class="form-container">
      <!-- 招聘信息 -->
      <view v-if="currentTab === 0">
        <u-form :model="jobForm" :rules="jobRules" ref="jobFormRef" label-width="160rpx">
          <u-form-item label="职位名称" prop="title" required>
            <u-input v-model="jobForm.title" placeholder="请输入职位名称" />
          </u-form-item>
          <u-form-item label="企业名称" prop="company" required>
            <u-input v-model="jobForm.company" placeholder="请输入企业名称" />
          </u-form-item>
          <u-form-item label="薪资范围" prop="salary" required>
            <u-input v-model="jobForm.salary" placeholder="如：5000-8000元/月" />
          </u-form-item>
          <u-form-item label="工作地点" prop="location">
            <u-input v-model="jobForm.location" placeholder="请输入工作地点" />
          </u-form-item>
          <u-form-item label="经验要求" prop="experience">
            <u-input v-model="jobForm.experience" placeholder="如：1-3年/不限" />
          </u-form-item>
          <u-form-item label="学历要求" prop="education">
            <u-input v-model="jobForm.education" placeholder="如：初中/高中/不限" />
          </u-form-item>
          <u-form-item label="招聘人数" prop="count">
            <u-input v-model="jobForm.count" placeholder="请输入招聘人数" type="number" />
          </u-form-item>
          <u-form-item label="联系电话" prop="phone" required>
            <u-input v-model="jobForm.phone" placeholder="请输入联系电话" type="number" />
          </u-form-item>
          <u-form-item label="职位描述" prop="description">
            <u-textarea v-model="jobForm.description" placeholder="请输入职位描述..." :height="150" :auto-height="true" />
          </u-form-item>
        </u-form>
      </view>
      
      <!-- 服务信息 -->
      <view v-if="currentTab === 1">
        <u-form :model="serviceForm" :rules="serviceRules" ref="serviceFormRef" label-width="160rpx">
          <u-form-item label="服务名称" prop="name" required>
            <u-input v-model="serviceForm.name" placeholder="请输入服务名称" />
          </u-form-item>
          <u-form-item label="服务商" prop="provider" required>
            <u-input v-model="serviceForm.provider" placeholder="请输入服务商/个人名称" />
          </u-form-item>
          <u-form-item label="价格" prop="price" required>
            <u-input v-model="serviceForm.price" placeholder="如：¥99起" />
          </u-form-item>
          <u-form-item label="服务范围" prop="range">
            <u-input v-model="serviceForm.range" placeholder="如：冠县城区" />
          </u-form-item>
          <u-form-item label="服务简介" prop="description">
            <u-textarea v-model="serviceForm.description" placeholder="请简单描述服务内容..." :height="150" :auto-height="true" />
          </u-form-item>
          <u-form-item label="联系电话" prop="phone" required>
            <u-input v-model="serviceForm.phone" placeholder="请输入联系电话" type="number" />
          </u-form-item>
        </u-form>
      </view>
      
      <!-- 养老护工 -->
      <view v-if="currentTab === 2">
        <u-form :model="nursingForm" :rules="nursingRules" ref="nursingFormRef" label-width="160rpx">
          <u-form-item label="护工姓名" prop="name" required>
            <u-input v-model="nursingForm.name" placeholder="请输入护工姓名" />
          </u-form-item>
          <u-form-item label="性别" prop="gender" required>
            <u-radio-group v-model="nursingForm.gender">
              <u-radio name="女">女</u-radio>
              <u-radio name="男">男</u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item label="年龄" prop="age">
            <u-input v-model="nursingForm.age" placeholder="请输入年龄" type="number" />
          </u-form-item>
          <u-form-item label="经验年限" prop="experience" required>
            <u-input v-model="nursingForm.experience" placeholder="从事护理工作年限" type="number" />
          </u-form-item>
          <u-form-item label="日薪" prop="price" required>
            <u-input v-model="nursingForm.price" placeholder="如：¥200/天" />
          </u-form-item>
          <u-form-item label="擅长领域" prop="skills">
            <u-input v-model="nursingForm.skills" placeholder="如：日常起居、康复辅助" />
          </u-form-item>
          <u-form-item label="个人简介" prop="bio">
            <u-textarea v-model="nursingForm.bio" placeholder="简单介绍一下自己..." :height="150" :auto-height="true" />
          </u-form-item>
          <u-form-item label="联系电话" prop="phone" required>
            <u-input v-model="nursingForm.phone" placeholder="请输入联系电话" type="number" />
          </u-form-item>
        </u-form>
      </view>
      
      <view class="submit-btn">
        <u-button type="primary" size="large" @click="handlePublish">立即发布</u-button>
      </view>
      
      <view class="agreement-text">
        <text>点击发布即表示同意</text>
        <text class="link" @click="showAgreement">《冠帮帮信息服务协议》</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentTab = ref(0)
const tabs = [
  { name: '招聘', icon: '💼' },
  { name: '服务', icon: '🔧' },
  { name: '护工', icon: '👩‍⚕️' }
]

// 招聘信息表单
const jobFormRef = ref(null)
const jobForm = reactive({
  title: '',
  company: '',
  salary: '',
  location: '',
  experience: '不限',
  education: '不限',
  count: '',
  phone: '',
  description: ''
})

// 服务信息表单
const serviceFormRef = ref(null)
const serviceForm = reactive({
  name: '',
  provider: '',
  price: '',
  range: '',
  description: '',
  phone: ''
})

// 护工信息表单
const nursingFormRef = ref(null)
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

// 表单验证规则
const jobRules = {
  title: [{ required: true, message: '请输入职位名称' }],
  company: [{ required: true, message: '请输入企业名称' }],
  salary: [{ required: true, message: '请输入薪资范围' }],
  phone: [{ required: true, message: '请输入联系电话' }]
}

const serviceRules = {
  name: [{ required: true, message: '请输入服务名称' }],
  provider: [{ required: true, message: '请输入服务商名称' }],
  price: [{ required: true, message: '请输入价格' }],
  phone: [{ required: true, message: '请输入联系电话' }]
}

const nursingRules = {
  name: [{ required: true, message: '请输入护工姓名' }],
  gender: [{ required: true, message: '请选择性别' }],
  experience: [{ required: true, message: '请输入经验年限' }],
  price: [{ required: true, message: '请输入日薪' }],
  phone: [{ required: true, message: '请输入联系电话' }]
}

// 发布
const handlePublish = async () => {
  let formData = null
  let formRef = null
  
  if (currentTab.value === 0) {
    formData = jobForm
    formRef = jobFormRef.value
  } else if (currentTab.value === 1) {
    formData = serviceForm
    formRef = serviceFormRef.value
  } else {
    formData = nursingForm
    formRef = nursingFormRef.value
  }
  
  // 简单验证
  if (!formData.title && !formData.name) {
    uni.showToast({ title: '请填写必填项', icon: 'none' })
    return
  }
  if (!formData.phone) {
    uni.showToast({ title: '请输入联系电话', icon: 'none' })
    return
  }
  
  // 显示加载
  uni.showLoading({ title: '发布中...' })
  
  // 模拟发布请求
  setTimeout(() => {
    uni.hideLoading()
    uni.showModal({
      title: '发布成功',
      content: '您的信息已提交，审核通过后将在平台展示！',
      showCancel: false,
      success: () => {
        uni.navigateBack()
      }
    })
  }, 1000)
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

.submit-btn {
  margin-top: 50rpx;
}

.agreement-text {
  text-align: center;
  margin-top: 30rpx;
  font-size: 24rpx;
  color: #999;
  
  .link {
    color: #4CAF50;
  }
}
</style>
