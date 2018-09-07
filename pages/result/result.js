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
        hbImagePath: null,
        canvasHidden: true,
        picPath: '../../images/picker.png',
        song: null,
        imagePath:null,
        tempFilePath:null,
        bj_img: config.bg_img + "/04bg.png"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var s = this;
        console.log(options);
        wx.request({
            url: config.baseUrl + '/syn_songs/' + options.choirId + '/detail_by_choir',
            success: function (res) {
                s.setData({
                    song: res.data.data,
                    picPath: config.baseUrl + "/f/" + res.data.data.choir.albumArtPaht,

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
        let _this = this;
        path: _this.data.tempFilePath;
    },

    getHb: function () {
        var that = this;
        wx.showToast({
            title: '生成中...',
            icon: 'loading',
            duration: 5000
        });
        setTimeout(function () {
            that.createNewImg();
            that.setData({
                canvasHidden: false
            });
        }, 1000)
        

    },
    createNewImg:function(){
        var _this = this;
        var name = _this.data.song.choir.choirName; 
        var musice_name = _this.data.song.choir.songName;
        var tou = _this.data.picPath;//头像图片
      const SyntheticSongId = _this.data.song.syntheticSong.id;
        wx.request({
          url: config.baseUrl + '/syn_songs/' + SyntheticSongId+'/wxacode',
            success: function (res) {
                var _code = res.data.data;
                const context = wx.createCanvasContext('resultCanvas');
                context.setFillStyle("#fff");
                var path = "../../images/cc.png";
                var path1 = "../../images/c_bor.png";
                var path2 = "../../images/share_text.png";
                var path3 = "../../images/er_code.png";
                context.drawImage(path, 0, 0, 330, 500);
                context.drawImage(path1, 15, 40, 330, 200);
                context.drawImage(tou, 112, 62, 140, 120);
                context.drawImage(path2, 80, 215, 200, 250);
                context.drawImage(path3, 240, 410, 90, 80);
                context.drawImage(_code, 260, 415, 60, 65);
                //绘制名字
                context.setFontSize(24);
                context.setFillStyle('#fff');
                context.setTextAlign('center');
                context.fillText(name, 150, 270);
                context.stroke();
                //绘制歌名
                context.setFontSize(24);
                context.setFillStyle('#fff');
                context.setTextAlign('center');
                context.fillText(musice_name, 180, 350);
                context.stroke();
                context.draw();
            }
        });
    },
    save_phone:function(){//保存手机图片
        var that = this
        setTimeout(function () {
            wx.canvasToTempFilePath({
                canvasId: 'resultCanvas',
                success: function (res) {
                    var tempFilePath = res.tempFilePath;
                    that.setData({
                        tempFilePath: tempFilePath
                    })
                    wx.saveImageToPhotosAlbum({
                        filePath: tempFilePath,
                        success(res) {
                            wx.showModal({
                                content: '图片已保存到相册，赶紧晒一下吧~',
                                showCancel: false,
                                confirmText: '好的',
                                confirmColor: '#333',
                                success: function (res) {
                                    debugger
                                    if (res.confirm) {
                                        console.log('用户点击确定');
                                        /* 该隐藏的隐藏 */
                                        that.setData({
                                            canvasHidden: true
                                        })
                                    }
                                }, fail: function (res) {
                                    console.log(11111)
                                }
                            })
                        }
                    })
                },
                fail: function (res) {
                    console.log(res);
                }
            });
        }, 200);
    },

    alterPic: function () {
        var s = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {
                console.log(res);
                s.setData({
                    picPath: res.tempFilePaths[0]
                });
            },
        })
    },
    fh_back:function(){
        this.setData({
            canvasHidden: true
        });
    },
    goHome: function () {
        wx.navigateTo({
            url: '../index/index',
        })
    }
})