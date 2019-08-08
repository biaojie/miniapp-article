const WxParse = require('../../utils/wxParse/wxParse.js');
const CONFIG = require('../../utils/config.js')
const app = getApp()
// pages/acticleDetails/acticleDetails.js
Page({

  data: {
    url: '',
    page: 1,
    nohave: false,
    article: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    if (id) {
      this.setData({
        id: id,
      })
      this.getClassifyList(1);
    }
  },
  // 查询分类文章列表
  getClassifyList: function (page) {
    var that = this,
      id = that.data.id;
    wx.request({
      url: CONFIG.API_URL.getClassifyList,
      method: 'POST',
      data: { page: page, id: id },
      success: function (res) {
        var data = res.data.data;
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
    this.getClassifyList(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page
    this.getClassifyList(page);
  },

})