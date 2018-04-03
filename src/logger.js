export const logger = () =>
  (req, res, next) => {
    console.log(`[${req.method.toUpperCase()}] ${req.path} ${JSON.stringify(req.query || req.body)}`);
    next();
  };
