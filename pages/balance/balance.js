// pages/balance/balance.js
const CONFIG = require('../../utils/config.js')
const app = getApp()
Page({

  data: {
    txstatus: false,
  },

  
  onLoad: function (options) {
  
  },

  onShow: function () {
    var userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    } else {
      wx.showModal({
        title: '请先授权登录',
        content: '前往个人中心授权',
        success: function () {
          wx.switchTab({
            url: '/pages/personalCenter/personalCenter',
          })
        },
        fail: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  // 提现输入框
  putForward: function(){
    var txstatus = this.data.txstatus;
    this.setData({
      txstatus: !txstatus
    })
  },
  // 提现
  putForwardt: function(e){
    var that = this;
    var userInfo = that.data.userInfo;
    var price = parseFloat(e.detail.value.price);
    if (price > userInfo.balance){
      wx.showToast({
        title: '提现金额大于余额',
        icon: 'none',
        duration: 2000
      })
      return;
    }else if(!price){
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (price < 50){
      wx.showToast({
        title: '大于100才可提现',
        icon: 'none',
        duration: 2000
      })
      return;
    }else{
      wx.request({
        url: CONFIG.API_URL.putForward,
        method: 'POST',
        data:{
          price: price,
          openid: userInfo.openid
        },
        success: function(res){
          var data = res.data.data;
          if(data.status == 1){
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 1000
            })
            setTimeout(function () {
              that.setData({
                txstatus: !that.data.txstatus
              })
            }, 1000)
            return;
          }else if(data.status == 2){
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 2000
            })
            setTimeout(function () {
              that.setData({
                txstatus: !that.data.txstatus
              })
            }, 2000)
            return;
          }else{
            wx.showToast({
              title: data.message,
              icon: 'none',
              duration: 1000
            })
          }
        }
      })
    }
    
  },
  // 提现说明跳转
  txIllstrate: function(e){
    var id = 88;
    wx.navigateTo({
      url: '/pages/aboutus/aboutus?id=' + id
    })
  },
  // 提现记录跳转
  txRecord:function(){
    wx.navigateTo({
      url: '/pages/txRecord/txRecord',
    })
  },
  // 佣金收入跳转
  yjIncome:function(){
    wx.navigateTo({
      url: '/pages/yjIncome/yjIncome',
    })
  },
  // 支出记录跳转
  zcRecord:function(){
    wx.navigateTo({
      url: '/pages/zcRecord/zcRecord',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  
})