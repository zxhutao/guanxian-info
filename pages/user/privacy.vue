<template>
  <view class="privacy-page">
    <view class="header">
      <text class="title">隐私政策</text>
      <text class="date">更新日期：2026年3月27日</text>
    </view>
    
    <view class="content">
      <view class="section">
        <text class="section-title">引言</text>
        <text class="paragraph">
          冠帮帮非常重视保护您的个人信息和隐私权益。我们承诺按照相关法律法规的规定，
          保护您的个人信息安全。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">一、信息收集</text>
        <text class="paragraph">
          为向您提供服务，我们可能会收集以下信息：
          
          1. 【注册信息】手机号码、昵称、头像
          2. 【使用信息】浏览记录、搜索记录、操作日志
          3. 【位置信息】您主动选择分享的位置信息
          4. 【发布信息】您主动发布的内容（简历、服务信息等）
          5. 【设备信息】设备型号、操作系统版本
          
          我们仅在您主动提供或授权同意时收集上述信息。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">二、信息使用</text>
        <text class="paragraph">
          我们使用收集的信息用于：
          1. 提供、维护和改进我们的服务
          2. 响应您的请求和反馈
          3. 向您推送您可能感兴趣的信息
          4. 进行数据分析和统计
          5. 预防、发现和调查欺诈、违法活动
          
          未经您的同意，我们不会将您的信息用于本政策目的之外的用途。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">三、信息共享</text>
        <text class="paragraph">
          我们承诺不会在未征得您同意的情况下，向第三方出售您的个人信息。
          
          在以下情况下，我们可能会共享您的信息：
          1. 获得您的明确同意
          2. 根据法律法规的要求或政府主管部门的要求
          3. 为保护我们的合法权益而必需
          4. 与为您提供服务所必需的合作伙伴共享（如云服务提供商）
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">四、信息存储</text>
        <text class="paragraph">
          1. 【存储地点】您的信息将存储在中华人民共和国境内的服务器。
          2. 【存储期限】我们仅在实现本政策所述目的所必需的期限内保留您的信息。
          3. 【安全保护】我们采用业界标准的安全防护措施保护您的信息。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">五、您的权利</text>
        <text class="paragraph">
          您对您的个人信息享有以下权利：
          1. 【访问权】您有权访问您的个人信息
          2. 【更正权】您有权更正不准确的个人信息
          3. 【删除权】在符合法定情形时，您有权要求删除您的信息
          4. 【撤回同意】您有权撤回之前的授权同意
          5. 【注销账号】您有权注销您的账号
          
          如需行使上述权利，请联系我们的客服。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">六、未成年人保护</text>
        <text class="paragraph">
          我们非常重视对未成年人信息的保护。若您是未满18周岁的未成年人，
          请在使用我们的服务前取得您的监护人的同意。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">七、隐私政策更新</text>
        <text class="paragraph">
          我们可能会不时更新本隐私政策。更新后的隐私政策将在小程序内公布。
          如您继续使用我们的服务，视为您同意更新后的隐私政策。
        </text>
      </view>
      
      <view class="section">
        <text class="section-title">八、联系我们</text>
        <text class="paragraph">
          如您对本隐私政策有任何疑问、意见或建议，请联系我们：
          
          客服热线：400-888-8888（工作日9:00-18:00）
          
          感谢您信任冠帮帮，我们将一如既往地保护您的隐私权益！
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.privacy-page {
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
      white-space: pre-wrap;
    }
  }
}
</style>
