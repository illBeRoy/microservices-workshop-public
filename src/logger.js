export const logger = () =>
  (req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method.toUpperCase()}] ${req.path} ${JSON.stringify(req.query || req.body)}`);
    }

    next();
  };
