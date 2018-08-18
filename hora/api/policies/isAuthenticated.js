'use strict';
var JwtService = require('../services/JwtService.js');
var moment = require('moment');
var ObjectId = require('mongodb').ObjectId;

module.exports = (req, res, next) => {
  if (!req.headers || !req.headers.authorization) {
    return res.badRequest({ error: 'No Authorization header found' });
  }

  let tokenParam = req.headers.authorization;
  const verifiedToken = JwtService.verify(tokenParam);

  var db = User.getDatastore().manager;
  var Collection = db.collection(User.tableName);
  

  var criteria = { _id: ObjectId(verifiedToken.payload.user_token._id) };
  var updates = {
    $set: {
      last_login: moment()
        .utcOffset(0)
        .format('YYYY-MM-DD HH:mm:ss')
    }
  };

  Collection.findOneAndUpdate(
    criteria,
    updates,
    { returnOriginal: false },
    (err, data) => {
      if (err) {
        return next({ error: 'Something went wrong!!' });
      } else if (data.value) {
        var user = data.value;
        user.id = user._id.toString();
        req.token = user;
        next();
      } else {
        return next({ error: 'Invalid Credentials!!' });
      }
    }
  );
};
