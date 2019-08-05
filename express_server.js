
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs"); //Set ejs as the view engine


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//In the browser => http://localhost:8080/urls.json => 
//We expect to see a JSON string representing the entire urlDatabase object


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

/*
node express_server.js
Example app listening on port 8080!
vagrant [tinyapp]> curl -i http://localhost:8080/hello
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 45
ETag: W/"2d-+kq4PwugtS0rt17Ooq6yKzvojSE"
Date: Mon, 05 Aug 2019 22:28:24 GMT
Connection: keep-alive

<html><body>Hello <b>World</b></body></html>
*/
