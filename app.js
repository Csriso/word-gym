// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

hbs.registerPartials(__dirname + "/views/partials");

hbs.registerHelper("dateFormat", function (date) {
  const arrDate = date.toString().split(" ");
  let returnStr = `${arrDate[2]} ${arrDate[1]} ${arrDate[3]}`;
  return returnStr;
});

hbs.registerHelper("capitalize", function (str) {
  return str[0].toUpperCase() + str.slice(1);
});

hbs.registerHelper("when", (operand_1, operator, operand_2, options) => {
  let operators = {                     //  {{#when <operand1> 'eq' <operand2>}}
    'eq': (l,r) => l == r,              //  {{/when}}
    'noteq': (l,r) => l != r,
    'gt': (l,r) => (+l) > (+r),                        // {{#when var1 'eq' var2}}
    'gteq': (l,r) => ((+l) > (+r)) || (l == r),        //               eq
    'lt': (l,r) => (+l) < (+r),                        // {{else when var1 'gt' var2}}
    'lteq': (l,r) => ((+l) < (+r)) || (l == r),        //               gt
    'or': (l,r) => l || r,                             // {{else}}
    'and': (l,r) => l && r,                            //               lt
    '%': (l,r) => (l % r) === 0                        // {{/when}}
  }
  let result = operators[operator](operand_1,operand_2);
  if(result) return options.fn(this); 
  return options.inverse(this);       
});

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalized = require("./utils/capitalized");
const projectName = "word-gym";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
