const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("index");
});
router.get("/enroll", function (req, res) {
  res.render("enroll");
});

module.exports = router;
