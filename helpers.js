const getUserByEmail = function(searchEmail, database) {
  for (let userId in database) {
    if (database[userId].email === searchEmail) {
      return database[userId];
    }
  }
  return false;
};

const generateRandomString = function() {
  const length = 6;
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const urlsForUser = function(id, urlDatabase) {
  let filteredUrlDatabase = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL]['userID'] === id) {
      filteredUrlDatabase[shortURL] = urlDatabase[shortURL];
    }
  }
  return filteredUrlDatabase;
};

module.exports = { getUserByEmail, generateRandomString, urlsForUser };