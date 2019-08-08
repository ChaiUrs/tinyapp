
const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { getUseridByEmail, generateRandomString, getUserObject} = require('./helper.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs'); //Set ejs as the view engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "cp26bm": "http://www.instagram.com"
};

const users = { 
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
}

//MAIN Page
app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase
  };
  templateVars.user = getUserObject(users, req.cookies.user_id)
  res.render('urls_index.ejs', templateVars);
});

app.post('/urls', (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  let newRandomURL = generateRandomString(6);
  urlDatabase[newRandomURL] = req.body.longURL;
  console.log(urlDatabase);
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${newRandomURL}`);
});

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});

//READ
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//ADD
app.get('/urls/new', (req, res) => {
  let templateVars = {};
  templateVars.user = getUserObject(users, req.cookies.user_id);
  res.render('urls_new.ejs', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.longURL]
  };
  templateVars.user = getUserObject(users, req.cookies.user_id);
  res.render('urls_show.ejs', templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//DELETE
//Added a POST route that removes an existing shortened URLs from database
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//LOGIN page
app.get('/login', (req, res) => {
  let templateVars = {};
  templateVars.user = getUserObject(users, req.cookies.user_id);
  res.render('login.ejs', templateVars);
});

app.post('/login', (req, res) => {
  const user_ID = getUseridByEmail(req.body.email, users);
  if (user_ID && (users[user_ID].password === req.body.password)) {
    res.cookie('user_id', user_ID);
    res.redirect('/urls');
  } else {
    res.status(403).send('Email or Password did not match!');
  }
});
  

//LOGOUT page
app.post('/logout', (req, res) => {
  res.clearCookie('user_id'); //clears login cookie
  res.redirect('/urls');
});

//REGISTRATION page
app.get('/register', (req, res) => {
  let templateVars = {};
  templateVars.user = getUserObject(users, req.cookies.user_id);
  res.render('register.ejs', templateVars);
});

app.post('/register', (req, res) => {
  //Handling registration errors
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Email or Password are empty!');
  } else if (getUseridByEmail(req.body.email, users)) { //from email lookup helper function
    res.status(400).send("Email has been already registered");
  } else {
    let random_userID = generateRandomString(10); //to generate a random user ID
    users[random_userID] = {  //added a new user object
      id: random_userID,
      email: req.body.email,
      password: req.body.password
    };
    res.cookie('user_id', random_userID); //setting a user_id cookie containing the user's newly generated ID.
    console.log(users);
    res.redirect('/urls');  
  }
});

//Handles all the requests defined in /urls
app.get("*", (req, res) => {
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/*
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});
*/

