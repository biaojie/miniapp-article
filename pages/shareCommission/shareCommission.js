// pages/shareCommission/shareCommission.js
const CONFIG = require('../../utils/config.js')
const app = getApp()
Page({

  data: {
    qrcode:'',
    url: '',
  },

  onLoad: function (options) {
    var userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      this.getEWM();
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

  getEWM: function(){
    var that = this;
    var userInfo = that.data.userInfo;
    wx.request({
      url: CONFIG.API_URL.getEWM,
      method: 'GET',
      data: {
        userid: userInfo.id,
        openid: userInfo.openid
      },
      success: function(res){
        that.setData({
          qrcode: res.data.data.qrcode
        })
      }
    })
  },
  // 预览二维码
  previmg: function () {
    var urls = [this.data.url + this.data.qrcode];

    wx.previewImage({
      current: this.data.qrcode, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 保存到手机
  savePhone: function(){
    var that = this;
    wx.downloadFile({
      url: that.data.url + that.data.qrcode,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res)
          },
          fail: function (res) {
            console.log(res)
            console.log('fail')
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    })

  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var userInfo = this.data.userInfo
    return {
      title: '共享民间特效秘方',
      path: '/pages/index/index?pid=' + userInfo.id
    }
  }
})