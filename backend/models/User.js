const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({ // create a user schema 
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
  });
  const User = mongoose.model('user', UserSchema);
  module.exports = User;