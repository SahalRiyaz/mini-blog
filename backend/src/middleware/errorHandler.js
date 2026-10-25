export function notFoundHandler(req, res, next) {
  res.status(404).json({ error: `Not Found - ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error('[Server Error]', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  // Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `An account with this ${field} already exists.` });
  }

  // CastError (e.g. invalid MongoDB ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
}
