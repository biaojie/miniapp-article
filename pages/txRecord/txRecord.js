// pages/txRecord/txRecord.js
const CONFIG = require('../../utils/config.js')
const app = getApp()
Page({

  data: {
    page: 1,
    nohave: false,
    record:[],
    nodata: false,
  },

  onLoad: function (options) {
    this.txRecord(1); // 提现记录查询
  },

  // 提现记录查询
  txRecord: function(page){
    var that = this,
      record = that.data.record,
      userInfo = app.globalData.userInfo;
    wx.request({
      url: CONFIG.API_URL.txRecord,
      method: 'POST',
      data: { page: page, openid: userInfo.openid },
      success: function (res) {
        var data = res.data.data;
        if (page === 1 && data.record.length === 0) {
          that.setData({
            nodata: true
          })
        }else{
          if (data.status == 1) {
            that.setData({
              record: record.concat(data.record),
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
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      record: [],
      page: 1,
    })
    this.txRecord(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page
    this.txRecord(page);
  },


})