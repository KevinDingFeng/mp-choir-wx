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
        song: null
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
                    picPath: config.baseUrl + "/f/" + res.data.data.choir.albumArtPaht
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
        const context = wx.createCanvasContext('resultCanvas');
        let _this = this;
        context.setFillStyle("#fff");
        var path = "../../images/cc.png";
        var path1 = "../../images/c_bor.png";
        var path2 = "../../images/share_text.png";
        var path3 = "../../images/er_code.png";
        var _code = "../../images/two_code.png";
        let name = "1111";// _this.data.song.choir.choirName
        let musice_name = "2222";// _this.data.song.choir.choirName
        var tou = _this.data.picPath;//头像图片
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
        //绘制歌名
        context.setFontSize(24);
        context.setFillStyle('#fff');
        context.setTextAlign('center');
        context.fillText(musice_name, 180, 350);
        context.stroke();
        context.draw();
        var id = 1;
        wx.request({
            url: config.baseUrl + '/syn_songs/1/wxacode',
            success: function (res) {
                debugger
                // wx.getImageInfo({
                //     src: res.data.data,
                //     success: function (res) {
                //         debugger
                //         console.log("开始导出图片");
                //         ctx.drawImage(res.path, 0, 0, 150, 100);
                //         console.log("绘制完成");
                //         // ctx.draw(true, setTimeout(function () {
                //         //     console.log("开始导出");
                //         //     wx.canvasToTempFilePath({
                //         //         x: 0,
                //         //         y: 0,
                //         //         width: 150,
                //         //         height: 100,
                //         //         destWidth: 100,
                //         //         destHeight: 100,
                //         //         canvasId: 'resultCanvas',
                //         //         success: function (res) {
                //         //             console.log(res.tempFilePath);
                //         //             wx.saveImageToPhotosAlbum({
                //         //                 filePath: res.tempFilePath,
                //         //                 success: function (res) {
                //         //                     console.log("保存到相册成功");
                //         //                     s.setData({
                //         //                         canvasHidden: true
                //         //                     });
                //         //                 }
                //         //             })
                //         //         },
                //         //         fail(res) {
                //         //             console.log("fail");
                //         //         }
                //         //     });
                //         // }, 100));
                //     }
                // });
            }
        });
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