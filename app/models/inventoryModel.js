const { Int32 } = require("mongodb");
const db = require(".");

module.exports = mongoose => {
  var AutoIncrement = require('mongoose-sequence')(mongoose);

     

    
      const inventorySchema = mongoose.Schema(
        {
          
          name: String,
          description: String,
          amountAvailable: Number,

        }
       
      );
      
      

      const inventoryModel = mongoose.model(
        "Inventory", inventorySchema
      )
    //);
    
    return inventoryModel;
  };
