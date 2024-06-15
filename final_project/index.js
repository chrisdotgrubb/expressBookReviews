const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const books = require('./router/booksdb.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/:username/:password/*", function auth(req,res,next){
const username = req.params.username;
  const password = req.params.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    console.log(req.session)
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});
 
app.put("/auth/review/:isbn/:review", (req, res) => {
    //Write your code here
    const book = books[req.params.isbn]
    book.review = req.params.review
    return res.status(200).json(book);
  });
app.delete("/auth/delete/:isbn/", (req, res) => {
    const book = books[req.params.isbn]
    book.review = {chris: 'very good book'};
    return res.status(200).json(book);
})
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);


app.listen(PORT,()=>console.log("Server is running"));
