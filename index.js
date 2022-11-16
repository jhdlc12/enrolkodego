const express = require("express");
const app = express();
const port = 7000;
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./.env" });

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", require("./routes/enrolRoutes"));
app.use("/auth", require("./routes/auth"));
app.use(cookieParser());

app.listen(port, () => {
  console.log("~SERVER STARTED~");
});
