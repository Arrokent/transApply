// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: 'wxcloud2-mbmw6'
})

const db = cloud.database()
const _ = db.command
const result = {
  con: {},
  eve: {}
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var obj = event.data
  let openid = wxContext.OPENID
  
  db.collection('form').where({
    _openid:openid
  })
  .update({
      data: obj
      // {
      //   basic_info: _.set(basic_info),
      //   will: _.set(will),
      //   course_info: _.set(course_info),
      // }
  })
  .then(res=>{
    result.con = res
  })

  return {
    result,
    openid
  }

  // return new Promise((resolve, reject) =>{
  //   const wxContext = cloud.getWXContext()
  //   var obj = event.data
  //   result.eve=obj

  //   let openid = wxContext.OPENID
  //   tb.where({
  //     _openid:openid
  //   })
  //   // .update({
  //   //   data: obj
  //   // })
  //   .get()
  //   .then(res=>{
  //     result.con = res
  //     resolve(result)
  //   })
  // })
}

/*
submitForm(e) {
  var that = this;
  var index = 0;
  var len = that.data.images.length;
  wx.showLoading({
    title: '上传中...',
  })
  for(var i = 0; i < len ; i++)
  {
    console.log(i)
    wx.getFileSystemManager().readFile({
      filePath: that.data.images[i], //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        wx.cloud.callFunction({
          name:'file',
          data:{
            path: 'pictures/' + util.vcode(new Date())+index+'.png',
            file: res.data
          },
          success(_res){
           
            console.log(_res)
            wx.hideLoading()
            //wx.hideLoading()
          },fail(_res){
            console.log(_res)
          }
        })
        index++;
      }
    })
  }
}

})

const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
cloud.init({
  env: 'kindear-fd77cd'
})

exports.main = async (event, context) => {
  
  try{
    return await cloud.uploadFile({
      cloudPath: event.path,
      fileContent: new Buffer(event.file, 'base64')
    })
  }catch(e){
    return e;
  }
}
// const cloud = require('wx-server-sdk')
 
// cloud.init()
// const db = cloud.database()
// const _ = db.command
// const result={
//   code:'',
//   body:''
// }
// // 云函数入口函数
// exports.main = (event, context) => {
//   return new Promise((resolve, reject) => {
//     db.collection('fan_user').where({
//       tel:_.eq(event.tel)
//     }).get().then((res)=>{
//         if(res.data.length){ //用户已注册
//           result.code=400;
//           result.body='该账户已注册';
//           resolve(result)
//         }else{ //用户未注册
//            db.collection('fan_user').add({
//              data:{
//                tel:event.tel,
//                password:event.password
//              }
//            }).then((res)=>{
//              result.code=200;
//              result.body=res;
//              resolve(result)
//            })
//         }
//     })
//   })
 
// }*/