//app.js
App({
  onLaunch: function () {
    console.log('app onLaunch');
    this.globalData.ex = true;
    var sysinfo = wx.getSystemInfoSync();
    console.log(sysinfo);
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
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
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