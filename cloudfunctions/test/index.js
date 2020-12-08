// 云函数入口文件
// 云函数入口文件
const cloud = require('wx-server-sdk')
 
cloud.init()
const db = cloud.database()
const _ = db.command

function dodo(){
  return "dodo"
}
const result={
 img_id:[]
}
// 云函数入口函数
exports.main =  (event, context) => {

  return new Promise((resolve, reject) =>{
    var fp1= event.path
    fp1.forEach((element,index) => {
      if(typeof(fp1)!='string'){
        console.log("failed获取 "+" 图片failed")
        return
      }
      var fp_name = Date.now()+"_"+index
        cloud.uploadFile({
        cloudPath: "form/" + fp_name + ".png",
        filePath: element
      }).then(res=>{
        result.img_id.push(res.fileID)
        console.log(res.fileID)
      })
    })

    resolve(result)
  })
}