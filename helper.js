
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
    console.log(user);
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};


let urlsForUser = (id) => {
  let urlsObj = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].user_id === id) {
      urlsObj[shortURL] = urlDatabase[shortURL];
    }
  }
  return urlsObj;
};

module.exports = { generateRandomString, getUseridByEmail, urlsForUser }

