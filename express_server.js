const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');
const saltRounds = 10;
const app = express();
const PORT = 8080;
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
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
}

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    keys: [
      '8f232fc4-47de-41a1-a8cd-4f9323253715',
      '1279e050-24c2-4cc6-a176-3d03d66948a2',
    ],
  }),
);

app.get("/urls", (req, res) => {
  let user = users[req.session.user_id];
  if (!user) {
    res.status(403).send('You must be registered and logged in to view this page');
  } else {
    let templateVars = {
      urls: urlsForUser(user.id, urlDatabase),
      user: user
    };
    res.render("urls_index", templateVars);
  }
});

app.post("/urls", (req, res) => {
  let user = users[req.session.user_id];
  if (!user) {
    res.status(403).send('You must be registered and logged in to view this page');
  } else {
    const urlId = generateRandomString();
    urlDatabase[urlId] = {
      longURL: req.body.longURL,
      userID: req.session.user_id
    };
    res.redirect('/urls/' + urlId);
  }
});

app.get("/urls/new", (req, res) => {
  let user = users[req.session.user_id];
  if (!user) {
    res.redirect('/login');
  } else {
    let templateVars = {
      user: user
    };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let user = users[req.session.user_id];
  if (!user) {
    res.status(403).send('You must be registered and logged in to view this page');
  } else {
    if (urlDatabase[req.params.shortURL]['userID'] !== user.id) {
      res.status(403).send('This URL was not created under this account');
    } else {
      let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL]['longURL'],
        user, user
      };
      res.render("urls_show", templateVars);
    }
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let user = users[req.session.user_id];
  if (!user) {
    res.status(403).send('You must be registered and logged in to delete a URL');
  } else {
    if (urlDatabase[req.params.shortURL]['userID'] !== user.id) {
      res.status(403).send('This URL was not created under this account');
    } else {
      delete urlDatabase[req.params.shortURL];
      res.redirect('/urls');
    }
  }
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL]['longURL'] = req.body.updatedLongURL;
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = urlDatabase[req.params.shortURL];
  if (!shortURL) {
    res.status(404).send('The specified short URL cannot be found');
  } else {
    const longURL = urlDatabase[req.params.shortURL]['longURL'];
    res.redirect(longURL);
  }
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: null
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  let user = getUserByEmail(req.body.email, users);
  if (!user) {
    res.status(403).send('An account with that email cannot be found');
  } else {
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.status(403).send('Incorrect password');
    } else {
      req.session.user_id = user.id;
      res.redirect('/urls');
    }
  }
});

app.get("/register", (req, res) => {
  let user = users[req.session.user_id];
  let templateVars = {
    user: user
  };
  res.render("urls_reg", templateVars);
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Email and/or password not supplied');
  } else if (getUserByEmail(req.body.email, users)) {
    res.status(400).send('Email already exists in database');
  } else {
    const userId = generateRandomString();
    users[userId] = {
      id: userId,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, saltRounds)
    }
    req.session.user_id = userId;
    res.redirect('/urls');
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});