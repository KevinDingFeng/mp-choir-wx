// pages/section/sectionmusice.js
var config = require('../../utils/config.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
    scale: app.globalData.windowWidth / app.globalData.windowHeight,
    baseUrl: config.baseUrl + 'f/',
    result:[{
      choir:{
        albumArtPaht:'',
        songName: '',
        singer: '',
        choirName: '',
        population: ''
      }
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.choirId) {
      that.setData({
        choirId: options.choirId
      })

      wx.request({
        url: config.baseUrl + 'song_section/get_section_song',//
        data:{
          choirId: options.choirId
        },
        success: function (res) {
          console.log(res.data)
          let resData = res.data;
          if (resData && resData.success) {
            let data = resData.data;
            that.setData({
              result: data
            })
          }
        },
        fail: function (e) {
          console.log(e);
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  goback:function(){
    let that = this;
    wx.navigateTo({
      url: '../choose/choosemusice?choirId=' + that.data.choirId+'&section=1',
    })
  },
  createAudio: function (event) {
    //console.log(event)
    const audioUrl = event.target.dataset.path
    const backgroundAudioManager = wx.getBackgroundAudioManager()

    // backgroundAudioManager.title = '此时此刻'
    // backgroundAudioManager.epname = '此时此刻'
    // backgroundAudioManager.singer = '许巍'
    backgroundAudioManager.src = audioUrl // 设置了 src 之后会自动播放
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
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
  
  }
})