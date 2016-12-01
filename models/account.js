var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');
var accountSchema = new mongoose.Schema({
  contacts:
  {
      type:Array
  }
});

accountSchema.plugin(plm);

module.exports = mongoose.model('Account', accountSchema);
