var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var db = require('../db');
router.use(require('./user'))



// function to render the home page
router.get('/', function(req, res){
  let sql = 'select * from about where onShow  = "Show" LIMIT 4; select * from news where onShow  = "Show" LIMIT 4';
  let query = db.query(sql, (err,result) => {     
      if(err) throw err;    
      res.render('home', {result, user: req.user});    
      });  
  });


// function to render the contact page
router.get('/contact', function(req, res){
    res.render('contact', {user: req.user});
  });


// function to render the about page
router.get('/about', function(req, res){
    let sql = 'select * from about ORDER BY myChoice ASC';
    let query = db.query(sql, (err,result) => {
        if(err) throw err;
        res.render('about', {result, user: req.user});
    });
});

// function to render the individual about page
router.get('/about/:which/:id', function(req, res){ 
  let sql = 'select * from about where Id = ?';
  let query = db.query(sql,[req.params.id], (err,result) => {
      if(err) throw err;
      res.render('details', {result, user: req.user});
      });
});


// function to render the news page
router.get('/news', function(req, res){
  let sql = 'select * from news ORDER BY Id DESC';
  let query = db.query(sql, (err,result) => {
      if(err) throw err;
      res.render('news', {result, user: req.user});
      });
});



// function to render the individul news page
router.get('/news/:which/:id', function(req, res){ 
  let sql = 'select * from news where Id = ?';
  let query = db.query(sql,[req.params.id], (err,result) => {
      if(err) throw err;
      res.render('details', {result, user: req.user});
      });
});



// function to render the staff page
router.get('/staff', function(req, res){
  let sql = 'select * from staff ORDER BY myChoice ASC';
  let query = db.query(sql, (err,result) => {
      if(err) throw err;
      res.render('staff', {result, user: req.user});
      });
});



// function to render the individul staff page
router.get('/aboutstaff/:who/:id', function(req, res){ 
  let sql = 'select * from staff where Id = ?';
  let query = db.query(sql,[req.params.id], (err,result) => {
      if(err) throw err;
      res.render('staffdetails', {result, user: req.user});
      });
});






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
       
        console.log(res);
        
    });
    
    res.send("I Think It worked")
    
  });


// Test Route Get Rid
  router.get('/products', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'ALTER TABLE staff add (description text)';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        
        
        res.send(result)
        
    });
    
    //res.send("You created your first Product")
    
})


router.get('/me/delete/:id', function(req, res){
    
  let sql = 'delete from about where Id = ?';
  let query = db.query(sql,[req.params.id], (err,result) => {
      
      if(err) throw err;
      console.log(result)
      res.send(result);
      
  });
});




  module.exports = router;