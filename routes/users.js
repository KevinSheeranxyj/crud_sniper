var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.put("/user", (req, res) => {
  res.send("Got a PUT request at /user");
});

router.post("/", (req, res) => {
  res.send("Got a POST request");
});

app.delete("/user", (req, res) => {
  res.send("Got a DELETE request at /user");
});

module.exports = router;
