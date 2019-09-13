const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // pass JSON Web Token via header, verify it and throw error if is invalid
    const token = req.headers.authorization.split(' ')[1];
    // retrieve id while decoding a token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY,);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json( {message: 'Nie zalogowano'} );
  }
}
