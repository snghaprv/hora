module.exports = {
  generateOTP: function generateOTP() {
    // Creating 4-digit OTP for login.
    return Math.floor(1000 + Math.random() * 9000);
  },
  
  generateSMS: function generateSMS(otp) {
    return otp + ' is your OTP - Team Boloo';
    // return otp + " is your one time password for healthfront" ;
  }}
