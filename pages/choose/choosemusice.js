// pages/choose/choosemusice.js
var config = require('../../utils/config.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
        scale: app.globalData.windowWidth / app.globalData.windowHeight,
        result: []
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
        }

        wx.request({
            url: config.baseUrl + '/choosemusice/get_musice',//
            success: function (res) {
                //console.log(res.data)
                let resData = res.data;
                if (resData && resData.errorCode == 0) {
                    let data = resData.data;
                    for (var i = 0; i < data.length; i++) {
                        data[i].bf_img = "s_ting.png";
                        data[i].bf_type = "1";
                    }
                    that.setData({
                        result: data
                    })
                }
            },
            fail: function (e) {
                console.log(e);
            }
        })
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
    //试听
    createAudio: function (event) {
        
        const audioUrl = event.target.dataset.path

        // const backgroundAudioManager = wx.getBackgroundAudioManager()

        // // backgroundAudioManager.title = '此时此刻'
        // // backgroundAudioManager.epname = '此时此刻'
        // // backgroundAudioManager.singer = '许巍'
        // backgroundAudioManager.src = audioUrl // 设置了 src 之后会自动播放
        wx.playBackgroundAudio({
            dataUrl: audioUrl,
            titel:"1"
        })
        let that = this;
        //console.log(event)
        let _cc = event.currentTarget.dataset.id;
        let _type = event.currentTarget.dataset.type;
        if (_type == "1") {
            let array = that.data.result;
            for (var i = 0; i < array.length; i++) {
                if (array[i].id == _cc) {
                    array[i].bf_img = "zs_ting.png";
                    array[i].bf_type = "2";
                }
            }
            that.setData({
                result: array
            })
        } else {
            let array = that.data.result;
            wx.getBackgroundAudioPlayerState({
                success: function (res) {
                    var status = res.status
                    if (status == 1) {
                        wx.pauseBackgroundAudio()
                    } else {
                        wx.playBackgroundAudio()
                    }
                }
            })
            for (var i = 0; i < array.length; i++) {
                if (array[i].id == _cc) {
                    array[i].bf_img = "s_ting.png";
                    array[i].bf_type = "1";
                }
            }
            that.setData({
                result: array
            })
        }
    },
    //点唱
    toSectionMusice: function (event) {
        let that = this;
        wx.stopBackgroundAudio();//停止播放
        const dataSet = event.target.dataset;
        wx.request({
            url: config.baseUrl + '/split/splitSong',//
            data: {
                id: that.data.choirId,
                songName: dataSet.songname,
                singer: dataSet.singer,
                TSID: dataSet.tsid
            },
            success: function (res) {
                //console.log(res.data)
                let resData = res.data;
                if (resData && resData.success) {
                    wx.navigateTo({
                        url: '../section/sectionmusice?choirId=' + that.data.choirId,
                    })
                }
            },
            fail: function (e) {
                console.log(e);
            }
        })
    },
    goback: function () {
        wx.navigateTo({
            url: '../user/user',
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
    onShareAppMessage: function () {

    }
})