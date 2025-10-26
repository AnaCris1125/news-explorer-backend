require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { errors: celebrateErrors } = require('celebrate');

const { signup, signin, getCurrentUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');

const app = express();
const { PORT = 3000, MONGO_URI, NODE_ENV } = process.env;

// --- MIDDLEWARES ---
app.use(express.json());

// Configurar CORS
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
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));

// SPA routing: todas las rutas apuntan a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// --- MIDDLEWARE CELEBRATE Y ERRORES ---
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
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
    process.exit(1);
  });

module.exports = app;