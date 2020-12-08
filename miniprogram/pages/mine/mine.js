// pages/mine/mine.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IfFillIn: '未填报',
    Fill: false
  },

  uploadUserInfo(){
    db.collection("_Users").add({
      data: {
        mygoods: "",
        myfavorite: "",
        name: "",
      }
    })
    .then(res =>{
      console.log(res)
    })
  },

  onGetOpenid: function(callback) {
    var that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getOpenid',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        // console.log('app.globalData.openid: ', app.globalData.openid)
        callback(app.globalData.openid)
        
      }
    })

  },

  checkIfFillIn: function(openid) {
    const that = this

    db.collection('form').where({
      _openid: openid // 填入当前用户 openid
    }).get({
      success: function(res) {
        console.log(res.data)
        if (res.data[0]) {
          that.setData({
            IfFillIn : '已填报',
            Fill: true
          })
        }
      }
    })

  },
  
  navigateToMyInfo: function() {
    if (!this.data.Fill) {
      wx.showToast({
        title: '请先填报信息',
        icon: 'none',
        duration: 1500
      })
    }
    else {
      wx.navigateTo({
      url: '/pages/myInfo/myInfo'
      })
     }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    this.onGetOpenid(this.checkIfFillIn);
    // this.setData({
    //   IfFillIn : '已填报',
    // })
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