export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate key error',
      key: err.keyValue,
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  res.status(500).json({
    message: 'Internal server error',
  });
}
