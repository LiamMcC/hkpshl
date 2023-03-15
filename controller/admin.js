var express = require('express');

var router = express.Router();

router.use(require('./user'))
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var db = require('../db');


// function to render the home page
router.get('/administratiion', function(req, res){
    console.log(req.user)
    res.render('admin', {user : req.user});
    
  });




  router.post('/addabout', function(req, res){
    var peewee = req.body.description
    var newpeewe = peewee.replace(/(?:\r\n|\r|\n)/g, '<br>')
    // ***** Note to have these preformatted in EJS use <%- instead of <%=
    let sql = 'INSERT INTO about (Title, Description, Image, ImageTitle) VALUES (?,?,?,?)';
    let query = db.query(sql, [req.body.title, newpeewe, req.body.image, req.body.imagetitle],(err,res) => {
        
        if(err) throw err;
        
       
        
    });
    
    res.redirect('/admin');
  });
  
  



  module.exports = router;