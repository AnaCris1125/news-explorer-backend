const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET = 'dev-secret' } = process.env;

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ email, password: hashedPassword, name });
    res.status(201).send({ email: user.email, name: user.name });
  } catch (err) {
    if (err.code === 11000) return res.status(409).send({ message: 'Email ya registrado' });
    res.status(400).send({ message: 'Error en datos del usuario' });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).send({ message: 'Email o contraseña incorrectos' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send({ message: 'Email o contraseña incorrectos' });

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.send({ token });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });
  res.send({ email: user.email, name: user.name });
};

module.exports = { signup, signin, getCurrentUser };