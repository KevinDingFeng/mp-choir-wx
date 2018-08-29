//app.js
var config = require('./utils/config.js');
App({
  onLaunch: function () {
    //console.log('app onLaunch');
    var _this = this;
    
    var sysinfo = wx.getSystemInfoSync();
    //console.log(sysinfo);
    if (sysinfo) {
        this.globalData.sysinfo = sysinfo;
        var width = sysinfo.windowWidth;
        var height = sysinfo.windowHeight;
        var px2rpx = 750 / width;
        this.globalData.width = width * px2rpx + 'rpx';
        this.globalData.height = height * px2rpx + 'rpx';
        this.globalData.windowWidth = width;
        this.globalData.windowHeight = height;
    }
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //获取用户数据
          _this.login();
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
  },
  login: function(){
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('app login');
        var _this = this;
        // var token = _this.globalData.token;
        var token = wx.getStorageSync('accessToken');
        if (token) {
          _this.globalData.token = token;
        }
        wx.checkSession({
          success: function () {
            if (token) {
              console.log('token' + token);
              wx.request({
                url: config.baseUrl + '/user/checkToken',
                data: {
                  token: token
                },
                success: function (res) {
                  if (res.data.errorCode != 0) {
                    _this.globalData.token = null;
                    wx.clearStorageSync("accessToken");
                   //_this.registerUser();
                  }
                  if (res.data.errorCode != 0) {
                    wx.setStorageSync('userId', res.data.data.userId);
                  }
                }
              })
              return;
            }
            _this.registerUser();
          },
          fail: function () {
            _this.registerUser();
          }
        })
  },
  //注册用户 把用户信息同步到后台
  registerUser: function () {
    console.log('app register');
    var _this = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          success: function (res) {
            _this.globalData.userInfo = res.userInfo;
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            var signature = res.signature;
            var rawData = res.rawData;
            wx.request({
              url: config.baseUrl + '/user/login',
              data: {
                code: code,
                signature: signature,
                rawData: rawData,
                encryptedData: encryptedData,
                iv: iv
              },
              success: function (res) {
                //设置返回的3rdsession
                if (res.data.success) {
                  _this.globalData.token = res.data.data.accessToken;
                  _this.globalData.userId = res.data.data.userId;
                  try {
                    wx.setStorageSync('accessToken', res.data.data.accessToken);
                    wx.setStorageSync('userId', res.data.data.userId);
                  } catch (e) {
                  }
                  _this.login();
                }
              }
            })
          },
          fail: function (e) {
            console.log(e)
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    width: '750rpx',
    height: '1206rpx',
    //是否已经执行过， 避免index中的onload onshow 执行两次setUpGroup
    ex: false,
    selectsinger: null,//音乐相关
    currentIndex: 0,
    fullScreen: false,
    songlist: [],
    playing: false,
    innerAudioContext: null
  },
onShow: function () {
   
}
})