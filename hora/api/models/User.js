
module.exports = {
  attributes: {
    first_name: {
      type: 'string',
      allowNull: true
    },
    last_name: {
      type: 'string',
      allowNull: true
    },
    date_of_birth: {
      type: 'string',
      columnType: 'datetime',
      allowNull: true
    },
    phone: {
      type: 'number',
      unique: true,
      required: true
    },
    gender: {
      type: 'string',
      isIn: ['Male', 'Female'],
      allowNull: true
    },
    registration_status: {
      type: 'string',
      defaultsTo: 'initiated',
      isIn: ['initiated', 'phone_verified', 'completed']
    },
    otp: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [
        /* 	{
			"pin" : 4424,
			"timestamp" : "2018-06-02 11:35:58"
		}   */
      ]
    }, role : {
      type: 'string',
      isIn: ['worker', 'consumer'],
      defaultsTo: 'consumer'
      
    }}}
