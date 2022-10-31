const config = require('./config');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require("path");
const handlebars = require("handlebars");
const bcrypt = require("bcryptjs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, config.staticDir + "/uploads/tmp");
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, Date.now() + '-' + fileName)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log("file upload middleware -->>")
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
});

const getToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      accountType: user.accountType
    },
    config.JWT_SECRET,
    {
      expiresIn: '48h',
    }
  );
};

const isAuth = (req, res, next) => {
  if(req.user) 
    next();
  else
    return res.status(401).send({ message: 'Token is not supplied.' });
};

const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(401).send({ message: 'Admin Token is not valid.' });
};

const isStudent = req => {
  if(req.user && req.user.accountType === 0)
    return true;
  return false;
}

const isTeacher = req => {
  if(req.user && req.user.accountType === 1)
    return true;
  return false;
}

const hashToken = str => {
  return bcrypt.hashSync(str, config.bcryptSalt);
}
const compareToken = (str, hash) => {
  return bcrypt.compareSync(str, hash);
}

const renderHtmlTemplate = (filepath, params) => {
  filepath = path.join(__dirname, filepath);
  const source = fs.readFileSync(filepath, "utf-8").toString();
  const template = handlebars.compile(source);
  
  console.log(params)
  console.log(template(params))

  return template(params);
}

module.exports = { upload, getToken, isAuth, isAdmin, isStudent, isTeacher, hashToken, compareToken, renderHtmlTemplate };
