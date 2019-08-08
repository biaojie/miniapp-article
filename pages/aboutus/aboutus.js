const WxParse = require('../../utils/wxParse/wxParse.js');
const CONFIG = require('../../utils/config.js')
const app = getApp()
// pages/acticleDetails/acticleDetails.js
Page({

  data: {
    article: null,
    userInfo: null,
    collectimg: 'collect1',
    payrecord: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    if (id ) {
      this.setData({
        articleid: id,
      })
      this.getArticleDetails();
    } 
  },
  // 查询文章详情
  getArticleDetails: function () {
    var that = this,
      articleid = that.data.articleid;
    wx.request({
      url: CONFIG.API_URL.getArticleDetails,
      method: 'POST',
      data: { articleid: articleid, userid: 0 },
      success: function (res) {
        var data = res.data.data;
        if (data.status == 1) {
            var detail = data.article.detail;
          that.setData({
            article: data.article,
          })
          WxParse.wxParse('detail', 'html', detail, that, 25);
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
    this.getArticleDetails();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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