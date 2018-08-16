//logs.js
const util = require('../../utils/util.js')
const app = getApp();
Page({
    data: {
        logs: [],
        showView:false,
        pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
        scale: app.globalData.windowWidth / app.globalData.windowHeight,
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return util.formatTime(new Date(log))
            })
        })
    },
    //显示/隐藏分享
    onChangeShowState:  function(){
        var _this = this;
        _this.setData({
            showView: (!_this.data.showView)
        })
    }
})
