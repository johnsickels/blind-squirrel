// import deps
const express = require("express");
const routes = require("./routes");

// mount secrets
require("dotenv").config();

// create a new express application
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", routes);

// support dynamic port
const port = process.env.PORT || 3001;

// start listening
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
