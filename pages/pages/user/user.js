// pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
        show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
        selectData: [], //['1个', '2个', '3个', '4个', '5个', '6个'],下拉列表的数据
        index: 0,//选择的下拉列表下标
        team_name:"",
        imgSrc:"",//封面本地路径
        pageStyle: `width:${app.globalData.width};height:${app.globalData.height}`,
        scale: app.globalData.windowWidth / app.globalData.windowHeight,
    },
    // 点击下拉显示框
    selectTap() {
        this.setData({
            show: !this.data.show,
            selectData: ['1个', '2个', '3个', '4个', '5个', '6个'],
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
    // input监听输入
    watchPassWord: function (event) {
        if (event.detail.value.length>"8"){
            wx.showModal({
                title: '提示',
                content: '团队名称不能大于7位',
            })
        }
    },
    //上传照片
    upload:function(){
        var _this = this;
        wx.showModal({
            title: '提示',
            content: '是否上传团队封面？',
            success:function(res){
                if (res.confirm) {
                    console.log('用户点击了确定');
                } else {
                    console.log('用户点击了取消')
                }
            }
        })
    },
    //成团
    create_team:function(){
        var _this = this;
        var  team_name = _this.team_name;//团名
        var team_num = _this.index+1;
        if (_this)
        wx.navigateTo({
            url: '../choose/choosemusice',
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