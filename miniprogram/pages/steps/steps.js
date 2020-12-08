// miniprogram/pages/steps/steps.js
const db = wx.cloud.database();
const app = getApp();
Page({
  data: {
    openid: '',
    course_img_path: '../../images/course.png',
    show_course_detail_popup: false,
    scrollTop: 0,
    systeminfo: app.systeminfo,
    entime: {
          enter: 600,
          leave: 300
    }, //进入褪出动画时长
    //college: JSON.parse(config.data).college.splice(1),
    test: [{
      name:"1",
      val:1
    },{
      name:"2",
      val:2
    }],
    steps: [{
                text: '步骤一',
                desc: '必修情况'
          },
          {
                text: '步骤二',
                desc: '基本选项'
          },
          {
                text: '步骤三',
                desc: '基本信息'
          },
          {
                text: '步骤四',
                desc: '图片材料'
      },
    ],

    choose1:[{
      name: '同意降级',
      id: 0,
      check: true,
    },{
      name: '意向读博',
      id: 1,
      check: false,
    }],
    outpath: -1,
    choose2: [{
      name: '国外深造',
      id: 0,
      check: false,
      }, {
      name: '国内读研',
      id: 1,
      check: false
    },{
      name: '就业',
      id: 2,
      check: false
    },{
      name: '待定',
      id: 3,
      check: false
    }],
},

readDB(){
  let that = this
  wx.showLoading({
    title: '正在获取'
  })
  db.collection('course').get().then(res=>{
    wx.hideLoading();
    that.setData({
      course_data: res.data
    })
    for(let k in that.data.course_data){
      that.data.course_data[k].check=false
    }
    //console.log(that.data.course_data)
  })
},
  

initial() {
  let that = this;
  that.readDB()
  that.setData({
    active: 0,
    show_a: true,
    show_b: false,
    show_c: false,
    show_d: false,

    course_data:[],
    total_score: 0,
    cur_score:0,
    process:0,

    name: '',
    id:'',
    phone:'',
    cid:'',
    gender:0,

    gd_index: 0,
    dpin_index: 0,
    dpout_index: 0,
    grade: [],
    dpt_out: [],
    dpt_in: [],

    imgList:[],
    point:3,                               
    pdf_file: [],
    pdf_filename:'',
    pdf_fileId: [],
    img_4l: [],
    img_4lId: [],
    score_4l: 0,
    img_other:[],
    img_otherId:[],
    img_special:[],
    img_specialId:[],

  })

},

// 计算目前学分
cal_score(e){
  let that = this
  var sum = 0
  var cur_sum = 0
  for(let k in e.detail.value){
    that.data.course_data[e.detail.value[k]-1].check=true
  }
  for(let k in that.data.course_data){
    if(that.data.course_data[k].check){
      cur_sum+=that.data.course_data[k].score
    }
    sum+=that.data.course_data[k].score
  }
  that.setData({
    total_score:sum,
    cur_score:cur_sum,
    process:(cur_sum/sum*100).toFixed(1)
  })
},

swichstep(e){
  let that = this
  var width = (wx.getSystemInfoSync().windowWidth)/4
  var type = parseInt(e.detail.x.toFixed(0)/width)
  if(that.data.active>type){
    switch(type){
      case 0: that.stepA(); break
      case 1: that.stepB(); break
      case 2: that.stepC(); break
      case 3: that.stepD(); break
    }
  }
  //console.log(type+"  "+width)
},

checkb(){
  if(this.data.outpath>=0) return true
  return false
},
isCardID(sId){
  var iSum=0 ;
  if(!/^\d{17}(\d|x)$/i.test(sId)) return false//"你输入的身份证长度或格式错误";
  sId=sId.replace(/x$/i,"a");
  var sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
  var d=new Date(sBirthday.replace(/-/g,"/")) ;
  if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return false// "身份证上的出生日期非法";
  for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
  if(iSum%11!=1) return false;
  return true;
 },

checkc(){
  if(this.data.name=='') return false
  if(this.data.id=='') return false
  if(this.data.phone=='') return false
  if(!(this.isCardID(this.data.cid))) return false
  return true
},
checkd(){
  var img4 = this.data.img_4l.length
  var img_special = this.data.img_special.length
  var pdf = this.data.pdf_file.length
  if(img4==0||pdf==0) return false
  if(this.data.score_4l<525||this.data.point<3.4){
    if(img_special==0) return false
  }
  return true 
},

stepA(){
  var that = this 
  that.setData({
    show_a: true,
    show_b: false,
    show_c: false,
    show_d: false,
    active: 0,
  })
},
stepB(){
  var that = this 
  that.setData({
    show_a: false,
    show_b: true,
    show_c: false,
    show_d: false,
    active: 1,
  })
},
stepC(){
  if(!this.checkb()){
    wx.showToast({
      title: '请填写毕业去向',
      icon: 'warnning',
      duration: 2000
    })
    return
  }
  var that = this 
  that.setData({
    show_a: false,
    show_b: false,
    show_c: true,
    show_d: false,
    active: 2,
  })
},
stepD(){
  if(!this.checkc()){
    wx.showToast({
      title: '信息未填满或格式有误',
      icon: 'warnning',
      duration: 2000
    })
    return
  }
  var that = this 
  that.setData({
    show_a: false,
    show_b: false,
    show_c: false,
    show_d: true,
    active: 3,
  })
  //that.sendBasicInfoToDb()
  //that.atest()
},

ctest(){
    new Promise(function(resolve,reject){
        var result={
          name:''
        }
        setTimeout(function(){
            console.log(1)
            result.name='dodo'
                resolve(result)
            //reject()
        },5000)
    })
    .then(res=>{
      console.log(res)
    })
    .catch(function(){
        console.log(4)
    })
},

test(){
  for(let k in this.data.test){
    this.data.test[k].make="dodo"
  }
  console.log(this.data.test)
},

  onLoad: function (options) {
    this.initial();
    this.readInfo()
    //this.test()
  },

  opChange(e){
    console.log(e)
    this.setData({
      outpath: e.detail.value
    })
  },
  get_will(e){
    console.log(e)
    var list = this.data.choose1
      if(this.data.process<70&&e.currentTarget.offsetTop==132){
      var obj = {
        name: '同意降级',
        id: 0,
        check: true,
      }
      list[0] = obj
      this.setData({
        choose1: list
      })
    }
    if(e.currentTarget.offsetTop==132){
      var obj2 = {
        name: '同意降级',
        id: 0,
        check: e.detail.value,
      }
      list[0] = obj2
      this.setData({
        choose1: list
      })
    }
    if(e.currentTarget.offsetTop==174){
      var obj3 = {
        name: '意向读博',
        id: 1,
        check: e.detail.value,
      }
      list[1] = obj3
      this.setData({
        choose1: list
      })
    }
    
  },

  //step 3 4
  getName(e){
    this.setData({
      name: e.detail.value,
    })
  },
  getId(e){
    this.setData({
      id: e.detail.value,
    })
  },
  getPhone(e){
    this.setData({
      phone: e.detail.value,
    })
  },
  getCID(e){
    this.setData({
      cid: e.detail.value,
    })
  },

  get4l(e){
    this.setData({
      score_4l: e.detail.value
    })
  },
  DptoutChange(e) {
    console.log(e);
    this.setData({
      dpout_index: e.detail.value
    })
  },

  DptinChange(e) {
    console.log(e);
    this.setData({
      dpin_index: e.detail.value
    })
  },
  GdChange(e) {
    console.log(e);
    this.setData({
      gd_index: e.detail.value
    })
  },

  release(){
    if(!this.checkd()){
      wx.showToast({
        title: '信息未填满',
        icon: 'warnning',
        duration: 2000
      })
      return
    }
    this.sendBasicInfoToDb()
    wx.redirectTo({
      url: '../mine/mine'
    })
  },
  sendBasicInfoToDb(){
    let that = this
    var op = that.data.outpath
    var sex = (that.data.cid.substr(16,17))%2==0?0:1
    var opath = ["出国留学","国内读研","就业","待定"]
    var basic_data={
      basic_info:{
        name: this.data.name,
        id: this.data.id,
        cid: this.data.cid,
        phone: this.data.phone,
        gender: sex,
        grade: this.data.grade[this.data.gd_index],
        dpt_in: this.data.dpt_in[this.data.dpin_index],
        dpt_out: this.data.dpt_out[this.data.dpout_index],
      },
      fileList:{
        fourl:{
          score: this.data.score_4l,
          fid:[]
        },
        pdf:{
          score:this.data.point,
          fid:[]
        },
        other_fid:{
          fid:[]
        },
        sprecial_fid:{
          fid:[]
        }
      },
      will:{
        isdown:this.data.choose1[0].check,
        isphd:this.data.choose1[1].check,
        outpath: opath[op]
      },
      course_info:{}
    }
    console.log("全部数据",basic_data)
    app.appGetOpenId().then(res=>{
      db.collection("form").where({
        _openid:res
      }).get().then(res2=>{
        var len = res2.data.length
        console.log(res2)
        if(len == 0){
          db.collection("form").add({
            data: basic_data
          })
          console.log("add basic info to database success")
        }else{
          wx.cloud.callFunction({
            name: 'changeDB',
            data:{
             data:basic_data
          }   
          }).then((res3)=>{
              console.log("修改数据库成功", res3);
          })
        }
      })
    })

    var fileid_obj1 = {
      fourl:{
        score: this.data.score_4l,
        fid:[]
      },
    }
    var fileid_obj2 = {
      pdf:{
        score:this.data.point,
        fid:[]
      },
    }
    var fileid_obj3 = {
      other_fid:{
        fid:[]
      },
    }
    var fileid_obj4 = {
      sprecial_fid:{
        fid:[]
      }
    }
    var objj = [{
      fourl:{
        score: this.data.score_4l,
        fid:[]
      },
    },{
      pdf:{
        score:this.data.point,
        fid:[]
      },
    },{
      other_fid:{
        fid:[]
      },
    },{
      sprecial_fid:{
        fid:[]
      }
    }]

    that.get_imgId(that.data.img_4l, '_4l.png',fileid_obj1)
    that.get_imgId(that.data.pdf_file, '_score.pdf',fileid_obj2)
    that.get_imgId(that.data.img_other, '_other.png',fileid_obj3)
    that.get_imgId(that.data.img_special, '_special.png',fileid_obj4)
  },

  get_imgId(file_path, suffix,obj) {
    let that = this
    new Promise((resolve, reject) =>{
      var result={
        img_id:[]
      }
      var fp1 = file_path
      var img_num = fp1.length
      fp1.forEach((element,index) => {
        if(typeof(element)!='string'){
          console.log("failed获取 "+" 图片failed")
          return
        }
        var fp_name = Date.now()+"_"+index+suffix
          wx.cloud.uploadFile({
          cloudPath: "form/" + fp_name,
          filePath: element
        }).then(res=>{
          result.img_id.push(res.fileID)
          console.log(result)
          if(img_num==result.img_id.length){
            resolve(result)
          }
        })
      })
    }).then(res=>{
      that.setData({
        imgList: res.img_id
      })
      console.log("原obj",obj)
      for(let k in obj){
        obj[k].fid=res.img_id
      }
      console.log("改obj",obj)
      var robj = {
        fileList:obj
      }
      console.log("组装的对象",robj)
      wx.cloud.callFunction({
        name:'changeDB', 
        data:{
          data:robj
        }
      })
    })
  },

  getpoint(e){
    console.log(e);
    this.setData({
      point: e.detail
    })
  },

  ChoosePdf(){
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success (res) {
        var size = res.tempFiles[0].size;
        var filename = res.tempFiles[0].name;
        var newfilename = filename + "";
        //console.log(newfilename)
        if (size > 4194304||newfilename.indexOf(".pdf")==-1){ //我还限制了文件的大小和具体文件类型
          wx.showToast({
            title: '文件大小不能超过4MB,格式必须为pdf！',
            icon: "none",
            duration: 2000,
            mask: true
          })
        }else{
          var path = []
          for(let k in res.tempFiles){
            path[k] = res.tempFiles[k].path
          }
          console.log("pdf temp path",path)
          that.setData({
            pdf_file: path, //将文件的路径保存在页面的变量上,方便 wx.uploadFile调用
            pdf_filename: filename              //渲染到wxml方便用户知道自己选择了什么文件
          })
          
        }
      }
    })
  },

  ChooseImage_4l() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.img_4l.length != 0) {
          this.setData({
            img_4l: this.data.img_4l.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            img_4l: res.tempFilePaths
          })
          console.log(this.data.img_4l)
        }
      }
    });
  },

  ChooseImage_ot(){
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.img_other.length != 0) {
          this.setData({
            img_other: this.data.img_other.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            img_other: res.tempFilePaths
          })
        }
      }
    });
  },

  ChooseImage_sp() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.img_special.length != 0) {
          this.setData({
            img_special: this.data.img_special.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            img_special: res.tempFilePaths
          })
        }
      }
    });
  },


  // 显示缩略图
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  DelImg_pdf(e) {
    this.data.pdf_file.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      pdf_file: this.data.pdf_file
    })
  },
  DelImg_ot(e) {
    this.data.img_other.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      img_other: this.data.img_other
    })
  },
  DelImg_sp(e) {
    this.data.img_special.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      img_special: this.data.img_special
    })
  },
  // 删除img
  DelImg_4l(e) {
    this.data.img_4l.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      img_4l: this.data.img_4l
    })
    /*
    wx.showModal({
      title: '同学',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })*/
  },

  readInfo(){
    db.collection("dpt").doc('institution').get().then(res=>{
      console.log(res.data)
      this.setData({
        dpt_in: res.data.inst,
        dpt_out: res.data.inst,
        grade: res.data.grade
      })
    })
  },


  showPopup() {
    this.setData({ show_course_detail_popup: true });
  },

  onClose() {
    this.setData({ show_course_detail_popup: false });
  },

  //监测屏幕滚动
  onPageScroll: function(e) {
    this.setData({
          scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
    })
  },
  // 回到顶部
  gotop() {
    wx.pageScrollTo({
          scrollTop: 0
    })
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