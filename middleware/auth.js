module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session.user) return next();
    return res.redirect("/login");
  },

  ensureSupervisor: (req, res, next) => {
    if (
      req.session.user &&
      (req.session.user.ehSupervisor || req.session.user.ehAdmin)
    ) {
      return next();
    }
    return res.status(403).send("Acesso negado.");
  },
};
