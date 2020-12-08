// 云函数入口文件
const cloud = require('wx-server-sdk')
 
cloud.init()
const db = cloud.database()
const _ = db.command
const result={
    pdf_fileId: [],
    img_4lId: [],
    img_otherId:[],
    img_specialId:[],
}

function pushid(file_path, suffix,img_id){
  var fp1=file_path
  fp1.forEach((element,index) => {
    if(typeof(fp1)!='string'){
      console.log("failed获取 "+suffix+" 图片failed")
      return
    }
    var fp_name = suffix+index;
    wx.cloud.uploadFile({
      cloudPath: "form/" + fp_name + ".png",
      filePath: element
    }).then(res=>{
      img_id.push(res.fileID)
    })
    console.log("成功获取 "+suffix+" 图片id")
  })
}

// 云函数入口函数
exports.main = (event, context) => {
  return new Promise((resolve, reject) => {
    var pdf_file = event.pdf_file
    var img_4l = event.img_4l
    var img_other = event.img_other
    var img_special = event.img_special

    pushid(pdf_file,'_pdf',result.pdf_fileId)
    pushid(img_4l,'_pdf',result.img_4lId)
    pushid(img_other,'_pdf',result.img_otherId)
    pushid(img_special,'_pdf',result.img_specialId)

    resolve(result)
  })
}