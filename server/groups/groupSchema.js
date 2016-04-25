var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GroupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  interests: {
    type: [String] 
  },
  users: {
    type: [String]
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Group', GroupSchema);