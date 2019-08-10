
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


let getUseridByEmail = (users, email) => {
  for (let user in users) {
    console.log(user);
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = { generateRandomString, getUseridByEmail }

