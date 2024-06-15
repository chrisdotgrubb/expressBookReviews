const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');

public_users.post("/register/:username/:password", (req,res) => {
    const username = req.params.username;
    const password = req.params.password;
    if (username && password) {
      if (false) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.post("/login/:username/:password", (req,res) => {
    const username = req.params.username;
    const password = req.params.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (true) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
    //   req.session.authorization = {
    //     accessToken,username
    // }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const result = await books;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json(error)
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try {
    const book = await books[req.params.isbn]
    return res.status(200).json(book || {message: 'Book not found'});
  } catch (error) {
    return res.status(400).json(error)
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const getResults = () => {
    const _result = [];
    for (const i in books) {
        if (books[i].author === req.params.author) {
            _result.push(books[i])
        }
    }
    return _result
  }
  try {
    const result = await getResults()
    return res.status(200).json(result.length ? result : {message: 'Author not found'});
} catch (error) {
    return res.status(400).json(error)
}
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const getResults = () => {
        const _result = [];
        for (const i in books) {
        if (books[i].title.replaceAll(' ', '-') === req.params.title) {
            _result.push(books[i])
        }
        }
        return _result
    }
    const result = await getResults();
    return res.status(200).json(result.length ? result : {message: 'Title not found'});
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const book = books[req.params.isbn]
  return res.status(200).json(book ? book.reviews : {message: 'Book not found'});
 });

module.exports.general = public_users;
