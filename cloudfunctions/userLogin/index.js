// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'wxcloud2-mbmw6'
})

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main =  (event, context) => {

  return new Promise((resolve, reject) => {
   //获取信息
    const wxContext = cloud.getWXContext()
    var result ={
      flag: 0,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
    //临时变量

    //数据库操作
    const db = cloud.database()
    const tb = db.collection('form')
    let id = wxContext.OPENID
    tb.where({
      _openid : id
    }).get().then(res=>{
        console.log("dodododoo",res)
        if(res.data.length != 0)
          result.flag = 1
        resolve(result)
    })
  })
}

