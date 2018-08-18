var moment = require('moment');
var ObjectId = require('mongodb').ObjectId;
module.exports = {
  
   getTaskList : function (req,res) {
     let worker_id = req.token.id;
     let filter = req.body.filter || null;
     let sort_order = re.body.sort_order || null;
     let myX = req.body.lat || null;
     let myY  = req.body.lon || null;
  
     var db = Tasks.getDatastore().manager;
     var Collection = db.collection(Tasks.tableName);
   
     Collection.find({task_status: {$ne: 'completed' }}).toArray().then(data => {
       console.log(data);
       return res.ok(data);
     }, err => {
       console.log(err);
       return res.serverError(err);
     })
     
   },
  
  RejectTask : function(req,res){
  
  
  },
  AcceptTask : function (req,res) {
  
     let  task_id = req.body.task_id;
     Tasks.update({_id : task_id}, {worker_id: req.token.id}).then(data =>{
       console.log(data);
       res.ok(data);
     },error => {
       console.log(error);
       res.serverError(error);
     })
  
  },
  
  RateConsumer : function (req,res) {
  
  },
  
  MyWorkHistory : function(req,res){
  
    var db = Tasks.getDatastore().manager;
    var Collection = db.collection(Tasks.tableName);
    Collection.find({worker_id : ObjectId(req.token.id), task_status: 'completed' }).toArray().then(data =>{
       console.log(data);
       res.ok(data);
     }, error =>{
       console.log(error);
       res.serverError(err);
       
     })
     
  }
  
}
