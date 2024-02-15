var express = require('express');
var multer = require('multer');
var path = require('path');
var empModel =require('../modules/employee');
var userModel = require('../modules/user');
var bcrypt = require('bcrypt');
var uploadimage = require('../modules/upload');
const uploadModel = require('../modules/upload');
var router = express.Router();
var employee =  empModel.find();
var imageData =  uploadModel.find({});
router.use(express.static(__dirname+"./public/"));
//File-upload using multer
      var Storage = multer.diskStorage({
        destination:"./public/uploads/",
        filename:(req,file,cb)=>{
          cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
        }
      });
      var upload=multer({ 
        storage:Storage
        }).single('file');
      if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
        }
//Login-validation for dashboard page     
      function checkLogin (req, res, next) {
        var userDetails = localStorage.getItem('userDeatils');
        if(userDetails){
          return res.redirect('/dashboard');
        }
        next();
        }
// Login-validation for login page       
      function validateUser (req, res, next) {
        var userDetails = localStorage.getItem('userDeatils');
        if(userDetails){
          next();
        }else{
          return res.redirect('/');
        }
      // next();
        }

      
//Upload
      router.post('/upload',upload,async function(req, res, next) {
        var imageFile = req.file.filename;
        var success= req.file.filename+ " Uploaded successfully";
        
            var imageDetails = new uploadModel({
              imagename:imageFile
            });
            imageDetails.save().then(async (data)=>{
              var records = await uploadModel.find({});
              //res.render('upload', { title: 'Upload File', records:records, success: success });
              return res.redirect('/dashboard');
            });
        });       
      router.get('/upload', validateUser,async function(req, res, next) {
        var records = await uploadModel.find({});
        res.render('upload', { title: 'Upload File' , success: '' ,records:records});
      
        });
//Register        
      router.get('/register',validateUser, async function(req, res, next) {
        var data = await empModel.find({});
          res.render('register', { title: 'Employee Records',records:data, success: '' });
        });
      router.post('/register',upload,async function(req,res,next){
        var  empDetails =new empModel({
          name:req.body.uname, 
          email:req.body.email, 
          etype:req.body.etype,
          hourlyvalue:req.body.hvalue,
          totalHour:req.body.Thours,
          total:parseInt(req.body.hvalue)*parseInt(req.body.Thours),
          Image:req.file.filename,
        });

            empDetails.save().then(async (data)=>{
              var data = await empModel.find({});
              //res.render('dashboard', { title: 'Employee Records',records:data,success:"Record Inserted Successfully" });
              return res.redirect('/dashboard');
            });
        //console.log(empDetails);  
        }); 
//login
      async function checkemail(req,res,next){
          var email = req.body.email;

          var msg = await userModel.findOne({email:email});
          
          if(msg){ 
            return res.render('signup', { title: 'employee management system' ,msg:'Email already exist'});
          }
          next();
        };
      async function checkusername(req,res,next){
        var uname = req.body.uname;
      
        var msg = await userModel.findOne({username:uname});
        
        if(msg){
          return res.render('signup', { title: 'employee management system' ,msg:'username already exist'});
        }
        next();
        };
      router.get('/', checkLogin,async function(req, res, next) {
      // var data = await empModel.find({});
          res.render('index', { title: 'Employee Management system',msg:""});
        });
      router.post('/', async function(req, res, next) {
          var data = await userModel.findOne({email:req.body.email});
          /* console.log(req.body.password);
          console.log(data.password); */
          if(data){
            if(bcrypt.compareSync(req.body.password,data.password)){
              //res.redirect('dashboard', { title: 'Employee Management system',msg:'Login successfully'});
              localStorage.setItem('userDeatils',data);
              console.log(localStorage.getItem('userDeatils'));
              res.redirect('dashboard');
            }else{
              res.render('index', { title: 'Employee Management system',msg:'Email or password is incorrect'});
            }
              }else{
            res.render('index', { title: 'Employee Management system',msg:'Email or password is incorrect'});
          }
          
          
              
        });
