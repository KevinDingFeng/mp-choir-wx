// pages/result/result.js
const app = getApp()
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
      hbImagePath:null,
      canvasHidden:true,
      picPath:'../../images/picker.png',
      song:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var s = this;
    console.log(options);
    wx.request({
      url: config.baseUrl + '/syn_songs/' + options.choirId +'/detail_by_choir',
      success:function(res){
        s.setData({
          song:res.data.data
        });
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

  getHb:function(){
    this.setData({
      canvasHidden:false
    });
    const ctx = wx.createCanvasContext('resultCanvas');
    var s = this;
    var id = 1;
    wx.request({
      url: 'http://192.168.3.37:9090/syn_songs/' + id + '/wxacode',
      success: function (res) {
        wx.getImageInfo({
          src: res.data.data,
          success:function(res){
            console.log("开始导出图片");
            ctx.drawImage(res.path, 0, 0, 150, 100);
            console.log("绘制完成");
            ctx.draw(true, setTimeout(function () {
              console.log("开始导出");
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 150,
                height: 100,
                destWidth: 100,
                destHeight: 100,
                canvasId: 'resultCanvas',
                success: function (res) {
                  console.log(res.tempFilePath);
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success:function(res){
                      console.log("保存到相册成功");
                      s.setData({
                        canvasHidden: true
                      });
                    }
                  })
                },
                fail(res) {
                  console.log("fail");
                }
              });
            }, 100));
          }
        });
        
      }
    });
    
  },

  alterPic:function(){
    var s = this;
    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res);
        s.setData({
          picPath: res.tempFilePaths[0]
        });
      },
    })
  }
})