/**
 * ConsumerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var moment = require('moment');
var ObjectId = require('mongodb').ObjectId;
module.exports = {

CreateTask : function (req,res) {
  
  if(!req.body.category){
    res.serverError({error :" Cateogry missing!! "})
  }
  if(!req.body.name){
    res.serverError({error :" name missing!! "})
  }
  if(!req.body.description){
    res.serverError({error :" description missing!! "})
  }
  
  let params = {
    consumer_id : req.token.id,
    name : req.body.name,
    category : req.body.category,
    timestamp: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
    description : req.body.description,
    task_id : Math.ceil(new Date().getTime() / 1000),
    scheduled_time : moment(
      req.body.scheduled_time,
      'DD-MMM-YYYY HH:mm:ss'
    ).utcOffset(-330)
      .format('YYYY-MM-DD HH:mm:ss'),
    location : {
      lat : req.body.lat,
      lon : req.body.lon
    }
  }
  
  Tasks.create(params).meta({ fetch: true }).then( data =>{
  console.log(data);
  
  return res.ok({data:data});
  },err => {
    console.log(err);
    res.serverError(err);
  })
},
  
  MyHistory : function (req,res) {
  console.log(req.token.id);
    var db = Tasks.getDatastore().manager;
    var Collection = db.collection(Tasks.tableName);
    
  Tasks.find({consumer_id: req.token.id}).then(
    data =>{
      console.log(data);
      var rating_array = data.map(x => x.consumer_rating).filter( x => x >0);
      var avg_rating = rating_array.reduce((a,c) => a+c,0)/(rating_array.length ||1);
      
      console.log("rating_array");
      console.log(avg_rating);
      if(avg_rating>0){
       return res.ok({data,avg_rating});
      }
     return res.ok({data});
    },err => {
      console.log(err);
     return res.serverError(err);
    })
  },
  RateTask : function (req,res) {
  
  var id = req.body.task_id;
  if (!req.body.rating) {
    res.serverError({error : "rating missing!!"});
  }
  
  Tasks.update({id:id}, {worker_rating: req.body.rating }).then(
    data =>{
      return res.ok({success: true});
    }, err => {
      return res.serverError({error : error})
    }
  )
  
  
  }

};

