
const generateRandomString = function(charsLength) {
  let newRandomURL = '';
  let randomChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < charsLength; i++) {
    let randomNumber = Math.floor(Math.random() * randomChars.length);
    newRandomURL += randomChars[randomNumber];
  }
  return newRandomURL;
};
//console.log(generateRandomString(6));

const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs'); //Set ejs as the view engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "cp26bm": "http://www.instagram.com"
};

//BROWSE
app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };
  res.render('urls_index.ejs', templateVars);
});

//READ
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.longURL],
    username: req.cookies.username
  };
  res.render('urls_show.ejs', templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//ADD
//Added a POST route that updates a URL resource
app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls', templateVars);
});

app.post('/urls', (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let newRandomURL = generateRandomString(6);
  urlDatabase[newRandomURL] = req.body.longURL;
  console.log(urlDatabase);
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${newRandomURL}`);
});

app.get('/urls/new', (req, res) => {
  let templateVars = {
    username: req.cookies.username
  };
  res.render('urls_new.ejs', templateVars);
});

//DELETE
//Added a POST route that removes an existing shortened URLs from database
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
});

//Added a LOGIN route
app.post('/login', (req, res) => {
  //set a cookie "username" to the value submitted in request body
  console.log(req.body.username);
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

//Added a LOGOUT route
app.post('/logout', (req, res) => {
  // clear username cookie
  res.clearCookie('username');
  res.redirect('/urls');
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
