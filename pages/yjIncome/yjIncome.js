// pages/yjIncome/yjIncome.js
const CONFIG = require('../../utils/config.js')
const app = getApp()
Page({

  data: {
    page: 1,
    nohave: false,
    income:[],
    nodata: false,
  },

  onLoad: function (options) {
    this.getIncome(1); // 获取佣金收入记录
  },
  // 获取佣金收入记录
  getIncome: function (page) {
    var that = this;
    var income = that.data.income
    wx.request({
      url: CONFIG.API_URL.getIncome,
      method: 'POST',
      data: { page: page, userid: app.globalData.userInfo.id},
      success: function (res) {
        var data = res.data.data;
        if (page === 1 && data.income.length === 0) {
          that.setData({
            nodata: true
          })
        }else{
          if (data.status == 1) {
            that.setData({
              income: income.concat(data.income),
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
      income: [],
      page: 1,
    })
    this.getIncome(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page
    this.getIncome(page);
  },


})