const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Correo electrónico no válido',
    },
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    select: false, // 🚫 no devolver la contraseña por defecto
  },
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);