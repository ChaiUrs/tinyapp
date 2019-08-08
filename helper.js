
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

const getUserByEmail = (email, users) => {
  for (const user in users) {
    if (users[user].email === email) {
      return { valid: true, user };
    } else {
      return { valid: false };
    }
  }
};


module.exports = { getUserByEmail, generateRandomString }
