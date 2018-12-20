const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const express = require('express')
const app = express()
const bodyParser= require('body-parser')
const port=process.env.PORT || 8080
app.set('view engine', 'pug')
app.use(express.static('public'))
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
var con ;

const userSchema= new Schema({
	userid: {type:String, required:true, trim:true,index:true,unique:true},
	chips: {type:Number}
});

const userModel = mongoose.model('users',userSchema);
const alex = new userModel({userid:'Clink',chips:22000,regdate:Date.now});
const cb = function(err){
	if(!err)
		console.log("Connection Opened");
	else
		console.log("Connection Opened Failed");
    };
    
mongoose.connect("mongodb://someuser:someuser1@ds161312.mlab.com:61312/producttuorial", { useNewUrlParser: true }, cb);
mongoose.set('useCreateIndex', true);
con = mongoose.connection;


app.use(bodyParser.urlencoded({extended: true}))

app.listen(port, () => console.log(`Listening on port ${port}!`))


  app.get('/view', (req, res) => {
    const echoRecords = ((err, docs) => {
        if (err) return console.log(err)
       res.render('index', {users: docs})
      })
      userModel.find(echoRecords)
  })



  app.post('/new', function(req, res){
	new userModel({
		userid    : req.body.userid,
		chips   : req.body.chips				
	}).save(function(err, doc){
		if(err) res.json(err);
        else  
        console.log('Successfully inserted!')
        res.redirect('/view')
    });
});


app.get('/view/:id/delete', function(req, res){
    userModel.deleteOne({_id: req.params.id}, 
	   function(err){
		if(err) res.json(err);
		else    res.redirect('/view');
	});
});


app.get('/view/:id/edit', function(req, res){
    const echoRecords = ((err, docs) => {
        if (err) return console.log(err)
       res.render('edit', {users: docs})
      })
      userModel.find({_id:req.params.id},echoRecords); 
	
}); 


app.get('/view/:id', (req, res) => { 
    const echoRecords = ((err, docs) => {
        if (err) return console.log(err)
       res.render('show', {users: docs})
      })
      userModel.find({_id:req.params.id},echoRecords); 
  })
 

app.put('/view/:id', function(req, res){
       userModel.findOneAndUpdate({_id: req.params.id},  
        { $set:
            {userid: req.body.userid,
            chips  : req.body.chips
                   }}, 
                   function(err, docs){
                     if(err) res.json(err);
                       res.redirect('/view/'+req.params.id);
                    })
                });