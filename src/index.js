const path = require("path");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

app.use(express.json());
const route = require("./routes");
const db = require("./config/db");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");

const handlebars = require("handlebars");

// Connect to Database
db.connect();

// Định nghĩa helper 'reduce'
handlebars.registerHelper("reduce", function (array, options) {
    return array.reduce((acc, current) => {
        acc.push(options.fn(current)); // Lặp qua từng phần tử và áp dụng block
        return acc;
    }, []);
});

app.use(express.static(path.join(__dirname, "public")));

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(flash());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());

app.use(passport.session());

app.use(express.json()); // Dành cho JSON

// HTTP logger
app.use(morgan("combined"));

// Template engine
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        helpers: {
            multiply: (a, b) => a * b,
        },
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
