const WxParse = require('../../utils/wxParse/wxParse.js');
const CONFIG = require('../../utils/config.js')
const app = getApp()
// pages/acticleDetails/acticleDetails.js
Page({

  data: {
    article:null,
    userInfo: null,
    collectimg: 'collect1',
    payrecord: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.pid = options.pid || null;
    var id = options.id;
    var userInfo = app.globalData.userInfo;
    if (userInfo){
      this.setData({
        articleid: id,
        userInfo: userInfo
      })
      this.getArticleDetails();
    }else{
      wx.showModal({
        title: '请先授权登录',
        content: '前往个人中心授权',
        success: function(){
          wx.switchTab({
            url: '/pages/personalCenter/personalCenter',
          })
        },
        fail: function(){
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  // 查询文章详情
  getArticleDetails: function(){
    var that = this,
      articleid = that.data.articleid,
      userInfo = that.data.userInfo;
    wx.request({
      url: CONFIG.API_URL.getArticleDetails,
      method: 'POST',
      data: { articleid: articleid, userid: userInfo.id},
      success: function (res) {
        var data = res.data.data;
        if (data.status == 1) {
          if (data.article.price == '0.00' || data.article.price == '0' || data.article.price == 'null'){
            var detail = data.article.detail;
            data.payrecord = true;
          }else{
            var detail = data.payrecord ? data.article.detail : '';
          }
          var collectimg = data.collect ? 'collect1ed' : 'collect1';
    
          that.setData({
            article: data.article,
            collectimg: collectimg,
            phone: data.phone,
            payrecord: data.payrecord
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
  // 收藏、取消收藏文章
  collect: function(){
    var that = this,
      articleid = that.data.articleid,
      userInfo = that.data.userInfo;
    wx.request({
      url: CONFIG.API_URL.collect,
      method: 'POST',
      data: { articleid: articleid, userid: userInfo.id },
      success: function(res){
        var data = res.data.data;
        if(data.status == 1){
          var collectimg = data.collect ? 'collect1ed' : 'collect1';
          that.setData({
            collectimg: collectimg
          })
          if (data.collect == 1){
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '已取消收藏',
              icon: 'success',
              duration: 2000
            })
          }
        }
      }
    })
  },
  // 购买文章
  buyArticle: function(){
    var that = this,
      article = that.data.article,
      userInfo = that.data.userInfo;
    wx.request({
      url: CONFIG.API_URL.buyArticle,
      method: 'POST',
      data: {
        userid: userInfo.id,
        openid: userInfo.openid,
        tradeNo: new Date().getTime(),
        totalFee: article.price * 100,
        detail: article.id,
        old_price: article.old_price
      },
      success: function (res) {
        wx.requestPayment({
          timeStamp: res.data.pre_data.timeStamp,
          nonceStr: res.data.pre_data.nonceStr,
          package: res.data.pre_data.package,
          signType: 'MD5',
          paySign: res.data.pre_data.paySign,
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              mask: true,
              duration: 1000,
            })
            that.getArticleDetails();
          },
          fail: function () {
            wx.showToast({
              title: '支付失败',
              icon: 'loading',
              duration: 1000,
            })
          }
        })

      }
    })
  },
  // 联系客服
  makePhone: function(){
    var phone = this.data.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
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
    var userInfo = this.data.userInfo,
      articleid = this.data.articleid;
      
    return {
      title: '共享民间特效秘方',
      path: '/pages/acticleDetails/acticleDetails?id=' + articleid + '&pid=' + userInfo.id
    }
  }
})