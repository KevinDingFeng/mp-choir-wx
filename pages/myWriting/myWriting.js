//logs.js
const app = getApp();
var config = require('../../utils/config.js');
const song = require('../../utils/song.js')
const Lyric = require('../../utils/lyric.js')
const util = require('../../utils/util.js')
Page({
    data: {
        logs: [],
        showView:false,
        pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
      scale: app.globalData.windowWidth / app.globalData.windowHeight,
      loginUserId: wx.getStorageSync('userId'),
      choirList: null,
      synSongList:null,
      pathPrefix: config.baseUrl
    },
    onLoad: function () {
        // this.setData({
        //     logs: (wx.getStorageSync('logs') || []).map(log => {
        //         return util.formatTime(new Date(log))
        //     })
        // })
      var s = this;
      wx.request({
        url: config.baseUrl + '/syn_songs/my_songs?userId=' + s.data.loginUserId,
        success: function (res) {
          s.setData({
            synSongList: res.data.data
          });
        }
      });
    },
    //显示/隐藏分享
    onChangeShowState:  function(){
        var _this = this;
        _this.setData({
            showView: (!_this.data.showView)
        })
    },

    goMyCreate:function(){
      wx.navigateTo({
        url: '/pages/myCreate/myCreate',
      })
    },

    goBack:function(){
      wx.navigateBack({
        delta:1
      })
    },

    goResult:function(event){
      var choirId = event.currentTarget.dataset.choir;
      wx.navigateTo({
        url: '/pages/result/result?choirId='+choirId,
      })
    }
})
