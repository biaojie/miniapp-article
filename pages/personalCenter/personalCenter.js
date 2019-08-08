// personalCenter/personalCenter.js
const CONFIG = require('../../utils/config.js')
const app = getApp()
Page({

  data: {
    userInfo: null,   //用户信息
  },

  onLoad: function (options) {
    var userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
  },
  onShow: function(){
    var userInfo = this.data.userInfo;
    if (userInfo) {
      this.getUserInfo()
    }
    
    
  },
  // 用户授权
  getUserInfo: function(e){
    var that = this
    app.userLogin(function(){
      var userInfo = app.globalData.userInfo;
      that.setData({
        userInfo: userInfo
      })
    })
  },
  // 获取手机号码
  getPhone: function(e){
    var that = this;
    if (this.data.userInfo == null){
      wx.showToast({
        title: '请先授权登录',
        icon: 'loading',
        duration: 1000
      })
    }else{
      wx.request({
        url: CONFIG.API_URL.getPhone,
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          sessionKey: that.data.userInfo.sessionKey,
          userid: that.data.userInfo.id,
        },
        method: 'POST',
        success: function (res) {
          var data = res.data.data;
          if(data.status == 1){
            app.userLogin(function () {
              var userInfo = app.globalData.userInfo;
              that.setData({
                userInfo: userInfo
              })
            })
          }
        }
      })
    }
  },
  
  // 余额页跳转
  balance: function() {
    wx.navigateTo({
      url:'/pages/balance/balance'
    })
  },
  // 分享赚佣金
  shareCommission:function(){
    wx.navigateTo({
      url: '/pages/shareCommission/shareCommission',
    })
  },
  // 我的收藏页跳转
  myCollect: function(){
    wx.navigateTo({
      url: '/pages/myCollect/myCollect',
    })
  },
  // 分享操作流程跳转
  shareFlow: function(){
    var id = 87;
    wx.navigateTo({
      url: '/pages/aboutus/aboutus?id=' + id
    })
  },
  onShareAppMessage: function () {
    return {
      title: '共享民间特效秘方',
      path: '/pages/index/index'
    }
  }
})