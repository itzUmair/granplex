export const logger = async (req, res, next) => {
  const requestTime = new Date().toLocaleString();
  console.log(`${req.method} => ${req.url} @ ${requestTime}`);
  next();
};
