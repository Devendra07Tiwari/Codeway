    var mongoose = require('mongoose');
    //mongoose.connect('mongodb://localhost:27017/employee');
    mongoose.connect('mongodb+srv://devendratiwari748:1234567890@devendratiwari748.gfyvvsr.mongodb.net/ems');
    var conn = mongoose.connection;
    var employeeSchema=new mongoose.Schema({
        name:String,
        email:String,
        etype:String,hourlyvalue:Number,totalHour:Number,total:Number,Image:String
    });
    var emlpoyeeModel = mongoose.model('employee',employeeSchema);
    module.exports=emlpoyeeModel;