const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkpointSchema = new Schema({
  checkpointDate: {type: Date, default: Date.now},
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  weight: Number,
  bf: Number,
  fat: Number,
  lbm: Number
});

checkpointSchema.set('timestamps', true);

const checkpoint = mongoose.model('checkpoint', checkpointSchema);

module.exports = checkpoint;



