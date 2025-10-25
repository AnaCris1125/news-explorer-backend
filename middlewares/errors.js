const { isCelebrateError } = require('celebrate');

module.exports = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body') || err.details.get('params');
    return res.status(400).send({ message: errorBody.message });
  }

  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Error interno del servidor' : message
  });
};