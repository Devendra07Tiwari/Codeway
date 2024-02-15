var mongoose=require('mongoose');
//mongoose.connect('mongodb://localhost:27017/employee',);
mongoose.connect('mongodb+srv://devendratiwari748:1234567890@devendratiwari748.gfyvvsr.mongodb.net/ems');

var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    username:{type:String,
            required:true,index:{
                unique:true,
            }},
            email:{
                type:String,required:true,index:{
                    unique:true,
                }
            },
            password:{
                type:String,required:true
            },
            date:{
                type:Date,
                default:Date.now
            }
});
var userModel = mongoose.model('users',userSchema);
module.exports=userModel;