//logs.js
const app = getApp();
var config = require('../../utils/config.js');
const song = require('../../utils/song.js')
const Lyric = require('../../utils/lyric.js')
const util = require('../../utils/util.js')
var timer;
Page({
    data: {
        logs: [],
        showView: false,
        pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
        scale: app.globalData.windowWidth / app.globalData.windowHeight,
        //loginUserId: wx.getStorageSync('userId'),
        choirList: null,
        synSongList: null,
        sectionList: null,
        pathPrefix: config.baseUrl,
        ds_type: true,
        bj_img: config.bg_img + "/02bg.png"
    },
    onLoad: function () {
        // this.setData({
        //     logs: (wx.getStorageSync('logs') || []).map(log => {
        //         return util.formatTime(new Date(log))
        //     })
        // })
        var s = this;
        wx.request({
            url: config.baseUrl + '/syn_songs/my_songs?userId=' + wx.getStorageSync('userId'),
            success: function (res) {
                let _data = res.data.data;
                for (var i = 0; i < _data.length;i++){
                    _data[i].b_img ="../../images/section/muscie_f.png",
                    _data[i].b_type = "1",
                    _data[i].b_show = false
                }
                s.setData({
                    synSongList: _data
                });
            }
        });
        wx.request({
            url: config.baseUrl + '/song_section/my_song_section?userId=' + wx.getStorageSync('userId'),
            success: function (res) {
                var sectionList = res.data.data;
                //console.log(sectionList)
                if (sectionList) {
                    timer = setInterval(function () {
                        for (var i = 0; i < sectionList.length; i++) {
                            var section = sectionList[i];
                            //console.log(section)
                            var djs = util.updateTime(section.pastTime);
                            if (djs == 0) {
                                sectionList.splice(section, 1);
                            }
                            section["iMinute"] = djs.iMin;
                            section["iSec"] = djs.iSec;
                            //section["iMs"] = (djs.iMs + '').substr(0, 2);
                        }
                        s.setData({
                            sectionList: sectionList
                        });
                    }, 1000);
                }
            }
        });
    },
    //显示/隐藏分享
    onChangeShowState: function (event) {
        var _this = this;
        let _id = event.currentTarget.dataset.id;
        let _type = event.currentTarget.dataset.type;
        let _arr = _this.data.synSongList;
        if (_type == true){
            for (var i = 0; i < _arr.length; i++) {
                if (_arr[i].id == _id) {
                    _arr[i].b_show = false;
                }
            }
        }else{
            for (var i = 0; i < _arr.length; i++) {
                if (_arr[i].id == _id) {
                    _arr[i].b_show = true;
                } else {
                    _arr[i].b_show = false;
                }
            }
        }
        _this.setData({
            synSongList: _arr
        });
    },
    //显示/隐藏分享1
    onChangeShowState1: function (event) {
        var _this = this;
        let _id = event.currentTarget.dataset.id;
        let _type = event.currentTarget.dataset.type;
        let _arr = _this.data.synSongList;
        for (var i = 0; i < _arr.length; i++) {
            _arr[i].b_show = false;
        }
        _this.setData({
            synSongList: _arr
        });
    },
    //播放音乐
    t_musice: function (event){
        let that = this;
        let currId = event.currentTarget.dataset.id;
        let _type = event.currentTarget.dataset.type;
        if (_type == "1") {
            let _path = event.target.dataset.path;
            wx.playBackgroundAudio({
                dataUrl: config.baseUrl + "/f/" +_path,
                title: "111"
            })
            // 监听音乐停止。
            wx.onBackgroundAudioStop(() => {
                //停止录音
                let _arr = that.data.synSongList;
                for (var i = 0; i < _arr.length; i++) {
                    if (_arr[i].id == currId) {
                        _arr[i].b_img = "../../images/section/muscie_f.png";
                        _arr[i].b_type = "1";
                    }
                }
                that.setData({
                    synSongList: _arr
                })
            })
            let _arr = that.data.synSongList;
            for (var i = 0; i < _arr.length; i++) {
                if (_arr[i].id == currId) {
                    _arr[i].b_img = "../../images/section/muscie_t.png";
                    _arr[i].b_type = "2";
                } else {
                    _arr[i].b_img = "../../images/section/muscie_f.png";
                    _arr[i].b_type = "1";
                }
            }
            that.setData({
                synSongList: _arr
            })
        }else{
            let _arr = that.data.synSongList;
            wx.pauseBackgroundAudio();
            for (var i = 0; i < _arr.length; i++) {
                // if (array.songSection[i].id == currId) {
                _arr[i].b_img = "../../images/section/muscie_f.png";
                _arr[i].b_type = "1";
                // }
            }
            that.setData({
                synSongList: _arr
            })
        }
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

    goBack: function () {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    },

    goResult: function (event) {
        var choirId = event.currentTarget.dataset.choir;
        wx.redirectTo({
            url: '/pages/result/result?choirId=' + choirId,
        })
    },

    removedSong: function (event) {
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
                                url: config.baseUrl + '/syn_songs/my_songs?userId=' + wx.getStorageSync('userId'),
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
        // wx.navigateTo({
        //   url: '/pages/c_musice/c_musice?songName=' + event.currentTarget.dataset.songname + '&population=' + event.currentTarget.dataset.population + '&sort=' + event.currentTarget.dataset.sort,
        // });
        wx.setStorageSync('myWriting', 'myWriting');
        wx.redirectTo({
            url: '/pages/section/sectionmusice?choirId=' + event.currentTarget.dataset.choirid,
        })
    },
  gotoIndex:function (){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
    // 生命周期函数--监听页面显示
    onShow: function () {
        let that =this;
        var sectionList = that.data.sectionList;
        if (sectionList) {
            timer = setInterval(function () {
                for (var i = 0; i < sectionList.length; i++) {
                    var section = sectionList[i];
                    //console.log(section)
                    var djs = util.updateTime(section.pastTime);
                    if (djs == 0) {
                        sectionList.splice(section, 1);
                    }
                    section["iMinute"] = djs.iMin;
                    section["iSec"] = djs.iSec;
                    //section["iMs"] = (djs.iMs + '').substr(0, 2);
                }
                that.setData({
                    sectionList: sectionList
                });
            }, 1000);
        }
    },
    onHide: function () {
        clearInterval(timer);
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        clearInterval(timer);
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            //console.log(res.target)
            if (res.target.dataset.sharevalue) {
                wx.redirectTo({
                    url: '/pages/result/result',
                })
            }
            that.setData({
                sponsor: false
            })
        }
        return {
          title: config.onShareAppMessageTitle[Math.floor(Math.random() * config.onShareAppMessageTitle.length)],
            path: '/pages/section/sectionmusice?choirId=' + that.data.choirId
        }
    }
})
