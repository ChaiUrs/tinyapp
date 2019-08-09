
/*************** GLOBAL CONTENT ***************/
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { generateRandomString, getUseridByEmail, urlsForUser } = require('./helper.js');

/*************** CONFIGURATION ***************/
app.use(bodyParser.urlencoded({extended: true}));
//app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'session',
  keys: ['secret-key1', 'secret-key2'],
  maxAge: 24 * 60 * 60 * 1000 //24 hours
}));

/*************** URLs database ***************/
//Added a new userID property to individual url objects within the urlDatabase
let urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: 'aJ48lW' },
  "9sm5xK": { longURL: "http://www.google.com", userId: 'aJ48lW' }
};

/*************** Users Object ***************/
let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

/*************** ROOT Page ***************/
app.get('/', (req, res) => {
  if (users[req.session.userId]) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

/*************** MAIN/INDEX Page ***************/
app.get('/urls', (req, res) => {
  if (req.session.userId === undefined) {
    res.status(403).send("Please LOGIN!!!");
    res.redirect('/login');
  }
  let templateVars = {
    urls: urlsForUser(req.session.userId),
    user: req.session.userId,
    email: req.session.email
  };
  res.render('urls_index.ejs', templateVars);
});

/*************** Created new shortURLs Page ***************/
app.get('/urls/new', (req, res) => {
  if (req.session.userId === undefined) {
    res.status(403).send("Please LOGIN!!!");
    res.redirect('/login');
  }
  let templateVars = {
    urls: urlDatabase,
    user: req.session.userId,
    email: req.session.email
  };
  res.render('urls_new.ejs', templateVars);
});

/*************** SHOWS updated shortURLs Page ***************/
app.get('/urls/:shortURL', (req, res) => {
  if (req.session.userId === undefined) {
    res.status(403).send("Please LOGIN!!!");
    res.redirect('/login');
  }
  
  //if user is logged in & owns the URL for given ID
  let templateVars = {
    urls: urlDatabase,
    user: req.session.userId,
    email: req.session.email,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render('urls_show.ejs', templateVars);
  res.status(404).send('ERROR!!! This URL Page does not exist!');
});

/***************CHECKS if URL exists for given ID ***************/
app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    let longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.status(404).send("ERROR!!!Page does not exist!!");
    res.redirect('/login');
  }
});

/************** GENERATES shortURL ***************/
app.post('/urls', (req, res) => {
  if (req.session.userId === undefined) {
    res.status(403).send("Please LOGIN!!!");
    return;
  }
  let newShortURL = generateRandomString(6);
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userId: req.session.userId
  };
  res.redirect(`/urls/${newShortURL}`);
});

/*************** UPDATES the URL ***************/
app.post('/urls/:shortURL', (req, res) => {
  if (req.session.userId === undefined) {
    res.status(403).send("Please LOGIN!!!");
    return;
  } else if (urlDatabase[req.params.shortURL].userId !== req.session.userId) {
    res.status(403).send("NO ACCESS to this URL!!!!");
    return res.redirect('/login');
  } else {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect(`/urls/${req.params.shortURL}`);
  }
});

/*************** DELETES the URL ***************/
app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session.userId === urlDatabase[req.params.shortURL].userId) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
    return;
  } else if (req.session.userId === undefined) {
    res.status(403).send("Please LOGIN!!!");
    return;
  } else if (req.session.userId !== urlDatabase[req.params.shortURL].userId) {
    res.status(403).send("NO ACCESS to this URL!!!!");
    return;
  }
});

/**************************************************/
// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// });
/*************** LOGIN Page ***************/
app.get('/login', (req, res) => {
  let templateVars = {
    user: req.session.userId,
    email: req.session.email
  };
  res.render('login.ejs', templateVars);
});

app.post('/login', (req, res) => {
  if (req.body.email === '') {
    res.status(400).send("E-MAIL CANNOT BE EMPTY!!!");
    return;
  }

  for (let user in users) {
  //checks if email & password match an exixting user
    if (req.body.email === users[user].email) {
      if (bcrypt.compareSync(req.body.password, users[user].password)) {
        req.session.userId = users[user].id;
        req.session.email = users[user].email;
        return res.redirect('/urls');
      }
    }
  }
  res.status(403).send("INVALID E-MAIL & PASSWORD!!!");
  res.redirect('/urls');
});

/*************** REGISTRATION Page ***************/
app.get('/register', (req, res) => {
  let templateVars = {
    user: req.session.userId,
    email: req.session.email
  };
  res.render('register.ejs', templateVars);
});

app.post('/register', (req, res) => {
  let randomUserID = generateRandomString(6);
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    
  //Handling registration errors
  if (req.body.email === '' || hashedPassword === '') {
    res.status(400).send('Please enter valid Email and Password!');
  } else if (getUseridByEmail(req.body.email)) {
    res.status(400).send("This Email has been already registered");
  } else {
    users[randomUserID] = {
      id: randomUserID,
      email: req.body.email,
      password: hashedPassword
    };
    //set cookies
    req.session.userId = randomUserID;
    req.session.email = req.bosy.email;
    res.redirect('/urls');
  }
});
  
/********** LOGOUT page => deletes cookie **********/
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

/********** DEFAULT PORT **********/
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});
