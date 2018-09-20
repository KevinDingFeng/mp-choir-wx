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
        picPath: '',
        song: null,
        imagePath: null,
        tempFilePath: null,
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
        wx.stopBackgroundAudio(); //停止播放
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        wx.stopBackgroundAudio(); //停止播放
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
        let title_ = config.onShareAppMessageTitle[Math.floor(Math.random() * config.onShareAppMessageTitle.length)];
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: title_,
            path: '/pages/result/result?choirId=' + that.data.song.choir.id,
        }
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
    createNewImg: function () {
        var _this = this;
        var name = _this.data.song.choir.choirName;
        var musice_name = _this.data.song.choir.songName;
        var tou = _this.data.picPath; //头像图片
        const SyntheticSongId = _this.data.song.syntheticSong.id;
        wx.request({
            url: config.baseUrl + '/syn_songs/' + SyntheticSongId + '/wxacode',
            success: function (res) {
                var rpx;
                wx.getSystemInfo({
                    success: function (res) {
                        rpx = res.windowWidth / 375;
                    },
                })


                wx.downloadFile({
                    url: res.data.data, //小程序图片
                    success(res) {
                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                        if (res.statusCode === 200) {
                        	const context = wx.createCanvasContext('resultCanvas');
                            context.setFillStyle("#fff");
                            var path = "../../images/cc.png";
                            var path1 = "../../images/c_bor.png";
                            var path2 = "../../images/share_text.png";
                            var path3 = "../../images/er_code.png";
                            context.drawImage(path, -20*rpx, 0, 400 * rpx, 500 * rpx);
                            context.drawImage(path1, 15 * rpx, 40 * rpx, 350 * rpx, 200 * rpx);
                            
                           
                            // context.drawImage(_this.data.touPicPath, 108 * rpx, 60 * rpx, 150 * rpx, 120 * rpx);


                            context.drawImage(path2, 60 * rpx, 208 * rpx, 225 * rpx, 270 * rpx);
                            context.drawImage(path3, 240 * rpx, 395 * rpx,120 * rpx, 100 * rpx);
                            context.drawImage(res.tempFilePath, 260 * rpx, 400 * rpx, 90 * rpx,85 * rpx);
                            //绘制名字
                            context.setFontSize(22 * rpx);
                            context.setFillStyle('#fff');
                            context.setTextAlign('center');
                            context.fillText(name, 150 * rpx, 265 * rpx);
                            context.stroke();
                            //绘制歌名
                            context.setFontSize(22 * rpx);
                            context.setFillStyle('#fff');
                            context.setTextAlign('center');
                            context.fillText(musice_name, 170 * rpx, 350 * rpx);
                            context.stroke();
                            _this.circleImg(context, _this.data.touPicPath, 115 * rpx, 60 * rpx, 153* rpx, 125 * rpx, 8* rpx);
                            context.draw();
                        }
                    }
                })
            }
        });
    },
    circleImg: function (ctx, img ,x, y, w, h, r) {//canvs
        ctx.beginPath()
        // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
        // 这里是使用 fill 还是 stroke都可以，二选一即可
        ctx.setFillStyle('#000')
        // ctx.setStrokeStyle('transparent')
        // 左上角
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

        // border-top
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.lineTo(x + w, y + r)
        // 右上角
        ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

        // border-right
        ctx.lineTo(x + w, y + h - r)
        ctx.lineTo(x + w - r, y + h)
        // 右下角
        ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

        // border-bottom
        ctx.lineTo(x + r, y + h)
        ctx.lineTo(x, y + h - r)
        // 左下角
        ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

        // border-left
        ctx.lineTo(x, y + r)
        ctx.lineTo(x + r, y)

        // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
        ctx.fill()
        // ctx.stroke()
        ctx.closePath()
        // 剪切
        ctx.clip();
        ctx.drawImage(img, x, y, w, h, r);
    },
    save_phone: function () { //保存手机图片
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
                                    if (res.confirm) {
                                        console.log('用户点击确定');
                                        /* 该隐藏的隐藏 */
                                        that.setData({
                                            canvasHidden: true
                                        })
                                    }
                                },
                                fail: function (res) {
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
                picPath: res.tempFilePaths[0],
                touPicPath: res.tempFilePaths[0]
              });
              // wx.downloadFile({
              //   url: res.tempFilePaths[0], //头像图片
              //   success(res) {
              //     if (res.statusCode === 200) {
              //       s.setData({
              //         touPicPath: res.tempFilePath
              //       });
              //     }
              //   }
              // })
            },
        })
    },
    fh_back: function () {
        this.setData({
            canvasHidden: true
        });
    },
    goHome: function () {
        wx.redirectTo({
            url: '/pages/index/index',
        })
    }
})