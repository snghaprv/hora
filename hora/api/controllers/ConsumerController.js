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
      .format('YYYY-MM-DD HH:mm:ss')
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
      res.ok({data});
    },err => {
      console.log(err);
      res.serverError(err);
    })
  }

};

