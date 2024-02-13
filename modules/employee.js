    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/employee');
    var conn = mongoose.connection;
    var employeeSchema=new mongoose.Schema({
        name:String,
        email:String,
        etype:String,hourlyvalue:Number,totalHour:Number,total:Number
    });
    var emlpoyeeModel = mongoose.model('employee',employeeSchema);
    module.exports=emlpoyeeModel;