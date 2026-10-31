export function notFound(_req, res) { res.status(404).json({ error: 'That route was not found.' }); }
export function errorHandler(error, _req, res, _next) {
  let status = Number(error.status) || 500;
  let message = 'Something went wrong. Please try again.';

  if (error.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body must contain valid JSON.';
  } else if (error.type === 'entity.too.large') {
    status = 413;
    message = 'Request body is too large.';
  } else if (error.name === 'CastError') {
    status = 400;
    message = 'Invalid mystery ID.';
  } else if (error.name === 'ValidationError' || error.name === 'ZodError') {
    status = 400;
    message = 'Request data is invalid.';
  } else if (error.code === 11000) {
    status = 409;
    message = 'This request conflicts with an existing record.';
  } else if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
    status = 503;
    message = 'The database is temporarily unavailable. Please try again shortly.';
  } else if (status >= 400 && status < 500) {
    message = error.message || 'The request could not be completed.';
  }

  if (status >= 500) console.error('Request failed:', { name: error.name, code: error.code });
  res.status(status).json({ error: message });
}
