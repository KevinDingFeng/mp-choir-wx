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
        result: {
            albumArtPaht: '',
            songName: '',
            singer: '',
            choirName: '',
            population: '',
            songSection: null
        },
        musice_type: "",
        sponsor: false, //发起者标志，默认不是
        compound: false, //点击合成后弹出的窗口
        //loginUserId: wx.getStorageSync('userId'),
        bj_img: config.bg_img + "/04bg.png",
        cou_peo: true,  //人数不够点我来凑
        ifclaim:false //是否认领标志
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        if (options.choirId) {
            that.setData({
              choirId: options.choirId,
              loginUserId: wx.getStorageSync('userId')
            })
          this.getSectionSong();
        }
    },
  /**
   * 根据成团id获取分段歌曲，发起者用于点唱
   */
  getSectionSong: function () {
    let that = this;
    wx.request({
      url: config.baseUrl + '/song_section/get_section_song', //
      data: {
        choirId: that.data.choirId
      },
      success: function (res) {
        console.log(res.data)
        let couPeo = false;
        let resData = res.data;
        if (resData && resData.success) {
          if (resData.data.users[0].id == wx.getStorageSync('userId')) {
            that.setData({
              sponsor: true
            })
          } else {
            that.setData({
              renlingzhe: true
            })
          }
          let data = resData.data;
          for (var i = 0; i < data.songSection.length; i++) {
            data.songSection[i].bf_img = "muscie_f.png";
            data.songSection[i].bf_type = "1";
            if (data.songSection[i].status == "NO_CLAIM") {
              couPeo = true;
            }
            if (data.songSection[i].userId == wx.getStorageSync('userId')) {//已经认领过
              that.setData({
                ifclaim: true
              })
            }
          }
          if (couPeo) {
            that.setData({
              cou_peo: true
            })
          } else {
            that.setData({
              cou_peo: false
            })
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
        let that = this;
        let array = that.data.result;
        if (array.length) {
            for (var i = 0; i < array.songSection.length; i++) {
                array.songSection[i].bf_img = "muscie_f.png";
                array.songSection[i].bf_type = "1";
            }
            that.setData({
                result: array
            })
        }

    },
    goback: function () {
        let that = this;
        var scene = wx.getStorageSync('scene');
        if (scene && (scene != 1001)) {
            wx.removeStorageSync("scene");
            wx.redirectTo({
                url: '/pages/index/index',
            })
            return
        }
        if (wx.getStorageSync('myWriting')) {
            wx.removeStorageSync("myWriting");
            wx.redirectTo({
                url: '/pages/myWriting/myWriting',
            })
            return
        }
        wx.redirectTo({
            url: '/pages/choose/choosemusice?choirId=' + that.data.choirId + '&section=1',
        })
    },
    gohome: function () {
        wx.removeStorageSync("myWriting");
        wx.redirectTo({
            url: '/pages/index/index',
        })
    },
    createAudio: function (event) {
        let that = this;
        let currId = event.currentTarget.dataset.id;
        let _type = event.currentTarget.dataset.type;
        if (_type == "1") {
            const audioUrl = event.target.dataset.path
            wx.playBackgroundAudio({
                dataUrl: audioUrl,
                title: "111"
            })
            wx.onBackgroundAudioStop(() => {
                //停止录音
                let array = that.data.result;
                for (var i = 0; i < array.songSection.length; i++) {
                    if (array.songSection[i].id == currId) {
                        array.songSection[i].bf_img = "muscie_f.png";
                        array.songSection[i].bf_type = "1";
                    }
                }
                that.setData({
                    result: array
                })
            })
            let array = that.data.result;
            for (var i = 0; i < array.songSection.length; i++) {
                if (array.songSection[i].id == currId) {
                    array.songSection[i].bf_img = "muscie_t.png";
                    array.songSection[i].bf_type = "2";
                } else {
                    array.songSection[i].bf_img = "muscie_f.png";
                    array.songSection[i].bf_type = "1";
                }
            }
            that.setData({
                result: array
            })
        } else {
            let array = that.data.result;
            wx.pauseBackgroundAudio();
            for (var i = 0; i < array.songSection.length; i++) {
                // if (array.songSection[i].id == currId) {
                array.songSection[i].bf_img = "muscie_f.png";
                array.songSection[i].bf_type = "1";
                // }
            }
            that.setData({
                result: array
            })
        }
    },
    //认领歌曲
    claim: function (event) {
      //console.log(event)
      let that = this;
      if(that.data.ifclaim){
        wx.showModal({
          title: '提示',
          content: "歌曲已认领赶紧演唱哦",
          showCancel: false,
          success: function (res) {
            that.getSectionSong();
          }
        });
        return
      }
      if (event.detail.errMsg == "getUserInfo:ok") {
        if (!app.globalData.userInfo || !wx.getStorageSync('userId')) {
          //获取用户数据
          app.login();
        }
        const id = event.target.dataset.id;
        // wx.stopBackgroundAudio(); //停止播放
        wx.request({
          url: config.baseUrl + '/song_section/claim', //
          data: {
            id: id,
            userId: wx.getStorageSync('userId'),
            avatarUrl: app.globalData.userInfo.avatarUrl
          },
          success: function (res) {
            //console.log(res.data)
            let resData = res.data;
            if (resData && resData.errorCode == 0) {
              if (resData.extraMessage) {
                wx.showModal({
                  title: '提示',
                  content: "歌曲已认领赶紧演唱哦",
                  showCancel: false,
                  success: function (res) {
                    that.getSectionSong();
                  }
                });
                return
              }
              that.getSectionSong();
            }
          },
          fail: function (e) {
            console.log(e);
          }
        })
      }
    },
    //演唱
    sing: function (event) {
        let that = this;
        let array = that.data.result;
        for (var i = 0; i < array.songSection.length; i++) {
            // if (array.songSection[i].id == currId) {
            array.songSection[i].bf_img = "muscie_f.png";
            array.songSection[i].bf_type = "1";
            // }
        }
        that.setData({
            result: array
        })
        const id = event.target.dataset.id;
        const name = event.target.dataset.name;
        const population = event.target.dataset.population;
        const sort = event.target.dataset.sort;
        const choirid = event.target.dataset.choirid;
        wx.redirectTo({
            url: '/pages/c_musice/c_musice?name=' + name + "&population=" + population + "&sort=" + sort + "&id=" + id + "&choirid=" + choirid,
        })
    },
    //合成
    compound: function () {
        let that = this;
        that.setData({
            compound: true
        })
    },
    zt_musice: function () {
        wx.pauseBackgroundAudio()
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        wx.stopBackgroundAudio();//停止播放
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        wx.stopBackgroundAudio();//停止播放
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.getSectionSong();
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
            let array = that.data.result;
            for (var i = 0; i < array.songSection.length; i++) {
                // if (array.songSection[i].id == currId) {
                array.songSection[i].bf_img = "muscie_f.png";
                array.songSection[i].bf_type = "1";
                // }
            }
            that.setData({
                result: array
            })
            wx.stopBackgroundAudio();//停止播放
            // 来自页面内转发按钮
            //console.log(res.target)
            if (res.target.dataset.sharevalue) {
                let array = that.data.result;
                for (var i = 0; i < array.songSection.length; i++) {
                    // if (array.songSection[i].id == currId) {
                    array.songSection[i].bf_img = "muscie_f.png";
                    array.songSection[i].bf_type = "1";
                    // }
                }
                that.setData({
                    result: array
                })
                wx.stopBackgroundAudio();//停止播放
                wx.request({
                    url: config.baseUrl + '/syn_songs/compound', //
                    data: {
                        choirId: that.data.choirId
                    },
                    success: function (res) {
                        console.log(res.data)
                        let resData = res.data;
                        if (resData && resData.success) {
                            wx.redirectTo({
                                url: '/pages/result/result?choirId=' + that.data.choirId,
                            })
                        }
                    },
                    fail: function (e) {
                        console.log(e);
                    }
                })
            }
            that.setData({
              sponsor: false,
              renlingzhe: true
            })
        } else {
            return {
                title: "",
                path: '/pages/index/index'
            }
        }
    }
})