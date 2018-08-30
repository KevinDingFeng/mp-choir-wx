// pages/myWriting/myCreate.js
const app = getApp();
var config = require('../../utils/config.js');
const song = require('../../utils/song.js')
const Lyric = require('../../utils/lyric.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
    scale: app.globalData.windowWidth / app.globalData.windowHeight,
    loginUserId: wx.getStorageSync('userId'),
    sectionList:null,
    pathPrefix: config.baseUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var s = this;
    wx.request({
      url: config.baseUrl + '/song_section/my_song_section?userId=' + s.data.loginUserId,
      success: function (res) {

        var sectionList = res.data.data;
        console.log(sectionList)
        var timer = setInterval(function () {
          for(var i =0; i<sectionList.length;i++){
            var section = sectionList[i];
            console.log(section)
            var djs = util.updateTime(section.pastTime);
            if(djs == 0){
              sectionList.splice(section, 1);
            }
            section["iMinute"] = djs.iMin;
            section["iSec"] = djs.iSec;
            section["iMs"] = (djs.iMs + '').substr(0, 2);
          }
          s.setData({
            sectionList: sectionList
          });
        }, 1000);
      }
    });
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
  
  },

  goMyWritting:function(){
    wx.navigateBack({
      delta:1
    });
  },

  goBack:function(){
    wx.navigateBack({
      delta:1
    })
  },

  goMusic: function (event){
    wx.navigateTo({
      url: '/pages/c_musice/c_musice?songName=' + event.currentTarget.dataset.songname + '&population=' + event.currentTarget.dataset.population + '&sort=' + event.currentTarget.dataset.sort,
    });
  }
})