var express = require("express"); // call express to be used by the application.
var app = express();


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var db = require('./db');
// set the template engine 
app.set('view engine', 'ejs'); 



app.use(express.static("views")); 
app.use(express.static("images")); 
app.use(express.static("sass")); 
app.use(express.static("js")); 
app.use(express.static("css")); 
app.use(express.static("font")); 
app.use(express.static("partials")); 
app.use(express.static("uploads")); 
app.use(express.static("uploads/resized")); 

app.use(require('./routes.js'));


//catch all endpoint will be Error Page
app.get("*", function(req,res){
  var cookiePolicyAccept = req.cookies.acceptCookieBrowsing
  res.render('oops', {cookiePolicyAccept});
});
    
      // custom error handling if it is 404 render 404 page
app.use((req, res, next) => {
  const err = new Error(res.render('oops'))
  err.status = 404
  //res.render('oops');
  next(err) 
});




app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
    console.log("App is Running ......... Yessssssssssssss!")
  });