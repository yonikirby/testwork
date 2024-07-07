const { Inventory } = require("./inventoryModel.js");


const mongoose = require('mongoose');
const { Schema } = mongoose;

const { Int32 } = require("mongodb");
const db = require(".");

module.exports = mongoose => {
  var AutoIncrement = require('mongoose-sequence')(mongoose);

     

    
      const orderSchema = mongoose.Schema(
        {
          listOfInventory: [{Type: Schema.Types.ObjectId}],
          status: Number //0 for created, 1 for cancelled
        }
       
      );
      

      
      const orderModel = mongoose.model(
        "orderModel", orderSchema
      )
    
    
    return orderModel;
  };

















/*
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    title: String,
    description: String,
    color: String,
    type: String,
    size: Number,
    brand: String,
    gender: Number,//0 Male, 1 Female
    price: Number,
    image: String,
    url: String

  }
);

const itemModel = mongoose.model('item', itemSchema);

module.exports = {
  itemModel
}
*/








