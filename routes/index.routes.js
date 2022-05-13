const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const AuthRoutes = require("./auth.routes");
router.use("/auth", AuthRoutes);

module.exports = router;
