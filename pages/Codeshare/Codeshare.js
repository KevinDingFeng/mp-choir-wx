// pages/Codeshare/Codeshare.js
const app = getApp()
var config = require('../../utils/config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
        scale: app.globalData.windowWidth / app.globalData.windowHeight,
        bj_img: config.bg_img + "/04bg.png",
        b_img: "../../images/section/muscie_f.png",
        b_type: "1"
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
                wx.downloadFile({
                    url: config.baseUrl + "/f/" + res.data.data.choir.albumArtPaht, //头像图片
                    success(res) {
                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                        if (res.statusCode === 200) {
                            s.setData({
                                touPicPath: res.tempFilePath
                            });
                        }
                    }
                })
            }
        });
    },
    /**
       * 听取合唱作品
       */
    createAudio: function (event) {
        let that = this;
        let _type = event.currentTarget.dataset.type;
        if (_type == "1") {
            wx.playBackgroundAudio({
                dataUrl: config.baseUrl + "/f/" + that.data.song.syntheticSong.songPath,
                title: "111"
            })
            wx.onBackgroundAudioStop(() => {
                //停止录音
                that.setData({
                    b_img: "../../images/section/muscie_f.png"
                })
            })
            that.setData({
                b_img: "../../images/section/muscie_t.png",
                b_type: "2",
            })
        } else {
            wx.pauseBackgroundAudio();
            that.setData({
                b_img: "../../images/section/muscie_f.png",
                b_type: "1",
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