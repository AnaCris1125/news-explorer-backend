require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const { PORT = 3000, MONGO_URI } = process.env;

const app = express();

app.use(express.json());

// Rutas
app.use('/', routes);

const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errors');

app.use(errors()); // middleware celebrate
app.use(errorHandler); // middleware centralizado

// Middleware 404
app.use((req, res) => res.status(404).send({ message: 'Ruta no encontrada' }));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));