var UtilService = require('../services/UserUtils.js');
var moment = require('moment');
var ObjectId = require('mongodb').ObjectId;

module.exports = {
  sendOTP: function(req, res) {
    if (!req.body.phone_number) {
      return UtilService.serverError(res, 'No Phone Number');
    }
    
    var otp = UtilService.generateOTP();

    
    User.findOrCreate(
      { phone: req.body.phone_number },
      { phone: req.body.phone_number }
    ).then(
      data => {
        
        console.log(data);
        var db = User.getDatastore().manager;
        var Collection = db.collection(User.tableName);
        
        Collection.update(
          { phone: Number(req.body.phone_number) },
          {
            $push: {
              otp: {
                pin: otp,
                timestamp: new Date(moment().format('YYYY-MM-DD HH:mm:ss'))
              }
            }
          },
          (err, result) => {
            if (err) {
              return res.serverError(err);
            }
            return res.ok({
              success: true
            });
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  },

  verifyOTP : function (req,res) {
  
    console.log("I am gere");
    if (!req.body.phone_number) {
      return res.serverError(res, 'No Phone Number');
    }
 
    if (!req.body.otp) {
      return res.serverError(res, 'No OTP');
    }
  
  
    var db = User.getDatastore().manager;
    var Collection = db.collection(User.tableName);
  
    Collection.aggregate([
      {
        $match: {
          phone: Number(req.body.phone_number)
        }
      },
      {
        $unwind: {
          path: '$otp'
        }
      },
      {
        $sort: { 'otp.timestamp': -1 }
      },
      { $limit: 1 }
    ]).toArray((err,data) => {
  
      if (err || data.length == 0) {
        return res.serverError(res, 'Wrong Phone Number');
      }
      var user = data[0];
  
      var user_token = { _id: user._id };
      if (data[0]['otp']['pin'] == req.body.otp) {
        let token = JwtService.issue (
          {
            user_token
          },
          86400 * 365
        );
        return res.ok({
          token: token})
      } else {
        return res.serverError({error :"Incorrect OTP"})
      }
      } )
    
    
  }

}
