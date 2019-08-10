
const { assert } = require('chai');
const { getUseridByEmail } = require('../helper.js');

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
};

describe('getUseridByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUseridByEmail(users, "user@example.com");
    const expectedOutput = true;
    assert.deepEqual(user, expectedOutput);
  });

  it('should return false with an invalid email', function(){
    const user = getUseridByEmail(users, "pbehryab@asrgkutgw.com")
    const expectedOutput = false;
    assert.deepEqual(user, expectedOutput)
  })
});
