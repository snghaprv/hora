var moment = require('moment');
var ObjectId = require('mongodb').ObjectId;
module.exports = {
  
   getTaskList : function (req,res) {
     let worker_id = req.token.id;
     let filter = req.body.filter || null;
     let sort_order = req.body.sort_order || null;
     let myX = req.body.lat || null;
     let myY  = req.body.lon || null;
     let my_skills = req.token.skills || [1,2];
  
     var db = Tasks.getDatastore().manager;
     var Collection = db.collection(Tasks.tableName);
   
     Collection.find({status : 'initiated',
       rejected_by_workers : {$ne : [ObjectId(req.token.id)]},
         category : {$in : my_skills}
     }
       ).toArray().then(data => {
       console.log(sort_order);
       console.log(data);
       if(sort_order){
         console.log("I am here");
         data = data.sort( (a,b)=>{
           a.distance = Math.sqrt(Math.pow((a.location.lat - myX) ,2) + Math.pow((a.location.lon - myY) ,2))
           b.distance = Math.sqrt(Math.pow((a.location.lat - myX) ,2) + Math.pow((a.location.lon - myY) ,2))
           console.log("$$$$$$$");
           console.log(a);
           if (a.distance > b.distance){
             return -1
           } else {
             return 1
           }
         })
       }
       
       return res.ok(data);
     }, err => {
       console.log(err);
       return res.serverError(err);
     })
   },
  
  RejectTask : function(req,res){
    var db = Tasks.getDatastore().manager;
    var Collection = db.collection(Tasks.tableName);
    
    Collection.update({_id : ObjectId(req.body.task_id)},
      {$push : {rejected_by_workers: ObjectId(req.token.id)}
      }).then(data =>{
        
        res.ok(data);
    }, error => {
        res.serverError(error);
    })
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
    var id = req.body.task_id;
    if (!req.body.rating) {
      res.serverError({error : "rating missing!!"});
    }
  
    Tasks.update({id:id}, {consumer_rating: req.body.rating }).then(
      data =>{
        return res.ok({success: true});
      }, err => {
        return res.serverError({error : error})
      }
    )
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
