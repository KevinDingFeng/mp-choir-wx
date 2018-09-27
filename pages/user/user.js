// pages/user/user.js
var config = require('../../utils/config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [], //['1个', '2个', '3个', '4个', '5个', '6个'],下拉列表的数据
    index: 0,//选择的下拉列表下标
    team_name: "",
    imgSrc: "",//封面本地路径
    pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
    scale: app.globalData.windowWidth / app.globalData.windowHeight,
    bj_img: config.bg_img + "/04bg.png",
    array: [2, 3, 4, 5, 6,],
    index: 0,
    choir: {//
      id: "",
      choirName: "",
      pickerValueText: '选择团人数',
      albumArtPaht: "../../images/user/m_r.png",
      albumArtPahtFlag: false
    }
  },
  // 输入团名
  bindChoirName: function (e) {
    var this_ = this;
    var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;;
    if (regStr.test(e.detail.value)) {
      this_.setData({
        'choir.choirName': e.detail.value.replace(regStr, "")
      });
    }else{
      this_.setData({
        'choir.choirName': e.detail.value
      });
    }
    
  },
  // 点击下拉显示框
  selectTap() {
    var this_ = this;
    this_.setData({
      show: !this_.data.show,
      selectData: ['2个', '3个', '4个', '5个', '6个'],
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  //选择成团人数
  bindPickerChange: function (e) {
    var _this = this;
    _this.setData({
      index: e.detail.value,
      'choir.pickerValue': _this.data.array[e.detail.value],
      'choir.pickerValueText': _this.data.array[e.detail.value] + " 人",
    })
  },
  //上传专辑封面
  uploadAlbumArt: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let size = res.tempFiles[0].size;
        if (size>10*1024*1024){
          wx.showModal({
            title: '提示',
            content: "图片最大为10MB",
            showCancel: false
          })
        }
        var tempFilePaths = res.tempFilePaths;
        if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(tempFilePaths)){
          wx.showModal({
            title: '提示',
            content: "图片类型必须是.jpeg,jpg,png中的一种",
            showCancel: false
          })
        }else{
          _this.setData({
            'choir.albumArtPaht': tempFilePaths[0],
            'choir.albumArtPahtFlag': true,
          })
        }
      }
    })
  },
  //上传照片
  upload: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '是否上传团队封面？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击了确定');
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  //成团
  create_team: function () {
    var _this = this;
    var team_name = _this.team_name;//团名
    var team_num = _this.index + 1;
    if (_this)
      wx.redirectTo({
        url: '/pages/choose/choosemusice',
      })
  },

  //提交表单
  formSubmit: function (e) {
    var _this = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    //如果信息填写不完整，弹出输入框

    var choirName = _this.data.choir.choirName.trim();
    var population = _this.data.choir.pickerValue;
    var albumArtPahtFlag = _this.data.choir.albumArtPahtFlag;

    if (!choirName) {
      _this.setData({
        'choir.choirName': ''
      });
      warn = "请输入你们的团名~";
    } else if (!population) {
      warn = "请选择你们的团人数~";
    } else if (!albumArtPahtFlag && !_this.data.choir.id) {
      warn = "请上传你们的专辑封面~";
    } else {
      flag = false;
    }

    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn,
        showCancel: false
      })
      return;
    }

    if (albumArtPahtFlag){//带文件
      wx.uploadFile({
        url: config.baseUrl + '/choir/create',
        filePath: _this.data.choir.albumArtPaht,
        name: 'albumArtFile',
        formData: {
          'id': _this.data.choir.id,
          'choirName': _this.data.choir.choirName,
          'population': _this.data.choir.pickerValue,
          'userId': wx.getStorageSync('userId')
        },
        success: function (res) {
          var resData = JSON.parse(res.data);
          var data = resData.data;
          // console.log(data)
          _this.setData({
            'choir.id': data.id,
            // 'choir.choirName': data.choirName,
            // 'choir.pickerValue': data.population,
            //'choir.albumArtPaht': config.baseUrl + data.albumArtPaht
          })

          wx.redirectTo({
            url: '/pages/choose/choosemusice?choirId=' + data.id,
          })
        },
        fail: function (e) {
          console.log(e);
        },
      })
    }else{//不带文件图片
      wx.request({
        url: config.baseUrl + '/choir/updateChoirInfo',
        data:{
          'id': _this.data.choir.id,
          'choirName': _this.data.choir.choirName,
          'population': _this.data.choir.pickerValue,
        },
        success: function (res) {
          let _data = res.data.data;
          wx.redirectTo({
            url: '/pages/choose/choosemusice?choirId=' + _data.id,
          })
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.choirId) {
      wx.request({
        url: config.baseUrl + '/choir/getChoirInfo?choirId=' + options.choirId,
        success: function (res) {
          let _data = res.data.data;
          that.setData({
            'choir.id': _data.id,
            'choir.choirName': _data.choirName,
            'choir.pickerValueText': _data.population,
            'choir.pickerValue': _data.population,
            'choir.albumArtPaht': config.baseUrl + "/f/"+ _data.albumArtPaht
          })
        }
      });
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
  goback: function () {
    wx.redirectTo({
      url: '/pages/index/index',
    })
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
    return {
      title: config.onShareAppMessageTitle[Math.floor(Math.random() * config.onShareAppMessageTitle.length)],
      path: '/pages/index/index',
    }
  }
})