// pages/c_musice/c_musice.js
const app = getApp();
var config = require('../../utils/config.js');
const song = require('../../utils/song.js')
const Lyric = require('../../utils/lyric.js')
const util = require('../../utils/util.js')

const SEQUENCE_MODE = 1
const RANDOM_MOD = 2
const SINGLE_CYCLE_MOD = 3

var recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lz_type: true,
    pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
    scale: app.globalData.windowWidth / app.globalData.windowHeight,
    playurl: '',
    team_name: "",
    playIcon: 'icon-play',
    cdCls: 'pause',
    currentLyric: null, //歌词
    currentLineNum: 0,
    toLineNum: -1,
    currentSong: null,
    dotsArray: new Array(2),
    currentDot: 0,
    playMod: SEQUENCE_MODE,
    currentTime: "0:00",
    percent: "",
    recodePath: null,
    isRecode: false,
    sectionId: null,
    backgroundMusic: null,
    timer: '',//定时器名字
    countDownNum: '3',//倒计时初始值
    is_show: true,
    bj_img: config.bg_img + "/04bg.png",
    b_img: "../../images/c_musice/bf.png",
    b_type: "1",
    buttonFlag: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.id) {
      that.setData({
        sectionId: options.id,
        choirId: options.choirid
      })
    }
    wx.request({
      url: config.baseUrl + '/background_music/get_background_music?name=' + options.name + '&population=' + options.population + '&sort=' + options.sort,
      success: function (res) {
        let currentSong = {
          "duration": res.data.data.uration
        }
        let duration = res.data.data.uration;
        that.setData({
          backgroundMusic: res.data.data,
          currentSong: currentSong,
          duration: that._formatTime(res.data.data.uration),
          musicPath: res.data.data.musicPath,
          lyric: res.data.data.lyric,
          team_name: res.data.data.name
        })
        // that._createAudio(res.data.data.musicPath)
        that.getLyricAction(res.data.data.lyric);
      }
    })
  },
  //录制
  makeRecord: function () {
    let that = this;
    let countDownNum = 3;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      is_show: false,
      buttonFlag: false,
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        wx.showLoading({
          title: countDownNum + 1 + "",
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum <= 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          //关闭定时器之后，可作其他处理codes go here
          wx.hideLoading()
          //播放背景音乐
          console.log(that.data.musicPath)
          that._createAudio(that.data.musicPath);
          that.getLyricAction(that.data.lyric);
        }
      }, 1000)
    })
  },
  onShow: function () {
    //this._init()
  },
  //初始化
  _init: function () {
    let mid = "0003JXVx2PhDxM"
    let currentSong = {
      "album": "卡路里",
      "duration": 232,
      "id": 215087468,
      "image": "https://y.gtimg.cn/music/photo_new/T002R300x300M000001vuRsJ45b4h8.jpg?max_age=2592000",
      "mid": "0003JXVx2PhDxM",
      "musicId": 215087468,
      "name": "卡路里",
      "singer": "火箭少女101"
    }
    let duration = currentSong.duration;
    this.setData({
      currentSong: currentSong,
      duration: this._formatTime(duration),
      currentIndex: 3,
      team_name: currentSong.name,
    })
    this._getPlayUrl(mid)
    this._getLyric(currentSong)
  },

  endRecode: function () { //结束录音 
    recorderManager.stop();
  },

  playRecode: function () {
    //const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true
    innerAudioContext.onError((res) => {
      // 播放音频失败的回调
      console.log(res)
    })
    innerAudioContext.src = this.data.recodePath; // 这里可以是录音的临时路径
    //innerAudioContext.play();
    let that = this;
    if (that.data.b_type == "1") {
      innerAudioContext.play()
      that.setData({
        b_img: "../../images/c_musice/zt.png",
        b_type: "2"
      })
    } else {
      innerAudioContext.pause()
      that.setData({
        b_img: "../../images/c_musice/bf.png",
        b_type: "1"
      })
    }
  },

  finishRecode: function () {
    var s = this;
    console.log("进入完成");
    s.setData({
      buttonFlag: false
    })
    innerAudioContext.stop();//停止播放
    // var sectionId = s.data.sectionId;
    var sectionId = s.data.sectionId;
    setTimeout(function () {
      var urls = config.baseUrl + "/song_section/" +
        sectionId + "/upload";
      // console.log(s.data.recodePath);
      wx.uploadFile({
        url: urls,
        filePath: s.data.recodePath,
        name: 'audioFile',
        formData: {
          choirId: s.data.choirId
        },
        header: {
          'content-type': 'multipart/form-data'
        },
        success: function (res) {
          console.log(res.data);
          wx.redirectTo({
            url: '/pages/section/sectionmusice?choirId=' + s.data.choirId,
          })
          // var str = res.data;
          // var data = JSON.parse(str);
          // if (data.states == 1) {
          //   var cEditData = s.data.editData;
          //   cEditData.recodeIdentity = data.identitys;
          //   s.setData({
          //     editData: cEditData
          //   });
          // } else {
          //   wx.showModal({
          //     title: '提示',
          //     content: data.message,
          //     showCancel: false,
          //     success: function(res) {

          //     }
          //   });
          // }
          console.log("成功");
          wx.hideToast();
        },
        fail: function (res) {
          console.log("失败");
          console.log(res);
          wx.showModal({
            title: '提示',
            content: "网络请求失败，请确保网络是否正常",
            showCancel: false,
            success: function (res) {

            }
          });
          wx.hideToast();
        }
      });
    }, 1000);
  },

  // 获取背景播放音乐的songmidid
  _getBackPlayfileName: function () {
    return new Promise((resolve, reject) => {
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          var dataUrl = res.dataUrl
          let ret = dataUrl && dataUrl.split('?')[0].split('/')[3]
          resolve({
            ret,
            res
          })
        },
        fail: function (e) {
          let ret = false
          reject(ret)
        }
      })
    })
  },
  // 获取播放地址
  _getPlayUrl: function (songmidid) {
    const _this = this


    wx.request({
      url: `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&loginUin=0&platform=yqq&needNewCode=0&cid=205361747&uin=0&filename=C400${songmidid}.m4a&guid=3913883408&songmid=${songmidid}&callback=callback`,
      data: {
        g_tk: 5381,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'jsonp',
        hostUin: 0,
        loginUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        uin: 0,
        filename: `C400${songmidid}.m4a`,
        guid: 3913883408,
        songmid: songmidid,
        callback: 'callback',
      },
      success: function (res) {
        var res1 = res.data.replace("callback(", "")
        var res2 = JSON.parse(res1.substring(0, res1.length - 1))
        const playUrl = `http://dl.stream.qqmusic.qq.com/${res2.data.items[0].filename}?vkey=${res2.data.items[0].vkey}&guid=3913883408&uin=0&fromtag=66`
        _this._getBackPlayfileName().then((nowPlay) => {
          if (!(res2.data.items[0].filename === nowPlay.ret)) {
            _this._createAudio(playUrl)
          }
        }).catch((err) => {
          _this._createAudio(playUrl)
        })
      }
    })
  },
  // 创建播放器
  _createAudio: function (playUrl) {
    innerAudioContext.stop();//停止播放录音
    let that = this;
    wx.playBackgroundAudio({
      dataUrl: config.baseUrl + "/f/" + playUrl,
      // title: this.data.currentSong.name,
      // coverImgUrl: this.data.currentSong.image
    })
    // 监听音乐播放。
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        playIcon: 'icon-pause',
        cdCls: 'play'
      })
    })
    // 监听音乐暂停。
    wx.onBackgroundAudioPause(() => {
      this.setData({
        playIcon: 'icon-play',
        cdCls: 'pause'
      })
    })
    // 监听音乐停止。
    wx.onBackgroundAudioStop(() => {
      //停止录音
      recorderManager.stop();
      that.setData({
        buttonFlag: true
      })
      // if (this.data.playMod === SINGLE_CYCLE_MOD) {
      //   this._init()
      //   return
      // }
      // this.next()
    })
    // 监听播放拿取播放进度
    const manage = wx.getBackgroundAudioManager()
    manage.onTimeUpdate(() => {
      const currentTime = manage.currentTime
      this.setData({
        currentTime: this._formatTime(currentTime),
        percent: currentTime / this.data.currentSong.duration
      })
      if (this.data.currentLyric) {
        this.handleLyric(currentTime * 1000)
      }
    })

    //开始录音
    //that.startRecode();
    //const recorderManager = wx.getRecorderManager();
    const options = {
      duration: that.data.currentSong.duration * 1000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    };
    console.log("start");
    recorderManager.start(options);

    recorderManager.onStop((res) => {
      that.setData({
        recodePath: res.tempFilePath,
        isRecode: true,
        lz_type: false
      });
      wx.showToast();
    })
  },
  // 获取歌词
  _getLyric: function (currentSong) {
    const _this = this
    this._getBackPlayfileName().then((res) => {
      const nowMid = res.ret.split('.')[0].replace('C400', '')
      if (!(nowMid === currentSong.mid)) {
        if (this.data.currentLyric) {
          //this.data.currentLyric.stop && this.data.currentLyric.stop()
        }
        _this._getLyricAction(currentSong)
      }
    }).catch(() => {
      _this._getLyricAction(currentSong)
    })
  },
  // 获取处理歌词
  _getLyricAction: function (currentSong) {
    song.getLyric(currentSong.mid).then((res) => {
      if (res.data.showapi_res_body.ret_code == 0) {
        const lyric = this._normalizeLyric(res.data.showapi_res_body.lyric)
        const currentLyric = new Lyric(lyric)
        this.setData({
          currentLyric: currentLyric
        })
      } else {
        this.setData({
          currentLyric: null,
          currentText: ''
        })
      }
    })
  },
  // 获取处理歌词
  getLyricAction: function (lyric) {
    if (lyric) {
      const currentLyric = new Lyric(lyric)
      this.setData({
        currentLyric: currentLyric
      })
    } else {
      this.setData({
        currentLyric: null,
        currentText: ''
      })
    }
  },
  // 去掉歌词中的转义字符
  _normalizeLyric: function (lyric) {
    return lyric.replace(/&#58;/g, ':').replace(/&#10;/g, '\n').replace(/&#46;/g, '.').replace(/&#32;/g, ' ').replace(/&#45;/g, '-').replace(/&#40;/g, '(').replace(/&#41;/g, ')')
  },
  // 歌词滚动回调函数
  handleLyric: function (currentTime) {
    let lines = [{
      time: 0,
      txt: ''
    }],
      lyric = this.data.currentLyric,
      lineNum
    lines = lines.concat(lyric.lines)
    for (let i = 0; i < lines.length; i++) {
      if (i < lines.length - 1) {
        let time1 = lines[i].time,
          time2 = lines[i + 1].time
        if (currentTime > time1 && currentTime < time2) {
          lineNum = i - 1
          break;
        }
      } else {
        lineNum = lines.length - 2
      }
    }
    this.setData({
      currentLineNum: lineNum,
      currentText: lines[lineNum + 1] && lines[lineNum + 1].txt
    })

    let toLineNum = lineNum - 5
    if (lineNum > 5 && toLineNum != this.data.toLineNum) {
      this.setData({
        toLineNum: toLineNum
      })
    }
  },
  _formatTime: function (interval) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  },
  /*秒前边加0*/
  _pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  },

  goback: function () {
    wx.navigateBack({ changed: true });
  },
  /**
       * 生命周期函数--监听页面隐藏
       */
  onHide: function () {
    wx.stopBackgroundAudio();//停止播放
    innerAudioContext.stop();//停止播放录音
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.stopBackgroundAudio();//停止播放
    innerAudioContext.stop();//停止播放录音
  },

})