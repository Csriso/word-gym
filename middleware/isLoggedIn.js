module.exports = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.user) {
    return res.redirect("/auth/login");
    res.locals.user = undefined
  }
  req.user = req.session.user;
  res.locals.user = req.session.user
  next();
};
