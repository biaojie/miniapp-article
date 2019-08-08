// pages/myCollect/myCollect.js
const CONFIG = require('../../utils/config.js')
const app = getApp()
Page({

  data: {
    url: '',
    page: 1,
    nohave: false,
    article: [],
    nodata: false,
  },

  onLoad: function (options) {
    var userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      this.getMyCollect(1);
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


  // 获取我的收藏
  getMyCollect: function (page){
    var that = this,
      userInfo = that.data.userInfo;
    wx.request({
      url: CONFIG.API_URL.getMyCollect,
      method: 'POST',
      data: { page: page, userid: userInfo.id },
      success: function (res) {
        var data = res.data.data;
        if (page === 1 && data.labelsarr.length === 0){
          that.setData({
            nodata: true
          })
        }else{
          if (data.status == 1) {
            that.setData({
              article: that.data.article.concat(data.labelsarr),
              page: page + 1,
              nohave: false
            })
          } else {
            that.setData({
              nohave: true
            })
          }
        }
        
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  
  // 文章详情页跳转
  acticleDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/acticleDetails/acticleDetails?id=' + id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      article: [],
      page: 1,
    })
    this.getMyCollect(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page
    this.getMyCollect(page);
  },

})