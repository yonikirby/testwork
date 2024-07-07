const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload) => {
    console.log("got into sendEmail")

    var emailBody = "Hello," + payload.name + ". Thank you for your password reset request. Please click the following link to reset your password: <a href = '"+ payload.link+ "'>" + payload.link + "</a>. Thank you.<br / >Sincerely, The Administrators"
  try {
    // create reusable transporter object using the default SMTP transport
     

    var util = require('util');
    var exec = require('child_process').exec;
    
    //const compiledTemplate = handlebars.compile(source);

    var command = "curl --location --request POST 'https://be.trustifi.com/api/i/v1/email' \
    --header 'x-trustifi-key: {{fff7ae3051486c945cee63bb581d4310c663f993cdc4bf4d}}' \
    --header 'x-trustifi-secret: {{e699f222741331fddecffb992030a6bd}}' \
    --header 'Content-Type: application/json' \
    --data-raw '{  \
      \"recipients\": [{\"email\": \"" + email + "\", \"name\": \"" + payload.name + "\", \"phone\":{\"country_code\":\"+972\",\"" + payload.phoneNumber + "\":\"\"}}], \
      \"lists\": [], \
      \"contacts\": [], \
      \"attachments\": [], \
      \"title\": \"Password Reset Request\", \
      \"html\": \"" + emailBody + "\", \
      \"methods\": { \
        \"postmark\": false, \
        \"secureSend\": false, \
        \"encryptContent\": false, \
        \"secureReply\": false \
      } \
    }'"
    
    child = exec(command, function(error, stdout, stderr){
    
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    
    if(error !== null)
    {
        console.log('exec error: ' + error);
    }
    
    });


    
    
  } catch (error) {
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;