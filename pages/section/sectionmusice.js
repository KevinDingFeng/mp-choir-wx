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
    baseUrl: config.baseUrl,
    result:{
        albumArtPaht:'',
        songName: '',
        singer: '',
        choirName: '',
        population: ''
    },
    sponsor: false, //发起者标志，默认不是
    compound: false, //点击合成后弹出的窗口
    loginUserId: wx.getStorageSync('userId')
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
        url: config.baseUrl + '/song_section/get_section_song',//
        data:{
          choirId: options.choirId
        },
        success: function (res) {
          console.log(res.data)
          let resData = res.data;
          if (resData && resData.success) {
            if (resData.extraMessage){
              that.setData({
                sponsor: true
              })
            }
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
  //认领歌曲
  claim: function (event) {
    //console.log(event)
    let that = this;
    const id = event.target.dataset.id
    wx.request({
      url: config.baseUrl + '/song_section/claim',//
      data: {
        id: id,
        userId: that.data.loginUserId
      },
      success: function (res) {
        //console.log(res.data)
        let resData = res.data;
        if (resData && resData.errorCode == 0) {
          var result = that.data.result;
          var songSections = result.songSection;
          for (var i = 0; i < songSections.length; i++){
            if (songSections[i].id == id){
              songSections[i].userId = that.data.loginUserId;
              songSections[i].status = "NO_RECORDING";
            }
          }
          that.setData({
            result: result
          })
          console.log(that.data.result)
        }
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },
  //演唱
  sing: function (event){
    let that = this;
    const id = event.target.dataset.id
    wx.navigateTo({
      url: '../c_musice/c_musice?id=' + id,
    })
  },
  //合成
  compound: function() {
    let that = this;
    that.setData({
      compound: true
    })
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
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
      if (res.target.dataset.sharevalue){
        wx.navigateTo({
          url: '../result/result',
        })
      }
      that.setData({
        sponsor: false
      })
    }
    return {
      title: "",
      path: '/pages/section/sectionmusice'
    }
  }
})