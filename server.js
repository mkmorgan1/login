const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3030;

const users = [];

app.set('view-engin', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index.ejs', { user: 'kyle' });
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});
app.post('/login', (req, res) => {

});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});
app.post('/register', async (req, res) => {
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


app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});