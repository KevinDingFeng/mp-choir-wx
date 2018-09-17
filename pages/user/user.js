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
    // 点击下拉显示框
    bindChoirName: function (e) {
        var this_ = this;
        this_.setData({
            'choir.choirName': e.detail.value
        });
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
                var tempFilePaths = res.tempFilePaths;
                _this.setData({
                    'choir.albumArtPaht': tempFilePaths[0],
                    'choir.albumArtPahtFlag': true,
                })

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

        var choirName = _this.data.choir.choirName;
        var population = _this.data.choir.pickerValue;
        var albumArtPahtFlag = _this.data.choir.albumArtPahtFlag;

        if (!choirName) {
            warn = "请输入你们的团名~";
        } else if (!population) {
            warn = "请选择你们的团人数~";
        } else if (!albumArtPahtFlag) {
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

    }
})