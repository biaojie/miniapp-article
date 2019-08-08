// pages/zcRecord/zcRecord.js
const CONFIG = require('../../utils/config.js')
const app = getApp()
Page({

  data: {
    url: '',
    page: 1,
    nohave: false,
    record: [],
    nodata: false,
  },

  onLoad: function (options) {
    this.getPayRecord(1);
  },

  // 获取支出记录
  getPayRecord: function (page){
    var that = this;
    wx.request({
      url: CONFIG.API_URL.getPayRecord,
      method: 'POST',
      data: { page: page, userid: app.globalData.userInfo.id },
      success: function (res) {
        var data = res.data.data;
        if (page === 1 && data.record.length === 0) {
          that.setData({
            nodata: true
          })
        }else{
          if (data.status == 1) {
            that.setData({
              record: that.data.record.concat(data.record),
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
      record: [],
      page: 1,
    })
    this.getPayRecord(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page
    this.getPayRecord(page);
  },

})