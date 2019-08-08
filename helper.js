
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

const getUseridByEmail = function(email, users) {
  for (let userID in users) {
    if (users[userID].email === email) {
      return userID;
    } 
  }
  return false;
};

const getUserObject = function(usersObj, userid) {
  if (usersObj[userid]) {
    return usersObj[userid];
  }
  return {
    id: '',
    email: '',
    password: '',
  };
};

module.exports = { getUseridByEmail, generateRandomString, getUserObject  }
