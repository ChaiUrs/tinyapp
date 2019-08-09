
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
  return false;
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

module.exports = { generateRandomString, getUseridByEmail, urlsForUser, passwordMatch }