//Logout        
      router.get('/logout', async function(req, res, next) {
          // var data = await empModel.find({});
            localStorage.setItem('userDeatils','');
              return res.redirect('/');
        });
//Signup        
      router.get('/signup',checkLogin,async function(req, res, next) {
      // var data = await empModel.find({});
          res.render('signup', { title: 'Employee Management system',msg:''});
        });
      router.post('/signup',checkemail,checkusername, async function(req, res, next) {
              var username =req.body.uname;
              var email =req.body.email;
              var password =req.body.password;
              var confirmpassword =req.body.confirmpassword;
              var userDetails = new userModel({
                username:username,
                email:email,
                password:bcrypt.hashSync(req.body.password,10)
              });
      if (password!=confirmpassword){
        res.render('signup', { title: 'Employee Records',msg:"Password not match" });
      }else{
              password=bcrypt.hashSync(req.body.password,10);
              userDetails.save().then(async (data)=>{
              // var data = await userModel.find({});
                res.render('signup', { title: 'Employee Records',msg:"User registered successfully" });
              });}
        });      
//dashboard
      router.get('/dashboard', validateUser,async function(req, res, next) {
        var data = await empModel.find({});
          res.render('dashboard', { title: 'Employee Records',records:data, success:""});
        });
//Search        
      router.get('/search',validateUser,async function(req,res,next){
        var fltrname= req.query.filtrname;
        var fltremail= req.query.filtremail;
        var fltremptype= req.query.filtremptype;
      console.log(fltrname);
        if(fltrname !='' && fltremail !='' && fltremptype !='' ){
        var  fltrparameter ={ $and:[{name:fltrname},{$and:[{email:fltremail},{etype:fltremptype}]}]}
        }else if(fltrname !='' && fltremail =='' && fltremptype !='' ){
          var  fltrparameter ={ $and:[{name:fltrname},{etype:fltremptype}]
        }
      }else if(fltrname =='' && fltremail !='' && fltremptype !=''){
        var  fltrparameter ={ $and:[{email:fltremail},{etype:fltremptype}]
      }
      }else if(fltrname =='' && fltremail =='' && fltremptype !=''){
        var  fltrparameter ={etype:fltremptype}

      }else{
        var  fltrparameter ={}
      }
      console.log(fltrparameter);
      var data =await empModel.find(fltrparameter);
      console.log(data);
        //var data = await empModel.find({});
        res.render('dashboard', { title: '',records:data ,success:""});
        });
  //console.log(empDetails); 
//Delete   
      router.get('/delete/:id',validateUser, async function(req, res, next) {
          var id=req.params.id;
          var del = empModel.findByIdAndDelete(id);
          var data = await del.exec({});
          var data = await empModel.find({});
          //res.render('dashboard', { title: 'Employee Records',records:data,success:"Record deleted Successfully" });
          return res.redirect('/dashboard');
        });
//Edit         
      router.get('/edit/:id',validateUser, async function(req, res, next) {
            var id=req.params.id;
            var edit = empModel.findById(id);
            var data = await edit.exec({});
          
            res.render('edit', { title: 'Edit Employee Records',records:data });
        }); 
//update           
      router.post('/update/',upload, async function(req, res, next) {
            //var id=req.params.id;
            var update = empModel.findByIdAndUpdate(req.body.id,{
            name:req.body.uname,
            email:req.body.email, 
            etype:req.body.etype,
            hourlyvalue:req.body.hvalue,
            totalHour:req.body.Thours,
            total:parseInt(req.body.hvalue) * parseInt(req.body.Thours),
            Image:req.file.filename, 
          });
            var data = await update.exec({});
            // console.log(update);
            var data = await empModel.find({});
            //res.render('dashboard', { title: 'Employee Records',records:data,success:"Record updated Successfully" });
            return res.redirect('/dashboard');
        }); 
      module.exports = router;
