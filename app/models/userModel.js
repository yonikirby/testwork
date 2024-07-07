const { Order } = require("./orderModel.js");

const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose => {

    

    const userModel = mongoose.model(
      "userModel",
      mongoose.Schema(
        {
          name: String,
          gender: Number,
          email: {
            type: String,
            unique: true // `email` must be unique
          },
          password: String,
          phoneNumber: Number,
          organization: String,
          orderHistory:[{Type: Schema.Types.ObjectId}]                 
        }
       
      )
    );
    return userModel;
  };
