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
      sectionList: null,
      pathPrefix: config.baseUrl,
      ds_type: true,
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
      wx.request({
        url: config.baseUrl + '/song_section/my_song_section?userId=' + s.data.loginUserId,
        success: function (res) {
          s.setData({
            sectionList: res.data.data
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

  // 点击我的作品
  goMyCreate: function () {
    var _this = this;
    _this.setData({
      ds_type: true
    })
  },
  //点击正在创作
  goMyWritting: function () {
    var _this = this;
    _this.setData({
      ds_type: false
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
    },

    removedSong:function(event){
      var s = this;
      var id = event.currentTarget.dataset.id;
      wx.showModal({
        title: '提示',
        content: '确认删除',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: config.baseUrl + '/syn_songs/remove/' + id,
              success: function (res) {
                wx.request({
                  url: config.baseUrl + '/syn_songs/my_songs?userId=' + s.data.loginUserId,
                  success: function (res) {
                    s.setData({
                      synSongList: res.data.data
                    });
                  }
                });
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    },

  goMusic: function (event) {
    wx.navigateTo({
      url: '/pages/c_musice/c_musice?songName=' + event.currentTarget.dataset.songname + '&population=' + event.currentTarget.dataset.population + '&sort=' + event.currentTarget.dataset.sort,
    });
  }
})
