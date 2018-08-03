const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  sex: {type: String, enum: ['Masculine', 'Femenine']}
});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;