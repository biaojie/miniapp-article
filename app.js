//app.js
const CONFIG = require('/utils/config.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    this.userLogin(function () { });
    
    
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // this.userLogin(function(){})
  },
  //获取用户授权信息
  userLogin: function (callback = function () { }) {
    var that = this
    //1、调用微信登录接口，获取code
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: CONFIG.API_URL.getSession,//自己的服务接口地址
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  code: code,
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
                  gender: res.userInfo.gender,
                  pid: that.globalData.pid
                },
                success: function (res) {
                  //4.解密成功后 获取自己服务器返回的结果
                  if (res.data.data.status == 1) {
                    var userInfo_ = res.data.data.userInfo;
                    wx.setStorageSync('userInfo', userInfo_)
                    that.globalData.userInfo = userInfo_;
                    //查找权限
                    // that.getUserAuth(userInfo_.id); 

                    callback(userInfo_);
                  } else {
                    console.log('解密失败')
                  }

                },
                fail: function () {
                  console.log('系统错误')
                }
              })
            },
            fail: function () {
              that.userLogin(callback)
            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function () {
        console.log('登陆失败')
      }
    })
  },

  
  globalData: {
    userInfo: null,
    pid:null
  }
})