var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));

var bcrypt = require('bcrypt-nodejs');
var db = require('../db');
router.use(require('./user'))
// function to render the home page
var Email = require('./email')

const multer = require('multer');
const path = require('path');
const sharp = require('sharp')
const fs = require('fs');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './uploads/');
  },
 
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
 
var upload = multer({ storage: storage })



function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}

function isAdmin(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.user.adminRights)
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}

router.get('/administration', isLoggedIn, isAdmin, function(req, res){
  var adminRights = req.user.adminRights 
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
    res.render('adminpage', {user: req.user, adminRights, cookiePolicyAccept});
  });


router.get('/addabout', isLoggedIn, isAdmin, function(req, res){  
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing  
    res.render('addabout', {user: req.user, cookiePolicyAccept});
  });



router.get('/allabout', isLoggedIn, isAdmin, function(req, res){    
  let sql = 'select * from about';
  let query = db.query(sql, (err,result) => { 
      if(err) throw err;
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      res.render('allabout', {result, user: req.user,cookiePolicyAccept});
      });
  });
 

  router.get('/editabout/:which/:id', isLoggedIn, isAdmin, function(req, res){ 
    let sql = 'select * from about where Id = ?';
    let query = db.query(sql,[req.params.id], (err,result) => {       
        if(err) throw err;    
        var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
        res.render('editabout', {result, user: req.user, cookiePolicyAccept});        
    });
  });
  


router.post('/addabout', isLoggedIn, isAdmin, upload.single("image"), async function(req, res){
    const { filename: image } = req.file;      
    await sharp(req.file.path)
        .resize(500, 500)
        .jpeg({ quality: 90 })
        .toFile(
            path.resolve(req.file.destination,'resized',image)
        )
        //fs.unlinkSync(req.file.path)

    var peewee = req.body.description
    var newpeewe = peewee.replace(/(?:\r\n|\r|\n)/g, '<br>')
    // ***** Note to have these preformatted in EJS use <%- instead of <%=
    let sql = 'INSERT INTO about (Title, Description, Image, ImageTitle, summary, babyBit,bubble) VALUES (?,?,?,?,?,?,?)';
    let query = db.query(sql, [req.body.title, newpeewe, req.file.filename, req.body.imagetitle, req.body.blurb, req.body.babybit, req.body.bubble],(err,res) => {
        
        if(err) throw err;
        
       
        
    });
    
    res.redirect('/allabout');
  });


  router.get('/deleteabout/:id', isLoggedIn, isAdmin, upload.single("image"), async function(req, res){
    let sql = 'DELETE FROM about WHERE Id = ?';
    let query = db.query(sql, [req.params.id],(err,res) => {
      
        if(err) throw err;
      
    });
    
    res.redirect('/allabout');
  });
  


  router.post('/editabout/:id', isLoggedIn, isAdmin, upload.single("image"), async function(req, res){
   

    var peewee = req.body.description
    var newpeewe = peewee.replace(/(?:\r\n|\r|\n)/g, '<br>')
    
    let sql = 'UPDATE about SET Title = ? , Description = ?, Image = ?, ImageTitle = ? , summary = ? , babyBit = ? ,bubble = ?, onShow = ?, myChoice = ? WHERE Id = ?';
    let query = db.query(sql, [req.body.title, newpeewe, req.body.Image, req.body.imagetitle, req.body.blurb, req.body.babybit, req.body.bubble, req.body.onshow, req.body.mychoice, req.params.id,],(err,res) => {
        
        if(err) throw err;
      
    });
    
    res.redirect('/allabout');
  });
  
// *************** News Routes

router.get('/allnews', isLoggedIn, isAdmin, function(req, res){    
  let sql = 'select * from news';
  let query = db.query(sql, (err,result) => {
      if(err) throw err;
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      res.render('allnews', {result, user: req.user, cookiePolicyAccept});
      });
  });

router.get('/addnews', isLoggedIn, isAdmin, function(req, res){    
    var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
    res.render('addnews', {user: req.user, cookiePolicyAccept});
    
  });


router.post('/addnews', isLoggedIn, isAdmin, upload.single("image"), async function(req, res){
  const { filename: image } = req.file;      
  await sharp(req.file.path)
      .resize(500, 500)
      .jpeg({ quality: 90 })
      .toFile(
          path.resolve(req.file.destination,'resized',image)
      )
      //fs.unlinkSync(req.file.path)

  var peewee = req.body.description
  var newpeewe = peewee.replace(/(?:\r\n|\r|\n)/g, '<br>')
  // ***** Note to have these preformatted in EJS use <%- instead of <%=
  let sql = 'INSERT INTO news (Title, Description, Image, ImageTitle) VALUES (?, ?, ?, ?)';
  let query = db.query(sql, [req.body.title, newpeewe, req.file.filename, req.body.imagetitle],(err,res) => {
      
      if(err) throw err;
      
     
      
  });
  
  res.redirect('/allnews');
});



router.get('/editnews/:which/:id', isLoggedIn, isAdmin, function(req, res){ 
  let sql = 'select * from news where Id = ?';
  let query = db.query(sql,[req.params.id], (err,result) => {       
      if(err) throw err;    
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      res.render('editnews', {result, user: req.user, cookiePolicyAccept});        
  });
});


