const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'Utworzono użytkownika',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Wystąpił błąd podczas tworzenia konta'
          });
        });
    });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  // check user by email
  User.findOne({ email: req.body.email })
    .then(user => {
      // send error response that there is no such user
      if (!user) {
        return res.status(401).json({
          message: 'Niepoprawna nazwa użytkownika'
        });
      }
      fetchedUser = user;
      // compare given password with database user password
      return bcrypt.compare(req.body.password, user.password);
    })
    // send error response if passwords are different
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Niepoprawne hasło'
        });
      }
      // create JSON Web Token, that lasts 1 hour
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: '1h'}
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          email: fetchedUser.email,
          message: 'Zalogowano'
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'Wystąpił błąd podczas logowania'
      });
    });
}

exports.deletePost =
(req, res, next) => {
Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
  .then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion successful"});
    } else {
      res.status(401).json({ message: "Deletion failed, user not authorized"});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Błąd odczytu danych'
    });
  });
}
