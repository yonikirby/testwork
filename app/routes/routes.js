const express = require("express");
const cors = require("cors");
const app=express().use('*', cors());
const mongoose = require("mongoose");
//var multer = require('multer');
const fs = require('fs');
//const path = require('path');
const db = require("../models");
const Item = db.itemModel;
const User = db.userModel;
const loginToken = db.loginTokenModel;
const crypto = require("crypto")
var ObjectId = require('mongodb').ObjectId;
require('dotenv').config()



const jwt = require("jsonwebtoken");


const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.addListener('UserAdded', (name) => {
  console.log("User Added with Name:" + name);
});

emitter.addListener('UserLoggedIn', (name) => {
  console.log("User logged in with name:" + name);
});

emitter.addListener('UserUpdated', (name) => {
  console.log("User updated with name:" + name);
});

emitter.addListener('OrderCreated', (name) => {
  console.log("Order created with name:" + name);
});

emitter.addListener('OrderUpdated', (name) => {
  console.log("Order updated with name:" + name);
});

emitter.addListener('OrderCancelled', (name) => {
  console.log("Order cancelled with name:" + name);
});

emitter.addListener('InventoryAdded', (name) => {
  console.log("Inventory added with name:" + name);
});

emitter.addListener('InventoryUpdated', (name) => {
  console.log("Inventory updated with name" + name);
});



async function hash(password) {
  //console.log("entered hash")
  return new Promise((resolve, reject) => {
      // generate random 16 bytes long salt
      const salt = crypto.randomBytes(16).toString("hex")
      //console.log("entered hash 2")
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          //console.log("entered hash 3" + salt + ":" + derivedKey)
          if (err) reject(err);
          resolve(salt + ":" + derivedKey.toString('hex'))
      });
  })
}

async function verify(password, hash) {
return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":")
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key == derivedKey.toString('hex'))
    });
})
}

const { json } = require("express");
const { Console } = require("console");
const { addConsoleHandler } = require("selenium-webdriver/lib/logging");
const inventoryModel = require("../models/inventoryModel");


module.exports = app => {
    var router = require("express").Router();
    var bodyParser = require('body-parser')
    var urlencodedParser = bodyParser.urlencoded({ extended: true })
    app.use(urlencodedParser);

    
    function generateAccessToken(user){
        return jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
    }


    
    function authenticateToken(req, res, next) {
      
    var nonSecurePaths = ["/api/weights/addUser",
      "/api/weights/userLogin"];
    if (nonSecurePaths.includes(req.path)){
       return next();
  
    }
    else {      

      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      if (token == null) return res.sendStatus(401)

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, user) => {
          
          console.log(err)
          if (err) return res.sendStatus(403)
          req.user = user;
          
             if (!user || user.length == 0){
                return res.status(404).send({message:"error: this login token does not exist"});      
             }
            
            else {
              next()
            }
    
        
      
              
    })
    .catch((err)=>{
      console.log("no login token supplied error")
      return res.status(400).send(
      {message:"error: no login token supplied"}
    );
    })
  

          
      
        
      
  }  
    }

    
    app.use(authenticateToken);


    router.post('/addUser' ,async (req, res) => {
      
    
          
          
          console.log("req.body: " + JSON.stringify(req.body))
  
          if (!req.body.name) {
            res.status(400).send({ message: "Name can not be empty!" });
            return;
          }
          if (!req.body.gender) {
            res.status(400).send({ message: "Gender can not be empty!" });
            return;
          }
  
          if (!req.body.email) {
              res.status(400).send({ message: "Email can not be empty!" });
              return;
            }
          if (!req.body.password) {
            res.status(400).send({ message: "Password can not be empty!" });
            return;
          }
          if (!req.body.phoneNumber) {
            res.status(400).send({ message: "phoneNumber can not be empty!" });
            return;
          }
          if (!req.body.organization) {
            res.status(400).send({ message: "Organization can not be empty!" });
            return;
          }
          if (!req.body.orderHistory) {
            res.status(400).send({ message: "orderHistory can not be empty!" });
            return;
          }
  
          var myEmail = req.body.email;
           var myHash = await hash(req.body.password);
  
                      let myExistingUser = userModel
                      .find({email:myEmail})
                      .then(async(response) => {
                            if (response.length == 0) {
                                      // Store hash in the database
                                      const user = new userModel({
                                        name: req.body.name,
                                        gender: req.body.gender,
                                        email: req.body.email,
                                        password: myHash,
                                        phoneNumber: req.body.phoneNumber,
                                        organization: req.body.organization,
                                        orderHistory: req.body.orderHistory
                                        
                                      });
                                      
                                           
                                      user
                                      .save()
                                      .then(async(data) => {
                                                                   
  
                            
                                      try {
                                      const userresponse = data;
                                                                                              
                                      
                                      var myTokenHash;
                                      
                                       myTokenHash = generateAccessToken(userresponse)
  
              
                                      toContinue = false;
                                      emitter.emit('UserAdded', data.name);

                                      return res.json({token:myTokenHash, user:userresponse});
           
                                      }
                                      catch (error){
                                        console.log(error);
                                        return res.status(500).send(
                                          {message:"Error adding user"}
                                        );
                                      }
                    
                    
                                    })
                                  }
                                })


    
  });

  router.post('/userLogin', async (req, res) => {
      
    
    if (!req.body.email) {
        res.status(400).send({ message: "Email can not be empty!" });
        return;
      }
    if (!req.body.password) {
      res.status(400).send({ message: "Password can not be empty!" });
      return;
    }
    
    var myEmail = req.body.email;
     var myHash = await hash(req.body.password);

                let myExistingUser = userModel
                .find({email:myEmail})
                .then(async(response) => {
                                
                                 myTokenHash = generateAccessToken(userresponse)

                                 emitter.emit('UserLoggedIn', response.name);
        
                                return res.json({token:myTokenHash, user:userresponse});
     
                                
                })
                .catch ((err) => {
                  return res.status(500).send(
                    {message:"Error creating inventory"}
                    );
                })
                
                        



});


