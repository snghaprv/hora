/**
 * Tasks.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    task_id :{
      type: 'number',
      required: true,
    },
    consumer_id :{
      model: 'User',
      columnName: 'consumer_id',
      required: true},
    worker_id : {
      model: 'User',
      columnName: 'worker',
      required: false
    },
    consumer_rating: {
      type: 'number',
      defaultsTo:0,
      isIn: [1,2,3,4,5]
    },
    worker_rating: {
      type: 'number',
      defaultsTo:0,
      isIn: [1,2,3,4,5]
    },
    name : {
      type: 'string',
      allowNull: true
    },
    category : {
      type: 'string',
      allowNull: true
    },
    timestamp: {
      type: 'string',
      columnType: 'datetime',
      allowNull: true
    },
    description : {
      type: 'string',
      allowNull: true
    }
  },task_status: {
    type: 'string',
    defaultsTo: 'initiated',
    isIn: ['initiated', 'assigned', 'completed',]
  }

};

