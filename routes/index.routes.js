const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const AuthRoutes = require("./auth.routes");
router.use("/auth", AuthRoutes);

const CollectionRoutes = require("./collection.routes");
router.use("/collection", CollectionRoutes);

module.exports = router;
