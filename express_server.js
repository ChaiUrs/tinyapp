
/*************** GLOBAL CONTENT ***************/
const express = require('express');
const app = express();
const PORT = 8080; 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
//const { generateRandomString, getUseridByEmail, urlsForUser, passwordMatch } = require('/helper.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 //24 hours
}));


/*************** URLs database ***************/
//Added a new userID property to individual url objects within the urlDatabase
let urlDatabase = { 
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" }, 
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};


/*************** Users object ***************/
let users = { 
  "userRandomID": {
    id: "userRandomID1", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"   
  },
 "user2RandomID": {
    id: "userRandomID2", 
    email: "user2@example.com", 
    password: "dishwasher-funk"  
  }
};


/*************** ROOT Page ***************/
app.get('/', (req, res) => {
  let userID = req.session["userID"];
  if(users.hasOwnProperty(userID)) { //checks if a property exists in an object or not
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});


/*************** MAIN/INDEX Page ***************/
app.get('/urls', (req, res) => {
  let userID = req.session["userID"];
  let userObject = users[userID];
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.userID],
    urls: urlsForUser(userID)
  };
  res.render('urls_index.ejs', templateVars);
});


/*************** Created new shortURLs Page ***************/
app.get('/urls/new', (req, res) => {
  if(req.session.userID) {
    let templateVars = {
      user: users[req.session.userID]
    };
    res.render('urls_new.ejs', templateVars);
  } else {
    res.redirect('/login');
  }
});


/*************** SHOWS updated shortURLs Page ***************/
app.get('/urls/:id', (req, res) => {
  let url = urlDatabase[req.params.id];
  if(url === undefined) {
    res.status(403).send("URL for the given ID does not Exist!!!")
  } else if (req.session.userID === undefined) {
    res.status(403).send("Please LOGIN!!!")
  } else if (url.userID !== req.session.userID) {
    res.status(403).send("NO ACCESS to this URL!!!!");

    //if user is logged in & owns the URL for given ID
  } else if (url) {
    let templateVars = {
      user: users[req.session.userID],
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].longURL
    };
    res.render('urls_show.ejs', templateVars);
  } else {
    res.status(404).send('ERROR!!! This URL Page does not exist!');
  }
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
  if (!req.session.userID){
    res.status(403).send("Please LOGIN!!!");
    return;
  }
  let newShortURL = generateRandomString(6);
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userID
  };
  res.redirect(`/urls/${newShortURL}`);
});


/*************** UPDATES the URL ***************/
app.post('/urls/:id', (req, res) => {
  if (req.session.userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect('/urls');
    return;
  } else if (!req.session.userID) {
    res.status(403).send("Please LOGIN!!!");
    return;
  } else if (urlDatabase[req.params.id].userID !== req.session.userID) {
    res.status(403).send("NO ACCESS to this URL!!!!");
    return;
  }
});


/*************** DELETES the URL ***************/
app.post('/urls/:id/delete', (req, res) => {
  if (req.session.userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
    return;
  } else if (!req.session.userID) {
    res.status(403).send("Please LOGIN!!!");
    return;
  } else if (urlDatabase[req.params.id].userID !== req.session.userID) {
    res.status(403).send("NO ACCESS to this URL!!!!");
    return;
  }
});


/**************************************************/
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


/*************** LOGIN Page ***************/
app.get('/login', (req, res) => {
  res.render('login.ejs'); 
});

app.post('/login', (req, res) => {
  let userID = getUseridByEmail(req.body.email);
  
  // if (!userID) {
  //   res.status(403).send("INVALID E-MAIL");
  //   return;
  // }

  //checks if email & password match an exixting user
  if (!(userID && (passwordMatch(userID, req.body.password)))) {
    res.status(403).send("INVALID E-MAIL & PASSWORD!!!");
    return;
  } else {
    req.session.userID = userID; //sets a cookie
    res.redirect("/urls"); 
  }
});
  
      
/*************** REGISTRATION Page ***************/
app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', (req, res) => {
  let random_userID = generateRandomString(6);

  //Handling registration errors
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Email and Password cannot be empty!');
    return;
  
  } else {
    for (let user in users) {
      if (users[user].email === req.body.email) {
        res.status(400).send("This Email has been already registered");
        return;
      }
    }
  }
  users[random_userID] = {
    id: random_userID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  req.session.userD = random_userID;
  res.redirect('/urls');
});
  
/********** LOGOUT page => deletes cookie **********/
app.post('/logout', (req, res) => {
  res.session = null;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


/*******************HELPER FUNCTIONS******************/

let generateRandomString = function(charsLength) {
  let newRandomURL = '';
  let randomChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < charsLength; i++) {
    let randomNumber = Math.floor(Math.random() * randomChars.length);
    newRandomURL += randomChars[randomNumber];
  }
  return newRandomURL;
};
//console.log(generateRandomString(6));


let getUseridByEmail = (email) => {
  for (let user in users) {
    //console.log(user);
    if (users[user].email === email) {
      return users[user].id;
    }
  }
};


let urlsForUser = (id) => {
  let urlsObj = {};
  for (let urlID in urlDatabase) {
    if (id === urlDatabase[urlID].userID) {
      
      urlsObj[urlID] = {
        userID: urlDatabase[urlID].userID,
        shortURL: urlDatabase[urlID].shortURL,
        longURL: urlDatabase[urlID].longURL,
        currentUser: id === urlDatabase[urlID].userID
      }   
    }
  }
  return urlsObj;
};

//check if password matches userid
let passwordMatch = (userID, password) => {
  return bcrypt.compareSync(password, users[userID].password);
}

