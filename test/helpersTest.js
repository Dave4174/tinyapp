const { assert } = require('chai');
const { getUserByEmail, generateRandomString, urlsForUser } = require('../helpers.js');

// ************************

const testUsers = {
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

describe('getUserByEmail', function() {
  it('should return a user when passed a valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = testUsers["userRandomID"];
    assert.deepEqual(user, expectedOutput);
  });

  it('should return false when passed an invalid email', function() {
    const user = getUserByEmail("user@somebadexample.com", testUsers)
    assert.isFalse(user);
  });
});

// ************************

describe('generateRandomString', function() {
  it('should return a random string of letters and numbers', function() {
    const randomString = generateRandomString();
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const areAllCharsPresent = function() {
      for (let charIndex in randomString) {
        if (!possible.includes(randomString[charIndex])) {
          return false;
        }
      }
      return true;
    }
    assert.isTrue(areAllCharsPresent());
  });
});

// ************************

const testUrlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "f7Re57" }
};

describe('urlsForUser', function() {
  it('should return a subset of the url database when passed a valid user ID', function() {
    const urlId = "b6UTxQ";
    const userId = "aJ48lW"
    let expectedOutput = {};
    const filteredDatabase = urlsForUser(userId, testUrlDatabase)
    expectedOutput[urlId] = testUrlDatabase[urlId];
    assert.deepEqual(filteredDatabase, expectedOutput);
  });

  it('should return an empty object when passed an invalid url ID', function() {
    const urlId = "b6UTxQ";
    const userId = "gJ4s9Q"
    const filteredDatabase = urlsForUser(userId, testUrlDatabase)
    let expectedOutput = {};
    assert.deepEqual(filteredDatabase, expectedOutput);
  });
});