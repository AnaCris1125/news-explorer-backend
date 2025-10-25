require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errors');

const { PORT = 3000, MONGO_URI } = process.env;

const app = express();

// Middleware para JSON
app.use(express.json());

// Rutas
app.use('/', routes);

// Middleware Celebrate para validaciones
app.use(errors());

// Middleware centralizado de errores
app.use(errorHandler);

// Middleware 404
app.use((req, res) => res.status(404).send({ message: 'Ruta no encontrada' }));

// Verificar que la variable de entorno se está leyendo
console.log('MONGO_URI =', MONGO_URI);

// Conectar a MongoDB y arrancar servidor
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
})
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));