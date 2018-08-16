// pages/user/userInfo.js
var config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [2,3,4,5,6,],
    index: 0,
    choir:{//
      id:"",
      choirName:"",
      pickerValue: '选择团人数',
      albumArtPaht: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  //选择成团人数
  bindPickerChange: function (e) {
    var _this = this;
    _this.setData({
      index: e.detail.value,
      'choir.pickerValue': _this.data.array[e.detail.value]
    })
  },
  //上传专辑封面
  uploadAlbumArt: function () {
    var _this = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        _this.setData({
          'choir.albumArtPaht' : tempFilePaths[0]
        })
        
      }
    })
  },
  //提交表单
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    console.log("baseUrl=="+config.baseUrl)
    var form_ = e.detail.value;
    var _this = this;
    wx.uploadFile({
      url: config.baseUrl + 'choir/create', 
      filePath: _this.data.choir.albumArtPaht,
      name: 'albumArtFile',
      formData: {
        'id': _this.data.choir.id,
        'choirName': form_.choirName,
        'population': _this.data.choir.pickerValue
      },
      success: function (res) {
        var resData = JSON.parse(res.data);
        var data = resData.data;
        console.log(data)
        _this.setData({
          'choir.id': data.id,
          'choir.choirName': data.choirName,
          'choir.pickerValue': data.population,
          'choir.albumArtPaht': config.baseUrl+data.albumArtPaht
        })

      },
      fail: function (e) {
        console.log(e);
      },
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