router.post('/editnews/:id', isLoggedIn, isAdmin, upload.single("image"), async function(req, res){
  var peewee = req.body.description
  var newpeewe = peewee.replace(/(?:\r\n|\r|\n)/g, '<br>')
  let sql = 'UPDATE news SET Title = ? , Description = ?, Image = ?, ImageTitle = ? ,  onShow = ?, myChoice = ? WHERE Id = ?';
  let query = db.query(sql, [req.body.title, newpeewe, req.body.Image, req.body.imagetitle,  req.body.onshow, req.body.mychoice, req.params.id,],(err,res) => {     
      if(err) throw err;   
  });
        res.redirect('/allnews');
});




// *************** News Routes





// *************** Staff Routes

router.get('/allstaff', isLoggedIn, isAdmin, function(req, res){    
  let sql = 'select * from staff';
  let query = db.query(sql, (err,result) => {
      if(err) throw err;
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      res.render('allstaff', {result, user: req.user, cookiePolicyAccept});
      });
  });

router.get('/addstaff', isLoggedIn, isAdmin, function(req, res){ 
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing   
    res.render('addstaff', {user: req.user, cookiePolicyAccept});
  });


router.post('/addstaff', isLoggedIn, isAdmin, upload.single("image"), async function(req, res){
  const { filename: image } = req.file;      
  await sharp(req.file.path)
      .resize(500, 500)
      .jpeg({ quality: 90 })
      .toFile(
          path.resolve(req.file.destination,'resized',image)
      )
      //fs.unlinkSync(req.file.path)

  var peewee = req.body.description
  var newpeewe = peewee.replace(/(?:\r\n|\r|\n)/g, '<br>')
  // ***** Note to have these preformatted in EJS use <%- instead of <%=
  let sql = 'INSERT INTO staff (Name, Description, Image, babyBit, bubble) VALUES (?, ?, ?, ?, ?)';
  let query = db.query(sql, [req.body.name, newpeewe, req.file.filename, req.body.babybit, req.body.bubble],(err,res) => {
      
      if(err) throw err;
      
     
      
  });
  
  res.redirect('/allstaff');
});



router.get('/editstaff/:who/:id' , isLoggedIn, isAdmin, function(req, res){ 
  let sql = 'select * from staff';
  let query = db.query(sql, (err,result) => {
      if(err) throw err;
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      res.render('editstaff', {result, user: req.user, cookiePolicyAccept});
      });
  });


router.post('/editstaff/:who/:id', isLoggedIn, isAdmin, upload.single("image"), async function(req, res){
  var peewee = req.body.description
  var newpeewe = peewee.replace(/(?:\r\n|\r|\n)/g, '<br>')
  let sql = 'UPDATE staff SET Name = ? , Description = ?, Image = ?, babyBit = ?, bubble = ?, onShow = ?, myChoice = ? WHERE Id = ?';
  let query = db.query(sql, [req.body.name, newpeewe, req.body.Image, req.body.babybit, req.body.bubble, req.body.onshow, req.body.mychoice, req.params.id,],(err,res) => {     
      if(err) throw err;   
  });
        res.redirect('/allstaff');
});




// *************** Staff Routes
 


// ************** Content Routes

router.get('/websitedata',  isLoggedIn, isAdmin, function(req, res){ 
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
    res.render('websitedata', {user: req.user, cookiePolicyAccept})
});



router.get('/allimages',  isLoggedIn, isAdmin, function(req, res){ 
    const testFolder = './uploads/resized/';
      fs.readdir(testFolder, (err, files) => {
      files.forEach(file => {
        //console.log(file);
      });
      var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
      res.render('allimages', {user: req.user, files, cookiePolicyAccept})
    });
});
  

router.get('/deleteimage/:id', isLoggedIn, isAdmin, function(req, res){ 
const path = './uploads/resized/'
fs.unlink(path + req.params.id, (err) => {
    if (err) {
    console.error(err)
    return
    }
    res.redirect('/allimages')
    //file removed
    })
});



router.get('/newimage',  isLoggedIn, isAdmin, function(req, res){ 
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
  res.render('newimage', {user: req.user, cookiePolicyAccept})
});


router.post('/newimage', isLoggedIn, isAdmin, upload.single("image"), async function(req, res){
  const { filename: image } = req.file;      
  await sharp(req.file.path)
      .resize(500, 500)
      .jpeg({ quality: 90 })
      .toFile(
          path.resolve(req.file.destination,'resized',image)
      )
      //fs.unlinkSync(req.file.path)


  
  res.redirect('/allimages');
});

// ************** Content Routes



// ************************ reset Password Links


router.get('/resetpassword', function(req, res, next) {
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
  res.render('resetpassword', {user: req.user,cookiePolicyAccept})
});


router.post('/changepassword',  isLoggedIn, isAdmin, function(req, res, next){  // I have this restricted for admin just for proof of concept
  //let sql = 'select * FROM clue where status = "active"; ' 
  var deletedAcc = bcrypt.hashSync(req.body.password, null, null)  // use the generateHash function in our user model
  let sql = 'update users set password = "'+deletedAcc+'" where userName = "'+req.user.userName+'";' 

    

  let query = db.query(sql, (err,result) => {
     if(err) throw err;
     Email.resetPass()
      res.redirect('/logout')
      
  });

 });



// ************************ reset Password Links
  module.exports = router;