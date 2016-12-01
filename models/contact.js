var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: "Please enter their first name "
  },
  lastName:{
    type:String,
    required: "Please enter their last name"
  },
  birthday:{
    type:String
  },
  phoneNumber:{
    type:String
  },
  address:{
    type: String
  },
  email:{
    type:String
  }
});

module.exports = mongoose.model('Contact', contactSchema);
