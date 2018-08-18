'use strict';
const jwt = require('jsonwebtoken');
const secret = 'thisisbolosecret';

module.exports = {
  issue: (payload, expiresIn) => {
    return jwt.sign(
      {
        payload
      },
      secret,
      { expiresIn }
    );
  },
  verify: token => {
    return jwt.verify(token, secret);
  }
};
