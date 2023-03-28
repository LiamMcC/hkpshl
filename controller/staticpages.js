var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var db = require('../db');
router.use(require('./user'))

var Email = require('./email')

// function to render the home page
router.get('/', function(req, res){
  let sql = 'select * from about where onShow  = "Show" LIMIT 4; select * from news where onShow  = "Show" LIMIT 4';
  let query = db.query(sql, (err, result) => {  
    
      if(err) throw err;  
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      var title = "Happy Kids Pre School :" + result[0][0].Title 
      var description = "Happy Kids Pre School is a fully outdoor pre-schooll in Dean Hill Navan co. Meath. We have fully qualified staff and pride ourselves on our facilities"
      res.render('home', {result, user: req.user, title, description,cookiePolicyAccept});    
      });  
  });


// function to render the contact page
router.get('/contact', function(req, res){
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
  var title = "Happy Kids Pre School : We Would Love To Hear From You " 
  var description = "Happy Kids Pre School: Please get in touch so we can discuss your childs education from the very start." 
    res.render('contact', {user: req.user, title, description, cookiePolicyAccept});
  });


// function to render the about page
router.get('/about', function(req, res){
  
    let sql = 'select * from about ORDER BY myChoice ASC';
    let query = db.query(sql, (err,result) => {

        if(err) throw err;
        var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
        var title = "Happy Kids Pre School: " + result[0].Title  
        var description = "Happy Kids Pre School :" + result[0].Description 
        res.render('about', {result, user: req.user, title, description, cookiePolicyAccept});
    });
});

// function to render the individual about page
router.get('/about/:which/:id', function(req, res){ 
  let sql = 'select * from about where Id = ?';
  let query = db.query(sql,[req.params.id], (err,result) => {
      if(err) throw err;
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      var title = "Happy Kids Pre School: " + result[0].Title  
      var description = "Happy Kids Pre School :" + result[0].Description 
      res.render('details', {result, user: req.user, title, description,cookiePolicyAccept});
      });
});


// function to render the news page
router.get('/news', function(req, res){
  let sql = 'select * from news ORDER BY Id DESC';
  let query = db.query(sql, (err,result) => {
      if(err) throw err;
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      var title = "Happy Kids Pre School: " + result[0].Title  
      var description = "Happy Kids Pre School :" + result[0].Description 
      res.render('news', {result, user: req.user, title, description,cookiePolicyAccept});
      });
});



// function to render the individul news page
router.get('/news/:which/:id', function(req, res){ 
  let sql = 'select * from news where Id = ?';
  let query = db.query(sql,[req.params.id], (err,result) => {
      if(err) throw err;
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      var title = "Happy Kids Pre School: " + result[0].Title 
      var description = "Happy Kids Pre School :" + result[0].Description  
      res.render('details', {result, user: req.user, title, description, cookiePolicyAccept});
      });
});



// function to render the staff page
router.get('/staff', function(req, res){
  let sql = 'select * from staff ORDER BY myChoice ASC';
  let query = db.query(sql, (err,result) => {
      if(err) throw err;
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      var title = "Happy Kids Pre School: We are so proud of our staff"  
      var description = "Happy Kids Pre School : All our staff are fully qualified and always put the children first" 
      res.render('staff', {result, user: req.user, title, description, cookiePolicyAccept});
      });
});



// function to render the individul staff page
router.get('/aboutstaff/:who/:id', function(req, res){ 
  let sql = 'select * from staff where Id = ?';
  let query = db.query(sql,[req.params.id], (err,result) => {
      if(err) throw err;
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      var title = "Happy Kids Pre School: " + result[0].Name  
      var description = "Happy Kids Pre School : "  + result[0].description
      res.render('staffdetails', {result, user: req.user, title, description, cookiePolicyAccept});
      });
});

// contact route 

router.get('/thankyou', function(req, res){ 
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
  var title = "Happy Kids Pre School Contact Page"
      var description = "Thank You For Contacting Happy Kids Pre School" 
  res.render('thankyou', {user: req.user, title, description,cookiePolicyAccept});
});

router.get('/cookiepolicy', function(req, res){ 
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
  var title = "Happy Kids Pre School Contact Page"
      var description = "Thank You For Contacting Happy Kids Pre School" 
  res.render('cookiepolicy', {user: req.user, title, description,cookiePolicyAccept});
});

router.post('/contact', function(req, res){ 
  if (req.body.verifybox == "Paris" || req.body.verifybox == "paris" || req.body.verifybox == "PARIS") {
  Email.contact(req.body.name, req.body.email, req.body.message, req.body.verifybox)
  res.redirect("/thankyou")
  } else {

    res.redirect("/wrongcaptcha")
  }
});

router.get('/wrongcaptcha', function(req, res, next) {
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
  res.render('wrongcaptcha', {user: req.user, cookiePolicyAccept})
});

// contact route


// Cookie Route
router.get('/acceptCookie', function(req, res) {

  let options = {
      maxAge: 1000 * 60 * 90 // would expire after 90 minutes
      //httpOnly: true, // The cookie only accessible by the web server
    // signed: true // Indicates if the cookie should be signed
  }
 
  res.cookie('acceptCookieBrowsing', '1', options) // options is optional
  //res.send('')


 
  res.redirect(req.get('referer'));
 //res.redirect('/');
 });



 router.get('/cancelCookie', function(req, res) {
  let options = {
      maxAge: 1000 * 60 * 90 // would expire after 90 minutes
      //httpOnly: true, // The cookie only accessible by the web server
    // signed: true // Indicates if the cookie should be signed
  }
 
  res.cookie('acceptCookieBrowsing', '0', options) // options is optional
  //res.send('')
 
 // res.redirect(req.get('referer'));
 res.redirect('/');
 });

// Cookie Route


// ******************************************** Remove these routes 
// SQL statements remove before release
  router.get('/sql', function(req, res){
    //CREATE TABLE about (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Title varchar(20), Description text, Image varchar(25), ImageTitle varchar(20))
    // INSERT INTO about (Title, Description, Image, ImageTitle) VALUES ("Outdoor Classroom", "Outdoor Classroom", "OutdoorClassroom.jpg", "Look At My Image")
    //CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, userName varchar(50), uemail varchar(50), password varchar(255), adminRights boolean, uPice varchar(50))
    // INSERT INTO users (userName, uemail, password, adminRights, uPice) VALUES ("Betty", "Outdoor Classroom", "OutdoorClassroom.jpg", 0, "Look At My Image")
    // ALTER TABLE about add (bubble varchar(10), summary varchar(255), babyBit varchar(20))
    // CREATE TABLE news (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Title varchar(20), Description text, Image varchar(25), ImageTitle varchar(20), myChoice varchar(5) DEFAULT "A", onShow varchar(5) DEFAULT "notSo")
    // CREATE TABLE staff (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(20), babyBit varchar(20), bubble varchar(10) DEFAULT "2023", Image varchar(25) DEFAULT "shadow.jpg", myChoice varchar(5) DEFAULT "A", onShow varchar(5) DEFAULT "notSo")


    let sql = 'SELECT * FROM staff';
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
       
      
        
    });
    
    res.send("I Think It worked")
    
  });









  module.exports = router;