if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcrypt');
const initializePassport = require('./passport-config.js');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const { request } = require('express');
const methodOverride = require('method-override')
const app = express();
const PORT = 3030;

const users = [];

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id),
);

app.set('view-engin', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { user: req.user.name });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,

}));

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    }
    users.push(user);
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
  console.log(users)
});

app.delete('/logout', (req,res) => {
  req.logOut();
  res.redirect('/login');
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  } else {
    next();
  }
}


app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});