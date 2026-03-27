<template>
  <view class="agreement-page">
    <view class="header">
      <text class="title">用户服务协议</text>
      <text class="date">更新日期：2026年3月27日</text>
    </view>
    
    <view class="content">
      <view class="section">
        <text class="section-title">一、服务条款的确认和接受</text>
        <text class="paragraph">
          欢迎使用冠帮帮小程序！冠帮帮是由冠县本地团队运营的本地生活服务平台。
          本协议双方为冠帮帮运营团队（以下简称"我们"）与您（以下简称"用户"）。
          您在使用冠帮帮服务前，请务必仔细阅读并充分理解本协议各条款内容。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">二、服务内容</text>
        <text class="paragraph">
          冠帮帮致力于为冠县本地居民提供以下服务：
          1. 招聘信息发布与浏览
          2. 本地生活服务信息展示
          3. 养老护工服务预约
          4. 本地资讯浏览
          5. 其他本地生活相关服务
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">三、用户注册</text>
        <text class="paragraph">
          1. 用户在使用本服务前需进行账号注册。
          2. 用户应提供真实、准确的个人信息。
          3. 用户需妥善保管账号信息，因个人保管不善造成的损失由用户自行承担。
          4. 我们有权对虚假注册账号进行封禁处理。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">四、用户行为规范</text>
        <text class="paragraph">
          用户在使用本服务时不得：
          1. 发布虚假、违法、有害信息
          2. 侵犯他人合法权益
          3. 干扰本服务的正常运行
          4. 从事任何商业广告行为
          5. 其他违反法律法规的行为
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">五、信息发布责任</text>
        <text class="paragraph">
          1. 用户发布的招聘信息、服务信息由发布者自行负责。
          2. 我们不对用户发布信息的真实性、准确性承担责任。
          3. 用户应自行核实对方身份和信息的真实性。
          4. 因信息不对称导致的纠纷，由用户自行解决。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">六、免责声明</text>
        <text class="paragraph">
          1. 我们不对用户之间的私下交易行为承担责任。
          2. 因不可抗力导致的服务中断，我们不承担责任。
          3. 用户因使用本服务造成的人身、财产损失，我们不承担责任。
          4. 我们保留随时修改服务内容的权利。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">七、协议修改</text>
        <text class="paragraph">
          我们有权随时修改本协议，修改后的协议一经公布即生效。
          如用户不同意修改后的协议，有权停止使用本服务。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">八、联系我们</text>
        <text class="paragraph">
          如您对本协议有任何疑问，请联系我们：
          客服热线：400-888-8888（工作日9:00-18:00）
          感谢您使用冠帮帮！
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.agreement-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 30rpx;
}

.header {
  background: #fff;
  padding: 40rpx 30rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  text-align: center;
  
  .title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .date {
    display: block;
    font-size: 24rpx;
    color: #999;
  }
}

.content {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  
  .section {
    margin-bottom: 40rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .section-title {
      display: block;
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .paragraph {
      display: block;
      font-size: 28rpx;
      color: #666;
      line-height: 1.8;
      text-align: justify;
    }
  }
}
</style>
