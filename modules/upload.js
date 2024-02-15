    var mongoose = require('mongoose');
   // mongoose.connect('mongodb://localhost:27017/employee');
   mongoose.connect('mongodb+srv://devendratiwari748:1234567890@devendratiwari748.gfyvvsr.mongodb.net/ems');
    var conn = mongoose.connection;
    var uploadSchema = new mongoose.Schema({
        imagename : String,
    });

    var uploadModel =mongoose.model('uploadimage',uploadSchema);
    module.exports=uploadModel; 