router.post('/updateUser', async(req, res) => {
    // Validate request
   
    if (!req.body.name) {
      res.status(400).send({ message: "Name can not be empty!" });
      return;
    }
    if (!req.body.gender) {
      res.status(400).send({ message: "Gender can not be empty!" });
      return;
    }

    if (!req.body.email) {
        res.status(400).send({ message: "Email can not be empty!" });
        return;
      }
    if (!req.body.password) {
      res.status(400).send({ message: "Password can not be empty!" });
      return;
    }
    if (!req.body.phoneNumber) {
      res.status(400).send({ message: "phoneNumber can not be empty!" });
      return;
    }
    if (!req.body.organization) {
      res.status(400).send({ message: "Organization can not be empty!" });
      return;
    }
    if (!req.body.orderHistory) {
      res.status(400).send({ message: "orderHistory can not be empty!" });
      return;
    }        
        

        
        var myUser = userModel.find({_id: req.user._id})
        .then(async(userResult) =>{
              userResult.name = req.body.name;
              userResult.gender = req.body.gender;
              userResult.phoneNumber = req.body.phoneNumber;
              userResult.organization = req.body.organization;
              userResult.orderHistory = req.body.orderHistory;
      
      
              userResult.save()
              .then(async(data) => {
      
                emitter.emit('UserUpdated', req.body.name);
        

                return res.status(200).send({
                  message: "User updated successfully."
                    
                });
      
      
              })
              return res.status(500).send(
                {message:"Error updating user"}
              );
      
      
        })
        
          

  });



  router.post('/createOrder', async (req, res) => {
      
      
     
    var myUser = req.user;

    const newOrder = new orderModel({
          listOfInventory: [],
          status: 0 //0 for created, 1 for cancelled
      
    });
    
                                     
    newOrder
    .save()
    .then(async(data) => {
                                    
      data.orderHistory.push(data._id);
      data.save()
      .then(async(orderresponse) => {


        emitter.emit('OrderCreated', orderresponse._id);
        
        return res.status(200).send({
          message: "Order created successfully."
            
        });

      })
      .catch ((err) => {
        return res.status(500).send(
          {message:"Error creating order"}
          );
      })
    })

 
})

router.post('/updateOrder', async (req, res) => {
      
      
     
  var myUser = req.user;
  var myOrderID = req.body.orderID;
  var myListOfInventory = req.body.listOfInventory;
  var myStatus = req.body.status;


  var myOrder = orderModel.find({_id: myOrderID})
  .then(async(orderResult) =>{
        orderResult.listOfInventory = myListOfInventory;
        orderResult.status = myStatus;
        orderResult.save()
        .then(async(data) => {

          emitter.emit('OrderUpdated', data._id);
        

          return res.status(200).send({
            message: "Order updated successfully."
              
          });


        })
        return res.status(500).send(
          {message:"Error updating order"}
        );


  })
  


  


});


router.post('/cancelOrder', async (req, res) => {
      
      
     
  var myUser = req.user;
  var myOrderID = req.body.orderID;
 
  var myOrder = orderModel.find({_id: myOrderID})
  .then(async(orderResult) =>{
        orderResult.status = 1;
        orderResult.save()
        .then(async(data) => {

          emitter.emit('OrderCancelled', data._id);
        

           res.status(200).send({
            message: "Order cancelled successfully."
              
           });
           return res.status(500).send(
            {message:"Error cancelling order"}
           );


        })


  })
  


  


});





router.post('/addInventory', async (req, res) => {
      
    
  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }
  if (!req.body.description) {
    res.status(400).send({ message: "Description can not be empty!" });
    return;
  }
  if (!req.body.amountAvailable) {
    res.status(400).send({ message: "Amount Available can not be empty!" });
    return;
  }

  const newInventory = new inventoryModel({
    name: req.body.name,
    description: req.body.description,
    amountAvailable: req.body.amountAvailable
  });
                  
                        
  newInventory
  .save()
  .then(async(data) => {
    emitter.emit('InventoryAdded', data._id);
        
    return res.status(200).send({
      message: "Inventory saved successfully."
        
  });

  })
  .catch((err)=>{
    
    return res.status(500).send(
    {message:"Error creating inventory"}
    );

  })

})

router.post('/updateInventory', async (req, res) => {

  if (!req.body.inventoryID) {
    res.status(400).send({ message: "inventoryID can not be empty!" });
    return;
  }

  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }
  if (!req.body.description) {
    res.status(400).send({ message: "Description can not be empty!" });
    return;
  }
  if (!req.body.amountAvailable) {
    res.status(400).send({ message: "amountAvailable can not be empty!" });
    return;
  }

     
     
  var myInventory = inventoryModel.find({_id: req.body.inventoryid})
  .then(async(inventoryResult) =>{
        inventoryResult.name = req.body.name;
        inventoryResult.description = req.body.description;
        inventoryResult.amountAvailable = req.body.amountAvailable;
        orderResult.save()
        .then(async(data) => {

          emitter.emit('InventoryUpdated', data._id);
        

          return res.status(200).send({
            message: "Inventory updated successfully."
              
          });


        })
        return res.status(500).send(
          {message:"Error updating inventory"}
        );


  })
  


  


});



  app.use('/api/myAPI', router);

}