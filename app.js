require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { errors: celebrateErrors } = require('celebrate');

const { signup, signin } = require('./controllers/users');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');

const app = express();
const { PORT = 3000, MONGO_URI, NODE_ENV } = process.env;

// --- MIDDLEWARE JSON ---
app.use(express.json());

// --- CONFIGURAR CORS ---
const allowedOrigins = [
  'https://news-exp.chickenkiller.com',
  'http://localhost:3000',
];
app.use(cors({ origin: allowedOrigins }));
app.options('*', cors());

// --- RUTAS PÚBLICAS ---
app.post('/signup', signup);
app.post('/signin', signin);

// --- AUTORIZACIÓN ---
app.use(auth);

// --- RUTAS PRIVADAS ---
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

// --- SERVIR FRONTEND EN PRODUCCIÓN ---
if (NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'frontend');
  app.use(express.static(distPath));

  // Todas las rutas no encontradas servirán index.html (SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// --- MIDDLEWARE DE CELEBRATE Y ERRORES ---
app.use(celebrateErrors());
app.use(errorHandler);

// --- MIDDLEWARE 404 ---
app.use((req, res) => res.status(404).send({ message: 'Ruta no encontrada' }));

// --- CONEXIÓN A MONGODB Y ARRANQUE DEL SERVIDOR ---
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

module.exports = app;