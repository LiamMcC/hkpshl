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
   
   static resetPass(person) {

    var mailOptions = {
      from: 'me@liammccabe.ie',
      to: person,
      subject: 'Password Reset on Happy Kids Pre-School',
      
      html: '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><style>body,h1,h2,h3,h4,h5,h6 {font-family: "Raleway", sans-serif}</style></head><body class="w3-light-grey w3-content" style="max-width:1600px"><div class="w3-light-grey w3-padding-large w3-padding-32 w3-margin-top" id="contact"><h3 class="w3-center">Happy Kids Pre School</h3><h3 style="color:red;">WARNING</h3><hr><p>A new password has just been created for your account. If you did not request this you must immediately request site admin to change your password. Call Liam 0864000567</p>',
      text: "A new password has just been created for your account. If you did not request this you must immediately request site admin to change your password."
    };
    
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
       
      }
    });
    
 
   }  






   static contact(who, email, what) {

    var mailOptions = {
      from: 'me@liammccabe.ie',
      replyTo: email,
      to: 'me@liammccabe.ie',
      subject: 'Website Contact',
      html: '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><style>body,h1,h2,h3,h4,h5,h6 {font-family: "Raleway", sans-serif}</style></head><body class="w3-light-grey w3-content" style="max-width:1600px"><div class="w3-light-grey w3-padding-large w3-padding-32 w3-margin-top" id="contact"><h3 class="w3-center">Happy Kids Pre School</h3><hr><p>Thank you for contacting us. A copy of your message is attached. We will be in touch soon.</p><hr><h3>You Said!</h3><p>' + what + '</p>'
      
    };
    
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
       
      }
    });



    
 
   }  


  
}


