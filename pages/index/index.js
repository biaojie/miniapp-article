// pages/website/website.js
const CONFIG = require('../../utils/config.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular:true,
    sub: null,
    article: [],
    url: '',
    page: 1,
    nohave:false,
    broadcast:null,
    aboutus:[],
    cinfo:[],
  },

  onLoad: function (options) {
    app.globalData.pid = options.pid;
    this.getHeight(); // 获取轮播图高度
    this.getClassify(); //获取分类
    this.getBroadcast()  //获取轮播图

    
    this.getRecommend(1); // 获取推荐文章
  },
  onShow: function () {

  },
  // 获取推荐文章、电话、fbfh
  getRecommend: function(page) {
    var that = this;
    var article = that.data.article;
    var aboutus = that.data.aboutus
    wx.request({
      url: CONFIG.API_URL.getRecommend,
      method: 'GET',
      data: { page: page },
      success: function(res){
        var data = res.data.data;
        // console.log(data,'datadatadatadata')
        var videostr = data.video.detail;
        var videoUrl = '';
        if (videostr){
          var reg = /http:\/\/dzay.com[\w|\W]+mp4/;
          var videoUrl = reg.exec(videostr)[0];
        }
        
        if (data.status == 1) {
          that.setData({
            article: article.concat(data.labelsarr),
            page: page + 1,
            nohave: false,
            aboutus: aboutus.concat(data.aboutus),
            cinfo: data.cinfo,
            videoUrl: videoUrl
          })
        }else{
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
  // 获取分类
  getClassify: function () {
    var that = this;
    wx.request({
      url: CONFIG.API_URL.getClassify,
      method: 'GET',
      success: function (res) {
        var data = res.data.data;
        if(data.status == 1){
          that.setData({
            sub: data.classify
          })
        }
      }
    })
  },
  // 获取轮播图
  getBroadcast: function(){
    var that = this;
    wx.request({
      url: CONFIG.API_URL.getBroadcast,
      method: 'GET',
      success: function (res) {
        var data = res.data.data;
        if (data.status == 1) {
          that.setData({
            broadcast: data.broadcast
          })
        }
      }
    })
  },
  // 获取轮播图高度
  getHeight: function(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var width = res.windowWidth
        var height = width / 2
        that.setData({
          height: height
        })
      }
    })
  },
  // 拔打电话
  makePhone: function(){
    var phone = this.data.cinfo.mphone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  // 分类跳转页
  classify: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/classify/classify?id='+id,
    })
  },
  
  // 文章详情页跳转
  acticleDetails: function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/acticleDetails/acticleDetails?id='+id
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
    this.getRecommend(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page
    this.getRecommend(page);
  },

  onShareAppMessage: function(){
    return {
      title: '共享民间特效秘方',
      path: '/pages/index/index'
    }
  }

})