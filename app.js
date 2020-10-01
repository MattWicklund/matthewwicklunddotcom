var express        = require("express"),
    app            = express(),
    session        = require("express-session"),
    cookieParser   = require("cookie-parser"),
    bodyParser     = require("body-parser"),
    flash          = require("connect-flash"),
    cors           = require("cors"),
    dotenv         = require("dotenv"),
    methodOverride = require("method-override"),
    mysql          = require("mysql"),
    mariadb        = require("mariadb")

    const port = 3000;

    dotenv.config();

    // Setting Middleware
    app.use(express.static('public'));

    app.use(express.static(__dirname + '/images'));

    app.use(cookieParser());
    app.use(session({
      secret:'happy boy',
      saveUninitialized: false,
      resave: false,
      cookie: {maxAge: 60000}
    }));

    app.use(flash());

    app.use(function(req, res, next){
      res.locals.message = req.flash('message');
      next();
    });

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended : false }));

    //CONNECT mySQL
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'mattjtln_mattwicklund',
      password: 'Plasmoid212',
      port: 3306,
      database: 'mattjtln_MatthewWicklundMailList'
    });

    connection.connect((err) => {
      if(err) {
        console.log('Error connecting to the Db!');
      } else {
        console.log('mySQL Connected');
      }
    });

    // connection.end((err) => {
    //   //Graceful term of connection. Remaining queries exec. Quit packet sent to server.
    // });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public/stylesheets/'));
// app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//ROUTES

app.get("/", function(req, res){
  res.render("home");
});

app.get("/gear", function(req, res){
  res.render("gear");
});

app.get("/blog", function(req, res){
  res.render("blog");
});

app.get("/guitarLessons", function(req, res){
  res.render("guitarLessons");
});

app.get("/introToTheory", (req, res) => {
  res.render("introToTheory");
});

app.get("/linux", function(req, res){
  res.render("linux");
});

app.get("/mailingList", function(req, res){
  res.render("mailingList");
});

app.get("/signupThanks", (req, res) => {
  res.render("signupThanks");
});

// CREATE A DATABASE
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE testdb";
  connection.query(sql, (err, result) => {
    if(err){
      console.log(err);
    } else {
      console.log(result);
      res.send("database created!");
    }
  })
});

app.get("*", (req,res) => {
  res.render("error");
});

// MAILING LIST Post ROUTES
app.post("/mailingList", (req, res) => {
  console.log(req.body.name);
  console.log(req.body.email);
      var sql = "INSERT INTO `userTable` (`name`, `email`) VALUES ('" + req.body.name + "', '" + req.body.email + "')";
      connection.query(sql, function (err, result) {
        if(err){
          console.log(err);
        } else {
          console.log("Data Inserted");
          req.flash("message", "You've been successfully added to my mailing list!");
          res.redirect("/");
        }
      });
    });

app.listen(3000, () => {
    console.log("Server Listening on port " + port + "!");
});
