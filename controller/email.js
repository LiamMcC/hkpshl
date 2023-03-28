'use strict';
require('dotenv').config();

const res = require('express/lib/response');
var db = require('../db');
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // your domain email address
      pass: process.env.EMAIL_PASS // your password
    },
    tls:{
      rejectUnauthorized: false
    }
  });


module.exports = class Email {
   
   static resetPass() {
console.log("I Mailed You")
    var mailOptions = {
      from: 'me@liammccabe.ie',
      to: 'me@liammccabe.ie',
      subject: 'Password Reset on Happy Kids Pre-School',
      text: "A new password has just been created for your account. If you did not request this you must immediately request site admin to change your password."
    };
    
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
 
   }  




   static rmaiReset(xxemail, newRandomPword) {

    var mailOptions = {
      from: 'me@liammccabe.ie',
      to: 'me@liammccabe.ie',
      subject: 'Website Contact',
      text:  " Your temporary password is " + newRandomPword
    };
    
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });



    
 
   }  


   static contact(who, email, what) {

    var mailOptions = {
      from: 'me@liammccabe.ie',
      replyTo: email,
      to: 'me@liammccabe.ie',
      subject: 'Website Contact',
      text:  who + " Your temporary password is " + what
    };
    
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });



    
 
   }  


  
}


