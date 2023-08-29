export const logger = async (req, res, next) => {
  const requestTime = new Date().toLocaleString();
  console.log(`${req.method} => ${req.url} @ ${requestTime}`);
  next();
};

export const authentication = (req, res, next) => {
  const authCookie = req.cookies._auth;

  if (req.url.endsWith("/signin") || req.url.endsWith("/signup")) {
    next();
    return;
  }

  if (!authCookie) {
    return res
      .status(401)
      .send({ message: "You are not authorized to access the API." });
  }
};
