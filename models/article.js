const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'La palabra clave es obligatoria'],
  },
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
  },
  text: {
    type: String,
    required: [true, 'El texto es obligatorio'],
  },
  date: {
    type: String,
    required: [true, 'La fecha es obligatoria'],
  },
  source: {
    type: String,
    required: [true, 'La fuente es obligatoria'],
  },
  link: {
    type: String,
    required: [true, 'El enlace es obligatorio'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'El enlace debe ser una URL válida',
    },
  },
  image: {
    type: String,
    required: [true, 'La imagen es obligatoria'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'La imagen debe ser una URL válida',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false, // 🚫 no devolver el owner directamente
  },
});

module.exports = mongoose.model('article', articleSchema);