//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'wxcloud2-mbmw6',
        traceUser: true,
      })
    }
    this.globalData = {
    }
    // var flag
    // wx.cloud.callFunction({
    //   name:"userLogin",
    // }).then(res=>{
    //   console.log('登录校验调用成功',res)
    //   //console.log(res)
    //   flag=res.result.flag
    //   if(flag){
    //     wx.redirectTo({
    //       url: '../mine/mine'
    //     })
    //   }
    // })
  },
  appGetOpenId() {
    return new Promise((resolve, reject) =>{
      wx.cloud.callFunction({
        name: 'getOpenid',
        data: {}})
        .then(res=>{
          console.log('[云函数] [login] user openid: ', res.result.openid)
          this.globalData.openid = res.result.openid
          resolve(this.globalData.openid)
        })
    }
    )},
})
