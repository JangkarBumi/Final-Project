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

const productSchema = new Schema({
	title: {type:String},
    review: {type:Number},
    price: {type:String},
    stock: {type:Number},
    description: {type:String}
});

const productModel = mongoose.model('product',productSchema);
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
      productModel.find(echoRecords)
  })



  app.post('/new', function(req, res){
	new productModel({
        title: req.body.title,
        review: req.body.review,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description				
	}).save(function(err, doc){
		if(err) res.json(err);
        else  
        console.log('Successfully inserted!')
        res.redirect('/view')
    });
});


app.get('/view/:id/delete', function(req, res){
    productModel.deleteOne({_id: req.params.id}, 
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
      productModel.find({_id:req.params.id},echoRecords); 
	
}); 


app.get('/view/:id', (req, res) => { 
    const echoRecords = ((err, docs) => {
        if (err) return console.log(err)
       res.render('show', {users: docs})
      })
      productModel.find({_id:req.params.id},echoRecords); 
  })
 

app.put('/view/:id', function(req, res){
       productModel.findOneAndUpdate({_id: req.params.id},  
        { $set:
            {title: req.body.title,
                review: req.body.review,
                price: req.body.price,
                stock: req.body.stock,
                description: req.body.description		
                   }}, 
                   function(err, docs){
                     if(err) res.json(err);
                       res.redirect('/view/'+req.params.id);
                    })
                });